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

interface UseBodyCompositionsProps {
  firebase_id?: string;
  limit?: number;
}

interface UseBodyCompositionsReturn {
  data: BodyComposition[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Cache to store fetched data by firebase_id and limit (expires after 1 minute)
const dataCache = new ExpiringCache<BodyComposition[]>(1);

export function useBodyCompositions({
  firebase_id,
  limit = 10,
}: UseBodyCompositionsProps): UseBodyCompositionsReturn {
  const { user } = useAuth();
  const [data, setData] = useState<BodyComposition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBodyCompositions = useCallback(async () => {
    if (!user) {
      return;
    }

    // If firebase_id is undefined, use the current user's uid
    const playerId = firebase_id || user.uid;

    // Check cache first
    const cacheKey = `${playerId}-${limit}`;
    const cachedData = dataCache.get(cacheKey);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("firebase_id", playerId);
      params.append("limit", limit.toString());

      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/body-composition?${params}`;

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
      const itemsData = Array.isArray(responseData) ? responseData : [];

      // Cache the data
      dataCache.set(cacheKey, itemsData);
      setData(itemsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch body composition data";
      console.error("Error fetching body compositions:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, firebase_id, limit]);

  const refetch = useCallback(async () => {
    // Clear the specific cache key before refetching
    const playerId = firebase_id || user?.uid;
    if (playerId) {
      const cacheKey = `${playerId}-${limit}`;
      dataCache.delete(cacheKey);
    }
    await fetchBodyCompositions();
  }, [fetchBodyCompositions, firebase_id, limit, user]);

  const clearCache = useCallback(() => {
    dataCache.clear();
  }, []);

  useEffect(() => {
    fetchBodyCompositions();
  }, [fetchBodyCompositions]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
}
