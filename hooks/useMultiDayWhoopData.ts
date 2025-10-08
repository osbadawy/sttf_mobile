import { useAuth } from "@/contexts/AuthContext";
import { MultiDayWhoopMetrics } from "@/schemas/whoop";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

interface UseMultiDayWhoopDataProps {
  firebaseId?: string;
  days?: string;
}

interface UseMultiPlayerWhoopDataProps {
  primaryFirebaseId?: string;
  selectedPlayerFirebaseId?: string;
  days?: number;
}

// Cache to store fetched data by firebase_id
const dataCache = new Map<string, MultiDayWhoopMetrics>();

export function useMultiDayWhoopData({
  firebaseId,
  days = "14",
}: UseMultiDayWhoopDataProps = {}) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<MultiDayWhoopMetrics>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        setError(null);

        try {
          const params = new URLSearchParams({
            firebase_id: firebaseId || user.uid,
            days,
          });
          const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/app/days?${params}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });
          const data = await response.json();
          setMetrics(data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(
            error instanceof Error ? error.message : "Failed to fetch data",
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user, firebaseId, days]);

  return {
    metrics,
    loading,
    error,
  };
}

export function useMultiPlayerWhoopData({
  primaryFirebaseId,
  selectedPlayerFirebaseId,
  days = 14,
}: UseMultiPlayerWhoopDataProps = {}) {
  const { user } = useAuth();
  const [primaryMetrics, setPrimaryMetrics] = useState<MultiDayWhoopMetrics>(
    {},
  );
  const [selectedPlayerMetrics, setSelectedPlayerMetrics] =
    useState<MultiDayWhoopMetrics>({});
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [selectedPlayerLoading, setSelectedPlayerLoading] = useState(false);
  const [primaryError, setPrimaryError] = useState<string | null>(null);
  const [selectedPlayerError, setSelectedPlayerError] = useState<string | null>(
    null,
  );

  const fetchPlayerData = useCallback(
    async (firebaseId: string, isSelectedPlayer = false) => {
      if (!user || !firebaseId) {
        return;
      }

      // Check cache first
      const cacheKey = `${firebaseId}-${days}`;
      if (dataCache.has(cacheKey)) {
        const cachedData = dataCache.get(cacheKey)!;
        if (isSelectedPlayer) {
          setSelectedPlayerMetrics(cachedData);
        } else {
          setPrimaryMetrics(cachedData);
        }
        return;
      }

      // Set loading state
      if (isSelectedPlayer) {
        setSelectedPlayerLoading(true);
        setSelectedPlayerError(null);
      } else {
        setPrimaryLoading(true);
        setPrimaryError(null);
      }

      try {
        const params = new URLSearchParams({
          firebase_id: firebaseId,
          days: days.toString(),
        });
        const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/app/days?${params}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });
        const data = await response.json();

        // Cache the data
        dataCache.set(cacheKey, data);

        // Set the appropriate state
        if (isSelectedPlayer) {
          setSelectedPlayerMetrics(data);
        } else {
          setPrimaryMetrics(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch data";
        if (isSelectedPlayer) {
          setSelectedPlayerError(errorMessage);
        } else {
          setPrimaryError(errorMessage);
        }
      } finally {
        if (isSelectedPlayer) {
          setSelectedPlayerLoading(false);
        } else {
          setPrimaryLoading(false);
        }
      }
    },
    [user, days],
  );

  // Fetch primary player data
  useEffect(() => {
    if (primaryFirebaseId) {
      fetchPlayerData(primaryFirebaseId, false);
    }
  }, [primaryFirebaseId, fetchPlayerData]);

  // Fetch selected player data
  useEffect(() => {
    if (selectedPlayerFirebaseId) {
      fetchPlayerData(selectedPlayerFirebaseId, true);
    } else {
      // Clear selected player data when no player is selected
      setSelectedPlayerMetrics({});
      setSelectedPlayerError(null);
    }
  }, [selectedPlayerFirebaseId, fetchPlayerData]);

  return {
    primaryMetrics,
    selectedPlayerMetrics,
    primaryLoading,
    selectedPlayerLoading,
    primaryError,
    selectedPlayerError,
  };
}
