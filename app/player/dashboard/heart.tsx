import MaxAndRestingHeartRateSection from "@/components/heart/MaxAndRestingHeartRateSection";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import PlayerSelector from "@/components/PlayerSelector";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAllPlayers } from "@/hooks/useAllPlayers";
import { useMultiPlayerWhoopData } from "@/hooks/useMultiDayWhoopData";
import { MultiDayWhoopMetrics } from "@/schemas/whoop";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

function getAvgHrSectionData(
  activities: Record<number, any[]>,
  metrics: MultiDayWhoopMetrics,
) {
  //sort by key
  const sortedActivities = Object.entries(activities).sort(
    (a, b) => Number(a[0]) - Number(b[0]), // ascending order
  );

  const formattedActivities = [];

  for (const sortedActivity of sortedActivities) {
    if (
      sortedActivity[1] &&
      sortedActivity[1][0].workout &&
      sortedActivity[1][0].workout.score
    ) {
      const started_at = sortedActivity[1][0].started_at;
      const ended_at = sortedActivity[1][0].ended_at;
      const middle =
        new Date(started_at).getTime() +
        (new Date(ended_at).getTime() - new Date(started_at).getTime()) / 2;
      const date = new Date(middle);
      const hrv = getHrvForDay(metrics, date);

      formattedActivities.push({
        date: date,
        avg: sortedActivity[1][0].workout.score.average_heart_rate,
        hrv: hrv || 0,
      });
    }
  }

  return formattedActivities;
}

function getHeartRateHistory(metrics: MultiDayWhoopMetrics) {
  const sortedMetrics = Object.entries(metrics).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
  );
  return sortedMetrics.map(([day, value]) => ({
    resting: Math.round(value.heart.resting || 0),
    max: Math.round(value.heart.max || 0),
    day: day,
  }));
}

function getHrvForDay(metrics: MultiDayWhoopMetrics, day: Date) {
  // set day to 00:00:00
  const dateCopy = new Date(day);
  dateCopy.setUTCHours(0, 0, 0, 0);
  const dayString = dateCopy.toISOString();
  return metrics[dayString] ? metrics[dayString].heart.hrv : 0;
}

export default function HeartPage() {
  const { t, isRTL } = useLocalization("components.dashboard.heartSection");

  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  const { players } = useAllPlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const { user } = useAuth();

  const {
    primaryMetrics,
    selectedPlayerMetrics,
    primaryLoading,
    selectedPlayerLoading,
  } = useMultiPlayerWhoopData({
    primaryFirebaseId: playerData.firebase_id || user?.uid,
    selectedPlayerFirebaseId: selectedPlayer?.firebase_id,
    days: "14",
  });

  const p1HeartRateHistory = getHeartRateHistory(primaryMetrics);
  const p2HeartRateHistory = selectedPlayerMetrics
    ? getHeartRateHistory(selectedPlayerMetrics)
    : undefined;

  // const avgHrSectionData = getAvgHrSectionData(activities14Days, metrics);

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("title"),
        showBackButton: true,
        showDateSelector: false,
        showBGImage: false,
        showCalendarIcon: false,
      }}
    >
      {players && Object.keys(playerData).length !== 0 && (
        <PlayerSelector
          players={players}
          selectedPlayer={selectedPlayer}
          onSelectPlayer={setSelectedPlayer}
          ignorePlayerFirebaseId={playerData.firebase_id}
        />
      )}
      {/* <AverageHeartRateSection data={avgHrSectionData} /> */}
      <MaxAndRestingHeartRateSection
        p1Name={playerData.display_name}
        p2Name={selectedPlayer?.display_name}
        p1History={p1HeartRateHistory}
        p2History={p2HeartRateHistory}
      />
    </ParallaxScrollView>
  );
}
