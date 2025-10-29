import { useAuth } from "@/contexts/AuthContext";
import { PlannedActivity } from "@/schemas/PlannedActivity";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import { PlayerSelfAssessment } from "@/schemas/PlayerSelfAssessment";
import ExpiringCache from "@/utils/ExpiringCache";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

export type PlayerDayItem =
  | {
      type: "assessment";
      category: string;
      time: Date;
      isCompleted: boolean;
      data: PlayerSelfAssessment | null;
    }
  | {
      type: "meal";
      category: string;
      time: Date;
      isCompleted: boolean;
      data: GetMealsResponse;
    }
  | {
      type: "activity";
      category: string;
      time: Date;
      isCompleted: boolean;
      data: PlannedActivity;
    };

interface UsePlayerDayProps {
  firebase_id?: string;
  day: Date;
}

interface UsePlayerDayReturn {
  data: PlayerDayItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Cache to store fetched data by firebase_id and date (expires after 1 minute)
const dataCache = new ExpiringCache<PlayerDayItem[]>(1);

export function usePlayerDay({
  firebase_id,
  day,
}: UsePlayerDayProps): UsePlayerDayReturn {
  const { user } = useAuth();
  const [data, setData] = useState<PlayerDayItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerDay = useCallback(async () => {
    if (!user) {
      return;
    }

    // If firebase_id is undefined, use the current user's uid
    const playerId = firebase_id || user.uid;

    // Check cache first
    const cacheKey = `${playerId}-${day.toISOString().split("T")[0]}`;
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
      params.append("day", day.toISOString());

      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/user/player/day?${params}`;

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
        err instanceof Error ? err.message : "Failed to fetch player day data";
      console.error("Error fetching player day:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, firebase_id, day]);

  const refetch = useCallback(async () => {
    // Clear the specific cache key before refetching
    const playerId = firebase_id || user?.uid;
    if (playerId) {
      const cacheKey = `${playerId}-${day.toISOString().split("T")[0]}`;
      dataCache.delete(cacheKey);
    }
    await fetchPlayerDay();
  }, [fetchPlayerDay, firebase_id, day, user]);

  const clearCache = useCallback(() => {
    dataCache.clear();
  }, []);

  useEffect(() => {
    fetchPlayerDay();
  }, [fetchPlayerDay]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
}
