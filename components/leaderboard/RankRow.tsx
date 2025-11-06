// features/leaderboard/components/RankRow.tsx
import type { LBPlayer } from "@/utils/leaderboardTypes";
import { Image, Text, View } from "react-native";
import TrendIcon from "./TrendIcon";

export default function RankRow({ p, index }: { p: LBPlayer; index: number }) {
  const isYou = Boolean(p.isYou);

  // do Query check for rank here
  return (
    <View
      className={`my-2 flex-row items-center rounded-2xl px-3 py-3 ${
        isYou ? "bg-emerald-50" : "bg-transparent"
      }`}
      style={{ gap: 10 }}
    >
      <Text className="w-6 text-center text-neutral-400">{index + 1}</Text>
      <Image source={{ uri: p.avatar }} className="h-8 w-8 rounded-full" />
      <View className="flex-1">
        <Text
          className={`text-[15px] ${isYou ? "font-semibold text-emerald-900" : "text-neutral-900"}`}
        >
          {p.name}
        </Text>
        <Text className="text-black font-inter-thin">
          {p.score.toLocaleString()}
        </Text>
      </View>
      <TrendIcon t={p.trend} />
    </View>
  );
}
