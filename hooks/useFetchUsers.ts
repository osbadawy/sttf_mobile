import { useAuth } from "@/contexts/AuthContext";
import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";

interface UseFetchUsersReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Generic hook that fetches user data from the backend
 * @param endpoint - The API endpoint to fetch from (e.g., '/user/players' or '/user/coaches')
 * @param errorMessagePrefix - Prefix for error messages (e.g., 'players' or 'coaches')
 * @param enabled - Whether to enable fetching (defaults to true)
 * @returns Object containing data array, loading state, error state, and refetch function
 */
export const useFetchUsers = <T>(
  endpoint: string,
  errorMessagePrefix: string,
  enabled: boolean = true,
): UseFetchUsersReturn<T> => {
  const { user } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user || !enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}${endpoint}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${errorMessagePrefix}: ${response.status}`,
        );
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Error fetching ${errorMessagePrefix}`;
      console.error(`Error fetching ${errorMessagePrefix}:`, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, enabled, endpoint, errorMessagePrefix]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [enabled, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
