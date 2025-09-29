import { useAuth } from "@/contexts/AuthContext";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

interface UsePlayerActivityOptions {
  playerActivityId: string;
  user_id?: string;
}

interface UsePlayerActivityReturn {
  activity: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSinglePlayerActivity = ({
  playerActivityId,
  user_id,
}: UsePlayerActivityOptions): UsePlayerActivityReturn => {
  const { user } = useAuth();
  const [activity, setActivity] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    if (!user || !playerActivityId) return;

    try {
      setLoading(true);
      setError(null);

      const token = await user.getIdToken();
      const response = await fetch(
        `${Constants.expoConfig?.extra?.BACKEND_URL}/player-activity/${playerActivityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setActivity(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error fetching activity:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchActivity();
  };

  // Fetch activity when user or playerActivityId changes
  useEffect(() => {
    if (user && playerActivityId) {
      fetchActivity();
    }
  }, [user, playerActivityId, user_id]);

  return {
    activity,
    loading,
    error,
    refetch,
  };
};
