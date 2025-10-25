import { useAuth } from "@/contexts/AuthContext";
import { seperateDataByDay } from "@/utils/activities";
import ExpiringCache from "@/utils/ExpiringCache";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

interface DataRange {
  earliest: Date | null;
  latest: Date | null;
}

interface UseMultiPlayerActivitiesProps {
  primaryFirebaseId?: string;
  selectedPlayerFirebaseId?: string;
  initialDaysBack?: number;
}

interface UseMultiPlayerActivitiesReturn {
  primaryData: Record<number, any[]>;
  selectedPlayerData: Record<number, any[]>;
  primaryDataRange: DataRange;
  selectedPlayerDataRange: DataRange;
  primaryLoading: boolean;
  selectedPlayerLoading: boolean;
  primaryError: string | null;
  selectedPlayerError: string | null;
  fetchAdditionalPrimaryData: (startDate: Date, endDate: Date) => Promise<void>;
  fetchAdditionalSelectedPlayerData: (
    startDate: Date,
    endDate: Date,
  ) => Promise<void>;
  refetchPrimary: () => Promise<void>;
  refetchSelectedPlayer: () => Promise<void>;
}

// Cache to store fetched data by firebase_id and date range (expires after 10 minutes)
const dataCache = new ExpiringCache<{
  data: Record<number, any[]>;
  dataRange: DataRange;
}>(10);

export function useMultiPlayerActivities({
  primaryFirebaseId,
  selectedPlayerFirebaseId,
  initialDaysBack = 14,
}: UseMultiPlayerActivitiesProps = {}): UseMultiPlayerActivitiesReturn {
  const { user } = useAuth();

  // Primary player state
  const [primaryData, setPrimaryData] = useState<Record<number, any[]>>({});
  const [primaryDataRange, setPrimaryDataRange] = useState<DataRange>({
    earliest: null,
    latest: null,
  });
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [primaryError, setPrimaryError] = useState<string | null>(null);

  // Selected player state
  const [selectedPlayerData, setSelectedPlayerData] = useState<
    Record<number, any[]>
  >({});
  const [selectedPlayerDataRange, setSelectedPlayerDataRange] =
    useState<DataRange>({
      earliest: null,
      latest: null,
    });
  const [selectedPlayerLoading, setSelectedPlayerLoading] = useState(false);
  const [selectedPlayerError, setSelectedPlayerError] = useState<string | null>(
    null,
  );

  const fetchPlayerData = useCallback(
    async (
      firebaseId: string,
      startDate: Date,
      endDate: Date,
      isSelectedPlayer = false,
      isInitial = false,
    ) => {
      if (!user || !firebaseId) {
        return;
      }

      // Check cache first
      const cacheKey = `${firebaseId}-${startDate.toISOString()}-${endDate.toISOString()}`;
      const cachedData = dataCache.get(cacheKey);
      if (cachedData) {
        if (isSelectedPlayer) {
          setSelectedPlayerData(cachedData.data);
          setSelectedPlayerDataRange(cachedData.dataRange);
        } else {
          setPrimaryData(cachedData.data);
          setPrimaryDataRange(cachedData.dataRange);
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
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        });
        const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/player-activity?${params}`;

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
        const dataRange = { earliest: startDate, latest: endDate };

        // Cache the data
        dataCache.set(cacheKey, { data: separatedData, dataRange });

        // Set the appropriate state
        if (isSelectedPlayer) {
          if (isInitial) {
            setSelectedPlayerData(separatedData);
            setSelectedPlayerDataRange(dataRange);
          } else {
            // Merge with existing data
            setSelectedPlayerData((prevData) => ({
              ...prevData,
              ...separatedData,
            }));
            // Update data range
            setSelectedPlayerDataRange((prevRange) => ({
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
        } else {
          if (isInitial) {
            setPrimaryData(separatedData);
            setPrimaryDataRange(dataRange);
          } else {
            // Merge with existing data
            setPrimaryData((prevData) => ({
              ...prevData,
              ...separatedData,
            }));
            // Update data range
            setPrimaryDataRange((prevRange) => ({
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
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
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
    [user],
  );

  const fetchAdditionalPrimaryData = useCallback(
    async (startDate: Date, endDate: Date) => {
      if (primaryFirebaseId) {
        await fetchPlayerData(
          primaryFirebaseId,
          startDate,
          endDate,
          false,
          false,
        );
      }
    },
    [primaryFirebaseId, fetchPlayerData],
  );

  const fetchAdditionalSelectedPlayerData = useCallback(
    async (startDate: Date, endDate: Date) => {
      if (selectedPlayerFirebaseId) {
        await fetchPlayerData(
          selectedPlayerFirebaseId,
          startDate,
          endDate,
          true,
          false,
        );
      }
    },
    [selectedPlayerFirebaseId, fetchPlayerData],
  );

  const refetchPrimary = useCallback(async () => {
    if (primaryFirebaseId) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - initialDaysBack);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      await fetchPlayerData(primaryFirebaseId, startDate, endDate, false, true);
    }
  }, [primaryFirebaseId, initialDaysBack, fetchPlayerData]);

  const refetchSelectedPlayer = useCallback(async () => {
    if (selectedPlayerFirebaseId) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - initialDaysBack);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      await fetchPlayerData(
        selectedPlayerFirebaseId,
        startDate,
        endDate,
        true,
        true,
      );
    }
  }, [selectedPlayerFirebaseId, initialDaysBack, fetchPlayerData]);

  // Fetch primary player data on mount
  useEffect(() => {
    if (primaryFirebaseId) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - initialDaysBack);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      fetchPlayerData(primaryFirebaseId, startDate, endDate, false, true);
    }
  }, [primaryFirebaseId, initialDaysBack, fetchPlayerData]);

  // Fetch selected player data when selectedPlayerFirebaseId changes
  useEffect(() => {
    if (selectedPlayerFirebaseId) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - initialDaysBack);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      fetchPlayerData(selectedPlayerFirebaseId, startDate, endDate, true, true);
    } else {
      // Clear selected player data when no player is selected
      setSelectedPlayerData({});
      setSelectedPlayerDataRange({ earliest: null, latest: null });
      setSelectedPlayerError(null);
    }
  }, [selectedPlayerFirebaseId, initialDaysBack, fetchPlayerData]);

  return {
    primaryData,
    selectedPlayerData,
    primaryDataRange,
    selectedPlayerDataRange,
    primaryLoading,
    selectedPlayerLoading,
    primaryError,
    selectedPlayerError,
    fetchAdditionalPrimaryData,
    fetchAdditionalSelectedPlayerData,
    refetchPrimary,
    refetchSelectedPlayer,
  };
}
