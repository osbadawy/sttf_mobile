import { useAuth } from "@/contexts/AuthContext";
import Player from "@/schemas/Player";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

interface UseAllPlayersReturn {
  players: Player[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook that fetches all players for the authenticated coach
 * @returns Object containing players array, loading state, error state, and refetch function
 */
export const useAllPlayers = (): UseAllPlayersReturn => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/user/players`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch players: ${response.status}`);
      }

      const data = await response.json();
      setPlayers(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching players";
      console.error("Error fetching players:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [user]);

  return {
    players,
    loading,
    error,
    refetch: fetchPlayers,
  };
};
