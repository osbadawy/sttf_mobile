import { useAuth } from "@/contexts/AuthContext";
import { SelfAssessmentData } from "@/schemas/selfAssessment";
import ExpiringCache from "@/utils/ExpiringCache";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

interface UseSelfAssessmentsProps {
  firebaseId?: string;
  date?: Date;
}

// Cache to store fetched data by firebase_id and date (expires after 10 minutes)
const dataCache = new ExpiringCache<SelfAssessmentData[] | undefined>(10);

export function useSelfAssessments({
  firebaseId,
  date = new Date(),
}: UseSelfAssessmentsProps = {}) {
  const { user } = useAuth();
  const [data, setData] = useState<SelfAssessmentData[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      return;
    }

    // Check cache first
    const cacheKey = `${firebaseId || user.uid}-${date.toISOString().split("T")[0]}`;
    const cachedData = dataCache.get(cacheKey);
    if (cachedData !== null) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        firebase_id: firebaseId || user.uid,
      });
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/player-self-assessment/day?${params}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        // Handle array response from the API
        const selfAssessmentData: SelfAssessmentData[] | undefined =
          Array.isArray(responseData) ? responseData : undefined;

        // Cache the data
        dataCache.set(cacheKey, selfAssessmentData);
        setData(selfAssessmentData);
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching self-assessment data:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch self-assessment data",
      );
    } finally {
      setLoading(false);
    }
  }, [user, firebaseId, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
