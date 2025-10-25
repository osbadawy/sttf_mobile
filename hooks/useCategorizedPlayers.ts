import { Player } from "@/components/coach/PlayerCard";
import { useMemo } from "react";

export function useCategorizedPlayers(players: Player[]) {
  return useMemo(() => {
    const noPlan: Player[] = [];
    const noMeal: Player[] = [];
    const noWorkout: Player[] = [];
    const completed: Player[] = [];

    players.forEach((p) => {
      if (!p.meal && !p.workout) noPlan.push(p);
      else if (!p.meal) noMeal.push(p);
      else if (!p.workout) noWorkout.push(p);
      else completed.push(p);
    });

    return { noPlan, noMeal, noWorkout, completed };
  }, [players]);
}
