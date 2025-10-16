import { useAuth } from "@/contexts/AuthContext";
import { seperateDataByDay } from "@/utils/activities";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

interface DataRange {
  earliest: Date | null;
  latest: Date | null;
}

interface UsePlayerActivitiesOptions {
  user_id?: string;
  initialDaysBack?: number;
}

interface UsePlayerActivitiesReturn {
  data: Record<number, any[]>;
  dataRange: DataRange;
  loading: boolean;
  error: string | null;
  fetchAdditionalData: (startDate: Date, endDate: Date) => Promise<void>;
  refetch: () => Promise<void>;
}

export const usePlayerActivities = ({
  user_id,
  initialDaysBack = 14,
}: UsePlayerActivitiesOptions = {}): UsePlayerActivitiesReturn => {
  const { user } = useAuth();
  const [data, setData] = useState<Record<number, any[]>>({});
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
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/workout?${params}`;

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
      const separatedData = seperateDataByDay(responseData);

      if (isInitial) {
        setData(separatedData);
        setDataRange({ earliest: startDate, latest: endDate });
      } else {
        // Merge with existing data
        setData((prevData) => ({
          ...prevData,
          ...separatedData,
        }));

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
      console.error("Error fetching data:", err);
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
