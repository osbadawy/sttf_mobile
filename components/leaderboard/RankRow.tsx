// features/leaderboard/components/RankRow.tsx
import ProfilePictureDefaultIcon from "@/components/icons/ProfilePictureDefault";
import type { LeaderboardEntry } from "@/hooks/useLeaderboard";
import { Image, Text, View } from "react-native";
import TrendIcon from "./TrendIcon";

interface RankRowProps {
  entry: LeaderboardEntry;
  isYou: boolean;
}

export default function RankRow({ entry, isYou }: RankRowProps) {
  let trend: "up" | "down" | "same" = "same";
  if (entry.rank < entry.lastWeekRank) {
    trend = "down";
  } else if (entry.rank > entry.lastWeekRank) {
    trend = "up";
  }

  // do Query check for rank here
  return (
    <View
      className={`my-2 flex-row items-center rounded-2xl px-3 py-3 ${
        isYou ? "bg-emerald-50" : "bg-transparent"
      }`}
      style={{ gap: 10 }}
    >
      <Text className="w-6 text-center text-neutral-400">{entry.rank}</Text>
      {entry.user.avatar_url ? (
        <Image
          source={{ uri: entry.user.avatar_url }}
          className="h-8 w-8 rounded-full"
        />
      ) : (
        <View className="h-8 w-8 rounded-full bg-neutral-200 items-center justify-center">
          <ProfilePictureDefaultIcon />
        </View>
      )}
      <View className="flex-1">
        <Text
          className={`text-[15px] ${isYou ? "font-semibold text-emerald-900" : "text-neutral-900"}`}
        >
          {entry.user.display_name ?? "Anonymous Player"}
        </Text>
        <Text className="text-black font-inter-thin">
          {entry.points.toLocaleString()}
        </Text>
      </View>
      <TrendIcon t={trend} />
    </View>
  );
}
