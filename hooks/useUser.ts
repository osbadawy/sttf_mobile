import { useAuth } from "@/contexts/AuthContext";
import ExpiringCache from "@/utils/ExpiringCache";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

interface UserData {
  email: string;
  avatar_url: string | null;
  access: string | null;
  birth_date: Date | null;
  phone: string | null;
  nationality: string | null;
  display_name: string | null;
  player_stats: {
    dominant_hand: "right" | "left";
    win_rate: number | null;
    matches_played: number | null;
    serve_win_percentage: number | null;
    third_ball_conversion_percentage: number | null;
    receive_win_percentage: number | null;
  };
}

interface UseFirebaseUserReturn {
  data: UserData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Cache to store fetched data by firebase_id (expires after 1 minute)
const dataCache = new ExpiringCache<any>(1);

export function useUser(firebase_id?: string): UseFirebaseUserReturn {
  const { user } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFirebaseUser = useCallback(async () => {
    if (!user) {
      return;
    }

    // If firebase_id is undefined, use the current user's uid
    const userId = firebase_id || user.uid;

    console.log({ userId });

    // Check cache first
    const cacheKey = userId;
    const cachedData = dataCache.get(cacheKey);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/user`;

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

      // Cache the data
      dataCache.set(cacheKey, responseData);
      setData(responseData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch firebase user data";
      console.error("Error fetching firebase user:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, firebase_id]);

  const refetch = useCallback(async () => {
    // Clear the specific cache key before refetching
    const userId = firebase_id || user?.uid;
    if (userId) {
      dataCache.delete(userId);
    }
    await fetchFirebaseUser();
  }, [fetchFirebaseUser, firebase_id, user]);

  const clearCache = useCallback(() => {
    dataCache.clear();
  }, []);

  useEffect(() => {
    fetchFirebaseUser();
  }, [fetchFirebaseUser]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
}
