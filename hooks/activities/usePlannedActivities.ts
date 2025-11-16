import { useAuth } from "@/contexts/AuthContext";
import { PlannedActivity } from "@/schemas/PlannedActivity";
import ExpiringCache from "@/utils/ExpiringCache";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";

interface UsePlannedActivitiesProps {
  users_assigned?: string[];
  day: Date;
}

interface UsePlannedActivitiesReturn {
  activities: PlannedActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
  clearCacheForRecurringDays: (
    startDate: Date,
    endDate: Date,
    recurringDays: string[],
    users?: string[],
  ) => void;
}

// Cache to store fetched data by users and date (expires after 1 minutes)
const dataCache = new ExpiringCache<PlannedActivity[]>(1);

export function usePlannedActivities({
  users_assigned,
  day,
}: UsePlannedActivitiesProps): UsePlannedActivitiesReturn {
  const { user } = useAuth();
  const [activities, setActivities] = useState<PlannedActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  const fetchPlannedActivities = useCallback(async () => {
    if (!user) {
      return;
    }

    // If users_assigned is undefined, set it to [user.uid]
    const assignedUsers = users_assigned || [user.uid];

    // Normalize date to YYYY-MM-DD string for consistent comparison
    const dateKey = day.toISOString().split("T")[0];
    const cacheKey = `activities-${assignedUsers.sort().join(",")}-${dateKey}`;

    // Check cache first
    const cachedData = dataCache.get(cacheKey);
    if (cachedData) {
      if (isMountedRef.current) {
        setActivities(cachedData);
        setLoading(false);
        setError(null);
      }
      return;
    }

    // Increment request ID for this fetch
    const currentRequestId = ++requestIdRef.current;

    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const params = new URLSearchParams();

      // Add day parameter
      params.append("day", day.toISOString());

      // Add multiple users_assigned parameters
      assignedUsers.forEach((userId) => {
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

      // Check if this request is still the latest one
      if (currentRequestId !== requestIdRef.current) {
        // A newer request has started, ignore this response
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();
      const activitiesData = Array.isArray(data) ? data : [];

      // Double-check this is still the latest request before updating state
      if (currentRequestId !== requestIdRef.current || !isMountedRef.current) {
        return;
      }

      // Cache the data
      dataCache.set(cacheKey, activitiesData);
      setActivities(activitiesData);
    } catch (err) {
      // Only update error if this is still the latest request
      if (currentRequestId !== requestIdRef.current || !isMountedRef.current) {
        return;
      }
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch planned activities";
      console.error("Error fetching planned activities:", err);
      setError(errorMessage);
    } finally {
      // Only update loading if this is still the latest request
      if (currentRequestId === requestIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [user, users_assigned, day]);

  const refetch = useCallback(async () => {
    // Don't refetch if component is unmounted
    if (!isMountedRef.current) {
      return;
    }
    // Clear the specific cache key before refetching
    const assignedUsers = users_assigned || [user?.uid];
    if (assignedUsers.length > 0 && user) {
      const cacheKey = `activities-${assignedUsers.sort().join(",")}-${day.toISOString().split("T")[0]}`;
      dataCache.delete(cacheKey);
    }
    // Check again before fetching in case component unmounted during cache clear
    if (isMountedRef.current) {
      await fetchPlannedActivities();
    }
  }, [fetchPlannedActivities, users_assigned, day, user]);

  const clearCache = useCallback(() => {
    dataCache.clear();
  }, []);

  const clearCacheForRecurringDays = useCallback(
    (
      startDate: Date,
      endDate: Date,
      recurringDays: string[],
      users?: string[],
    ) => {
      const usersToClear =
        users || users_assigned || [user?.uid].filter(Boolean);
      if (usersToClear.length === 0 || recurringDays.length === 0) return;

      const sortedUsers = usersToClear.sort().join(",");

      // Map day abbreviations to day numbers (0 = Sunday, 1 = Monday, etc.)
      const dayMap: { [key: string]: number } = {
        sun: 0,
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
      };

      const targetDays = recurringDays
        .map((day) => dayMap[day])
        .filter((day) => day !== undefined);

      // Clear cache only for dates that match the recurring days
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (targetDays.includes(dayOfWeek)) {
          const cacheKey = `activities-${sortedUsers}-${currentDate.toISOString().split("T")[0]}`;
          dataCache.delete(cacheKey);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    },
    [users_assigned, user],
  );

  useEffect(() => {
    isMountedRef.current = true;
    // Reset request ID when dependencies change to cancel any in-flight requests
    requestIdRef.current = 0;
    fetchPlannedActivities();
    return () => {
      isMountedRef.current = false;
      // Increment request ID on unmount to invalidate any pending requests
      requestIdRef.current++;
    };
  }, [fetchPlannedActivities]);

  return {
    activities,
    loading,
    error,
    refetch,
    clearCache,
    clearCacheForRecurringDays,
  };
}
