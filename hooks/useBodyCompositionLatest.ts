import { useAuth } from "@/contexts/AuthContext";
import ExpiringCache from "@/utils/ExpiringCache";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

export interface BodyComposition {
  id: string;
  firebase_id: string;
  weight?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  measurement_date: string;
  [key: string]: any;
}

interface UseBodyCompositionLatestProps {
  firebase_id?: string;
}

interface UseBodyCompositionLatestReturn {
  data: BodyComposition | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Cache to store fetched data by firebase_id (expires after 1 minute)
const dataCache = new ExpiringCache<BodyComposition | null>(1);

export function useBodyCompositionLatest({
  firebase_id,
}: UseBodyCompositionLatestProps): UseBodyCompositionLatestReturn {
  const { user } = useAuth();
  const [data, setData] = useState<BodyComposition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBodyCompositionLatest = useCallback(async () => {
    if (!user) {
      return;
    }

    // If firebase_id is undefined, use the current user's uid
    const playerId = firebase_id || user.uid;

    // Check cache first
    const cacheKey = `${playerId}`;
    const cachedData = dataCache.get(cacheKey);
    if (cachedData !== undefined) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/body-composition/latest/${playerId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const responseData = await response.json();

      // Cache the data
      dataCache.set(cacheKey, responseData);
      setData(responseData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch latest body composition data";
      console.error("Error fetching latest body composition:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, firebase_id]);

  const refetch = useCallback(async () => {
    // Clear the specific cache key before refetching
    const playerId = firebase_id || user?.uid;
    if (playerId) {
      const cacheKey = `${playerId}`;
      dataCache.delete(cacheKey);
    }
    await fetchBodyCompositionLatest();
  }, [fetchBodyCompositionLatest, firebase_id, user]);

  const clearCache = useCallback(() => {
    dataCache.clear();
  }, []);

  useEffect(() => {
    fetchBodyCompositionLatest();
  }, [fetchBodyCompositionLatest]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
}
