// features/leaderboard/components/TrendIcon.tsx
import type { Trend } from "@/utils/leaderboardTypes";
import { Text } from "react-native";

export default function TrendIcon({ t }: { t: Trend }) {
  if (t === "up") return <Text className="text-emerald-600">▲</Text>;
  if (t === "down") return <Text className="text-rose-500">▼</Text>;
  return <Text className="text-neutral-400">—</Text>;
}
