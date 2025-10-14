import { useAuth } from "@/contexts/AuthContext";
import { exampleWhoopMetrics, WhoopMetrics } from "@/schemas/whoop";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

interface UseWhoopDataProps {
  firebaseId?: string;
  date?: Date;
}

// Cache to store fetched data by firebase_id and date
const dataCache = new Map<string, WhoopMetrics>();

export function useWhoopData({
  firebaseId,
  date = new Date(),
}: UseWhoopDataProps = {}) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<WhoopMetrics>(exampleWhoopMetrics);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      return;
    }

    // Check cache first
    const cacheKey = `${firebaseId || user.uid}-${date.toISOString().split("T")[0]}`;
    if (dataCache.has(cacheKey)) {
      const cachedData = dataCache.get(cacheKey)!;
      setMetrics(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        firebase_id: firebaseId || user.uid,
        day: date.toISOString(),
      });
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/app/day?${params}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const whoopMetrics =
          (Object.values(data)[0] as WhoopMetrics) || exampleWhoopMetrics;

        // Cache the data
        dataCache.set(cacheKey, whoopMetrics);
        setMetrics(whoopMetrics);
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [user, firebaseId, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchData,
  };
}
