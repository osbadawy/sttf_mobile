// features/leaderboard/types.ts
export type Trend = "up" | "down" | "same";

export type LBPlayer = {
  id: string;
  name: string;
  score: number;
  avatar: string;
  trend: Trend;
  isYou?: boolean;
};
