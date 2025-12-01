import Player from "@/schemas/Player";
import { useFetchUsers } from "./useFetchUsers";

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
  const { data, loading, error, refetch } = useFetchUsers<Player>(
    "/user/players",
    "players",
  );

  return {
    players: data,
    loading,
    error,
    refetch,
  };
};
