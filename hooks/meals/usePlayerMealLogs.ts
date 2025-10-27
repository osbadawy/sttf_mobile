import { useAuth } from "@/contexts/AuthContext";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

interface DataRange {
  earliest: Date | null;
  latest: Date | null;
}

interface UsePlayerMealLogsOptions {
  user_id?: string;
  initialDaysBack?: number;
}

interface UsePlayerMealLogsReturn {
  data: Record<number, GetMealsResponse[]>;
  dataRange: DataRange;
  loading: boolean;
  error: string | null;
  fetchAdditionalData: (startDate: Date, endDate: Date) => Promise<void>;
  refetch: () => Promise<void>;
}

export const usePlayerMealLogs = ({
  user_id,
  initialDaysBack = 14,
}: UsePlayerMealLogsOptions = {}): UsePlayerMealLogsReturn => {
  const { user } = useAuth();
  const [data, setData] = useState<Record<number, GetMealsResponse[]>>({});
  const [dataRange, setDataRange] = useState<DataRange>({
    earliest: null,
    latest: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    startDate: Date,
    endDate: Date,
    isInitial = false,
  ) => {
    if (!user) return;

    try {
      if (isInitial) setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        firebase_id: user_id || user.uid,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/meal/completed?${params}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const mealsData = Array.isArray(responseData) ? responseData : [];

      // Group meals by date (timestamp as key)
      const separatedData: Record<number, GetMealsResponse[]> = {};
      mealsData.forEach((meal: GetMealsResponse) => {
        const start = meal.players_assigned[0].completions[0].createdAt;
        if (start) {
          // Convert start date to timestamp at midnight
          const date = new Date(start);
          date.setHours(0, 0, 0, 0);
          const timestamp = date.getTime();

          if (!separatedData[timestamp]) {
            separatedData[timestamp] = [];
          }
          separatedData[timestamp].push(meal);
        }
      });

      if (isInitial) {
        setData(separatedData);
        setDataRange({ earliest: startDate, latest: endDate });
      } else {
        // Merge with existing data
        setData((prevData) => {
          const merged = { ...prevData };
          Object.keys(separatedData).forEach((timestamp) => {
            const ts = Number(timestamp);
            if (merged[ts]) {
              merged[ts] = [...merged[ts], ...separatedData[ts]];
            } else {
              merged[ts] = separatedData[ts];
            }
          });
          return merged;
        });

        // Update data range
        setDataRange((prevRange) => ({
          earliest:
            prevRange.earliest && startDate < prevRange.earliest
              ? startDate
              : prevRange.earliest || startDate,
          latest:
            prevRange.latest && endDate > prevRange.latest
              ? endDate
              : prevRange.latest || endDate,
        }));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error fetching meal logs:", err);
      setError(errorMessage);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const fetchAdditionalData = async (startDate: Date, endDate: Date) => {
    await fetchData(startDate, endDate, false);
  };

  const refetch = async () => {
    if (user) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - initialDaysBack);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      await fetchData(startDate, endDate, true);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - initialDaysBack);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      fetchData(startDate, endDate, true);
    }
  }, [user, user_id, initialDaysBack]);

  return {
    data,
    dataRange,
    loading,
    error,
    fetchAdditionalData,
    refetch,
  };
};
