import { useAuth } from "@/contexts/AuthContext";
import { UserData } from "@/hooks/useUser";
import ExpiringCache from "@/utils/ExpiringCache";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

export interface LeaderboardEntry {
  user: UserData; // User information - adjust based on actual API response
  points: number;
  rank: number;
  lastWeekPoints: number;
  lastWeekRank: number;
}

interface UseLeaderboardReturn {
  data: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Cache to store fetched data (expires after 1 minute)
const dataCache = new ExpiringCache<LeaderboardEntry[]>(1);

export function useLeaderboard(): UseLeaderboardReturn {
  const { user } = useAuth();
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    if (!user) {
      return;
    }

    // Check cache first
    const cacheKey = "leaderboard";
    const cachedData = dataCache.get(cacheKey);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/points/week/leaderboard`;

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
      const leaderboardData = Array.isArray(responseData) ? responseData : [];

      // Cache the data
      dataCache.set(cacheKey, leaderboardData);
      setData(leaderboardData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch leaderboard data";
      console.error("Error fetching leaderboard:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refetch = useCallback(async () => {
    // Clear cache before refetching
    dataCache.delete("leaderboard");
    await fetchLeaderboard();
  }, [fetchLeaderboard]);

  const clearCache = useCallback(() => {
    dataCache.clear();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
}
