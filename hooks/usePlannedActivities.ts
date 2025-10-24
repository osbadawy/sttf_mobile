import { useAuth } from "@/contexts/AuthContext";
import ExpiringCache from "@/utils/ExpiringCache";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

interface PlannedActivity {
  id: string;
  users_assigned: string[];
  start: string;
  category: "technical" | "strength" | "recovery";
  activity_type: string;
  is_custom: boolean;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

interface UsePlannedActivitiesProps {
  users_assigned: string[];
  day: Date;
}

interface UsePlannedActivitiesReturn {
  activities: PlannedActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Cache to store fetched data by users and date (expires after 10 minutes)
const dataCache = new ExpiringCache<PlannedActivity[]>(10);

export function usePlannedActivities({
  users_assigned,
  day,
}: UsePlannedActivitiesProps): UsePlannedActivitiesReturn {
  const { user } = useAuth();
  const [activities, setActivities] = useState<PlannedActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlannedActivities = useCallback(async () => {
    if (!user || !users_assigned.length) {
      return;
    }

    // Check cache first
    const cacheKey = `${users_assigned.sort().join(",")}-${day.toISOString().split("T")[0]}`;
    const cachedData = dataCache.get(cacheKey);
    if (cachedData) {
      setActivities(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Add day parameter
      params.append("day", day.toISOString());

      // Add multiple users_assigned parameters
      users_assigned.forEach((userId) => {
        params.append("users_assigned", userId);
      });

      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/planned-activity?${params}`;

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

      const data = await response.json();
      const activitiesData = Array.isArray(data) ? data : [];

      // Cache the data
      dataCache.set(cacheKey, activitiesData);
      setActivities(activitiesData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch planned activities";
      console.error("Error fetching planned activities:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, users_assigned, day]);

  const refetch = useCallback(async () => {
    await fetchPlannedActivities();
  }, [fetchPlannedActivities]);

  const clearCache = useCallback(() => {
    dataCache.clear();
  }, []);

  useEffect(() => {
    fetchPlannedActivities();
  }, [fetchPlannedActivities]);

  return {
    activities,
    loading,
    error,
    refetch,
    clearCache,
  };
}
