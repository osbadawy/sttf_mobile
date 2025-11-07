// app/player/leaderboard.tsx (or wherever your screen lives)
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import PodiumCard from "@/components/leaderboard/PodiumCard";
import RankRow from "@/components/leaderboard/RankRow";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export default function Leaderboard() {
  const { t } = useLocalization("components.leaderboard.leaderboard");

  const { data, loading, error } = useLeaderboard();
  const { user } = useAuth();

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
      error={Boolean(error)}
    >
      {/* Period pill (static) */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <View className="mb-6 items-center">
        <TouchableOpacity className="rounded-full border border-neutral-300 px-4 py-1.5">
          <Text className="text-neutral-700">{t("this week")}</Text>
        </TouchableOpacity>
      </View>

      {/* Podium (2nd — 1st — 3rd) */}
      <View className="mb-6 flex-row items-end justify-center">
        {data[1] && (
          <PodiumCard
            rankLabel="1st"
            name={data[1]!.user.display_name}
            score={data[1]!.points}
            avatar={data[1]!.user.avatar_url}
          />
        )}
        {data[0] && (
          <PodiumCard
            rankLabel="2nd"
            name={data[0]!.user.display_name}
            score={data[0]!.points}
            avatar={data[0]!.user.avatar_url}
            emphasized
          />
        )}

        {data[2] && (
          <PodiumCard
            rankLabel="3rd"
            name={data[2]!.user.display_name}
            score={data[2]!.points}
            avatar={data[2]!.user.avatar_url}
          />
        )}
      </View>

      {/* Divider */}
      <View className="my-2 h-[1px] w-full bg-neutral-200" />

      {/* Ranked list (the rest) */}
      <View className="mt-2">
        {data.slice(3).map((p, idx) => (
          <RankRow
            key={p.user.firebase_id}
            entry={p}
            isYou={p.user.firebase_id === user?.uid}
          />
        ))}
      </View>
    </ParallaxScrollView>
  );
}
