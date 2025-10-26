import { Player } from "@/components/coach/PlayerCard";
import { useAuth } from "@/contexts/AuthContext";
import Constants from "expo-constants";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useCategorizedPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/user/players/week`;
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
      setPlayers(data.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching players";
      console.error("Error fetching players:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categorized = useMemo(() => {
    const noPlan: Player[] = [];
    const noMeal: Player[] = [];
    const noWorkout: Player[] = [];
    const completed: Player[] = [];

    if (!players || !Array.isArray(players)) {
      return { noPlan, noMeal, noWorkout, completed };
    }

    players.forEach((p) => {
      if (!p.meal && !p.workout) noPlan.push(p);
      else if (!p.meal) noMeal.push(p);
      else if (!p.workout) noWorkout.push(p);
      else completed.push(p);
    });

    return { noPlan, noMeal, noWorkout, completed };
  }, [players]);

  const clear = useCallback(() => {
    setPlayers([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    players,
    ...categorized,
    loading,
    error,
    refetch: fetchData,
    clear,
  };
}
