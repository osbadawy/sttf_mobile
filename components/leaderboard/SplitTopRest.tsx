// features/leaderboard/utils/splitLeaderboard.ts
import type { LBPlayer } from "@/utils/leaderboardTypes";

export function splitTopRest(players: LBPlayer[]) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  return {
    top3: sorted.slice(0, 3),
    rest: sorted.slice(3),
  };
}
