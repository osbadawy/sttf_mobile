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
  primaryFirebaseId?: string;
  selectedPlayerFirebaseId?: string;
  initialDaysBack?: number;
}

interface UsePlayerActivitiesReturn {
  data: Record<number, any[]>;
  primaryData: Record<number, any[]>;
  selectedPlayerData: Record<number, any[]>;
  dataRange: DataRange;
  loading: boolean;
  error: string | null;
  hasWorkoutsBefore: boolean;
  hasWorkoutsAfter: boolean;
  selectedPlayerHasWorkoutsBefore: boolean;
  selectedPlayerHasWorkoutsAfter: boolean;
  fetchAdditionalData: (startDate: Date, endDate: Date) => Promise<void>;
  refetch: () => Promise<void>;
}

export const usePlayerActivities = ({
  user_id,
  primaryFirebaseId,
  selectedPlayerFirebaseId,
  initialDaysBack = 14,
}: UsePlayerActivitiesOptions = {}): UsePlayerActivitiesReturn => {
  const { user } = useAuth();
  const [data, setData] = useState<Record<number, any[]>>({});
  const [primaryData, setPrimaryData] = useState<Record<number, any[]>>({});
  const [selectedPlayerData, setSelectedPlayerData] = useState<
    Record<number, any[]>
  >({});
  const [dataRange, setDataRange] = useState<DataRange>({
    earliest: null,
    latest: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasWorkoutsBefore, setHasWorkoutsBefore] = useState(false);
  const [hasWorkoutsAfter, setHasWorkoutsAfter] = useState(false);
  const [selectedPlayerHasWorkoutsBefore, setSelectedPlayerHasWorkoutsBefore] =
    useState(false);
  const [selectedPlayerHasWorkoutsAfter, setSelectedPlayerHasWorkoutsAfter] =
    useState(false);

  const fetchPlayerData = async (
    firebaseId: string,
    startDate: Date,
    endDate: Date,
    isSelectedPlayer = false,
    isInitial = false,
  ) => {
    if (!user || !firebaseId) return;

    try {
      if (isInitial) setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        firebase_id: firebaseId,
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

      const {
        workouts,
        hasWorkoutsBefore: hasBefore,
        hasWorkoutsAfter: hasAfter,
      } = await response.json();
      const separatedData = seperateDataByDay(workouts);

      if (isSelectedPlayer) {
        setSelectedPlayerHasWorkoutsBefore(hasBefore);
        setSelectedPlayerHasWorkoutsAfter(hasAfter);

        if (isInitial) {
          setSelectedPlayerData(separatedData);
        } else {
          // Merge with existing data
          setSelectedPlayerData((prevData) => ({
            ...prevData,
            ...separatedData,
          }));
        }
      } else {
        setHasWorkoutsBefore(hasBefore);
        setHasWorkoutsAfter(hasAfter);

        if (isInitial) {
          setPrimaryData(separatedData);
          setData(separatedData); // Keep backward compatibility
          setDataRange({ earliest: startDate, latest: endDate });
        } else {
          // Merge with existing data
          setPrimaryData((prevData) => ({
            ...prevData,
            ...separatedData,
          }));
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
    const firebaseId = primaryFirebaseId || user_id || user?.uid;
    if (firebaseId) {
      await fetchPlayerData(firebaseId, startDate, endDate, false, false);
    }
    if (selectedPlayerFirebaseId) {
      await fetchPlayerData(
        selectedPlayerFirebaseId,
        startDate,
        endDate,
        true,
        false,
      );
    }
  };

  const refetch = async () => {
    if (user) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - initialDaysBack);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const firebaseId = primaryFirebaseId || user_id || user.uid;
      await fetchPlayerData(firebaseId, startDate, endDate, false, true);
      if (selectedPlayerFirebaseId) {
        await fetchPlayerData(
          selectedPlayerFirebaseId,
          startDate,
          endDate,
          true,
          true,
        );
      }
    }
  };

  // Fetch primary player data
  useEffect(() => {
    if (user) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - initialDaysBack);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const firebaseId = primaryFirebaseId || user_id || user.uid;
      fetchPlayerData(firebaseId, startDate, endDate, false, true);
    }
  }, [user, primaryFirebaseId, user_id, initialDaysBack]);

  // Fetch secondary player data
  useEffect(() => {
    if (user && selectedPlayerFirebaseId) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - initialDaysBack);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      fetchPlayerData(selectedPlayerFirebaseId, startDate, endDate, true, true);
    } else {
      // Clear secondary player data when no player is selected
      setSelectedPlayerData({});
    }
  }, [user, selectedPlayerFirebaseId, initialDaysBack]);

  return {
    data,
    primaryData,
    selectedPlayerData,
    dataRange,
    loading,
    error,
    hasWorkoutsBefore,
    hasWorkoutsAfter,
    selectedPlayerHasWorkoutsBefore,
    selectedPlayerHasWorkoutsAfter,
    fetchAdditionalData,
    refetch,
  };
};
