import { LeaderboardEntry } from "@/hooks/useLeaderboard";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import GroupIcon from "../icons/Group";
import SmallTrophyIcon from "../icons/playerDayPlan/SmallTrophyIcon";
import TrendIcon from "../leaderboard/TrendIcon";

export default function PointAndRank({
  entry,
}: {
  entry: LeaderboardEntry | null;
}) {
  if (!entry) {
    return null;
  }
  let trend: "up" | "down" | "same" = "same";
  if (entry.rank < entry.lastWeekRank) {
    trend = "up";
  } else if (entry.rank > entry.lastWeekRank) {
    trend = "down";
  }

  return (
    <TouchableOpacity
      className="flex-row items-center justify-start gap-[8px]"
      onPress={() => router.push("/player/leaderboard")}
    >
      <LinearGradient
        colors={["#FFEFBE", "#FFFFFF"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        className="flex-row items-center justify-start px-[10px] h-[36px]"
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingHorizontal: 10,
          height: 36,
          borderRadius: 8,
          boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.24)",
        }}
      >
        <SmallTrophyIcon />
        <Text className="effra-semibold text-2xl pl-2">
          {entry.points.toLocaleString()}
        </Text>
      </LinearGradient>
      <LinearGradient
        colors={["#DFFFFF", "#FFFFFF"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        className="flex-row items-center justify-start px-[10px] h-[36px]"
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingHorizontal: 10,
          height: 36,
          borderRadius: 8,
          boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.24)",
        }}
      >
        <GroupIcon />
        <Text className="effra-semibold text-2xl pl-2">
          <Text className="effra-regular text-base italic">#</Text>
          {entry.rank}
        </Text>
        <TrendIcon t={trend} />
      </LinearGradient>
    </TouchableOpacity>
  );
}
