// app/player/leaderboard.tsx (or wherever your screen lives)
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import PodiumCard from "@/components/leaderboard/PodiumCard";
import RankRow from "@/components/leaderboard/RankRow";
import { splitTopRest } from "@/components/leaderboard/SplitTopRest";
import { useLocalization } from "@/contexts/LocalizationContext";
import { DATA } from "@/utils/leaderboardData";

export default function Leaderboard() {
  const { t } = useLocalization("components.leaderboard.leaderboard");

  const error = false;
  const mealError = false;

  const { top3, rest } = useMemo(() => splitTopRest(DATA), []);
  const podium = [top3[1] ?? null, top3[0] ?? null, top3[2] ?? null];

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("leaderboard"),
        showDateSelector: false,
        showBGImage: false,
        showCalendarIcon: false,
        showBackButton: true,
      }}
      showNav={false}
      error={Boolean(error) || Boolean(mealError)}
    >
      {/* Period pill (static) */}
      <View className="mb-6 items-center">
        <TouchableOpacity className="rounded-full border border-neutral-300 px-4 py-1.5">
          <Text className="text-neutral-700">{t("this week")}</Text>
        </TouchableOpacity>
      </View>

      {/* Podium (2nd — 1st — 3rd) */}
      <View className="mb-6 flex-row items-end justify-center">
        {podium[0] && (
          <PodiumCard
            rankLabel="2nd"
            name={podium[0]!.name}
            score={podium[0]!.score}
            avatar={podium[0]!.avatar}
          />
        )}
        {podium[1] && (
          <PodiumCard
            rankLabel="1st"
            name={podium[1]!.name}
            score={podium[1]!.score}
            avatar={podium[1]!.avatar}
            emphasized
          />
        )}
        {podium[2] && (
          <PodiumCard
            rankLabel="3rd"
            name={podium[2]!.name}
            score={podium[2]!.score}
            avatar={podium[2]!.avatar}
          />
        )}
      </View>

      {/* Divider */}
      <View className="my-2 h-[1px] w-full bg-neutral-200" />

      {/* Ranked list (the rest) */}
      <View className="mt-2">
        {rest.map((p, idx) => (
          <RankRow key={p.id} p={p} index={idx + 3} />
        ))}
      </View>
    </ParallaxScrollView>
  );
}
