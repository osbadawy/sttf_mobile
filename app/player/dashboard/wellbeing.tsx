import ParallaxScrollView from "@/components/ParallaxScrollView";
import PlayerSelector from "@/components/PlayerSelector";
import PerformanceSection from "@/components/wellbeing/PerformanceSection";
import SleepSection from "@/components/wellbeing/SleepSection";
import StrainSection from "@/components/wellbeing/StrainSection";
import StressSection from "@/components/wellbeing/StressSection";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAllPlayers } from "@/hooks/useAllPlayers";
import { useMultiPlayerWhoopData } from "@/hooks/useMultiDayWhoopData";
import { MultiDayWhoopMetrics, WhoopMetrics } from "@/schemas/whoop";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

function getAvgValue(metrics: MultiDayWhoopMetrics, key: keyof WhoopMetrics) {
  const dataValues = Object.values(metrics);
  const total = dataValues.reduce((sum, val) => sum + (val[key] as number), 0);
  const numValues =
    dataValues.reduce((sum, val) => (val ? sum + 1 : sum), 0) || 1;
  return numValues > 0 ? total / numValues : 0;
}

export default function WellbeingPage() {
  const { t, isRTL } = useLocalization("components.dashboard.wellbeingSection");
  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  const { players } = useAllPlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  const {
    primaryMetrics,
    selectedPlayerMetrics,
    primaryLoading,
    selectedPlayerLoading,
  } = useMultiPlayerWhoopData({
    primaryFirebaseId: playerData.firebase_id,
    selectedPlayerFirebaseId: selectedPlayer?.firebase_id,
    days: "14",
  });

  const today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();

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
      {players && (
        <PlayerSelector
          players={players}
          selectedPlayer={selectedPlayer}
          onSelectPlayer={setSelectedPlayer}
          ignorePlayerFirebaseId={playerData.firebase_id}
        />
      )}

      <PerformanceSection
        p1Name={playerData.display_name}
        p2Name={selectedPlayer?.display_name}
        p1PerformanceHistory={Object.entries(primaryMetrics).map(
          ([day, value]) => ({
            date: day,
            value: Math.round(value.performance * 100),
          }),
        )}
        p2PerformanceHistory={
          selectedPlayer
            ? Object.entries(selectedPlayerMetrics).map(([day, value]) => ({
                date: day,
                value: Math.round(value.performance * 100),
              }))
            : undefined
        }
      />

      <StrainSection
        p1Name={playerData.display_name}
        p2Name={selectedPlayer?.display_name}
        p1StrainToday={Math.round(primaryMetrics[today]?.strain * 21)}
        p2StrainToday={
          selectedPlayer
            ? Math.round(selectedPlayerMetrics[today]?.strain * 21)
            : undefined
        }
        p1AvgStrain={Math.round(getAvgValue(primaryMetrics, "strain") * 21)}
        p2AvgStrain={
          selectedPlayer
            ? Math.round(getAvgValue(selectedPlayerMetrics, "strain") * 21)
            : undefined
        }
      />
      <StressSection
        stress={Math.round(primaryMetrics[today]?.stress * 10)}
        stress14Days={Math.round(getAvgValue(primaryMetrics, "stress") * 10)}
      />
      <SleepSection
        rem={Number(
          primaryMetrics[today]?.sleep.stage_summary
            .total_rem_sleep_time_milli || 0,
        )}
        sws={Number(
          primaryMetrics[today]?.sleep.stage_summary
            .total_slow_wave_sleep_time_milli || 0,
        )}
        light={Number(
          primaryMetrics[today]?.sleep.stage_summary
            .total_light_sleep_time_milli || 0,
        )}
        awake={Number(
          primaryMetrics[today]?.sleep.stage_summary.total_awake_time_milli ||
            0,
        )}
        score={Number(primaryMetrics[today]?.sleep.score || 0)}
      />
    </ParallaxScrollView>
  );
}
