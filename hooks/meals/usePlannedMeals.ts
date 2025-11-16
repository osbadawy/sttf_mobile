import { useAuth } from "@/contexts/AuthContext";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import ExpiringCache from "@/utils/ExpiringCache";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

interface UsePlannedMealsProps {
  users_assigned?: string[];
  day: Date;
  onlyMatchSelectedPlayers?: boolean;
}

interface UsePlannedMealsReturn {
  meals: GetMealsResponse[];
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
const dataCache = new ExpiringCache<GetMealsResponse[]>(1);

export function usePlannedMeals({
  users_assigned,
  day,
  onlyMatchSelectedPlayers,
}: UsePlannedMealsProps): UsePlannedMealsReturn {
  const { user } = useAuth();
  const [meals, setMeals] = useState<GetMealsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlannedMeals = useCallback(async () => {
    if (!user) {
      return;
    }

    // If users_assigned is undefined, set it to [user.uid]
    const assignedUsers = users_assigned || [user.uid];

    // Check cache first
    const cacheKey = `${assignedUsers.sort().join(",")}-${day.toISOString().split("T")[0]}`;
    const cachedData = dataCache.get(cacheKey);
    if (cachedData) {
      setMeals(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Add day parameter
      params.append("day", day.toISOString());

      // Add multiple users_assigned parameters
      assignedUsers.forEach((userId) => {
        params.append("users_assigned", userId);
      });

      if (onlyMatchSelectedPlayers) {
        params.append("onlyMatchSelectedPlayers", true.toString());
      }

      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/meal?${params}`;

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
      const mealsData = Array.isArray(data) ? data : [];

      // Cache the data
      dataCache.set(cacheKey, mealsData);
      setMeals(mealsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch planned meals";
      console.error("Error fetching planned meals:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, users_assigned, day]);

  const refetch = useCallback(async () => {
    // Clear the specific cache key before refetching
    const assignedUsers = users_assigned || [user?.uid];
    if (assignedUsers.length > 0 && user) {
      const cacheKey = `${assignedUsers.sort().join(",")}-${day.toISOString().split("T")[0]}`;
      dataCache.delete(cacheKey);
    }
    await fetchPlannedMeals();
  }, [fetchPlannedMeals, users_assigned, day, user]);

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
          const cacheKey = `${sortedUsers}-${currentDate.toISOString().split("T")[0]}`;
          dataCache.delete(cacheKey);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    },
    [users_assigned, user],
  );

  useEffect(() => {
    fetchPlannedMeals();
  }, [fetchPlannedMeals]);

  return {
    meals,
    loading,
    error,
    refetch,
    clearCache,
    clearCacheForRecurringDays,
  };
}
