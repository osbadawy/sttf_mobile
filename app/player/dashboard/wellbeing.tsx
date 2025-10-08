import ParallaxScrollView from "@/components/ParallaxScrollView";
import PlayerSelector from "@/components/PlayerSelector";
import PerformanceSection from "@/components/wellbeing/PerformanceSection";
import SleepSection from "@/components/wellbeing/SleepSection";
import StrainSection from "@/components/wellbeing/StrainSection";
import StressSection from "@/components/wellbeing/StressSection";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAllPlayers } from "@/hooks/useAllPlayers";
import { useMultiPlayerWhoopData } from "@/hooks/useMultiDayWhoopData";
import { MultiDayWhoopMetrics } from "@/schemas/whoop";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

function getAvgValue(metrics: MultiDayWhoopMetrics, keys: string[]) {
  const dataValues = Object.values(metrics);
  const total = dataValues.reduce((sum, val) => {
    // Navigate to the most nested value using the keys array
    let current: any = val;
    for (const key of keys) {
      current = current?.[key];
    }
    return sum + ((current as number) || 0);
  }, 0);
  const numValues =
    dataValues.reduce((sum, val) => {
      // Check if the nested value exists
      let current: any = val;
      for (const key of keys) {
        current = current?.[key];
      }
      return current !== undefined && current !== null ? sum + 1 : sum;
    }, 0) || 1;
  return numValues > 0 ? total / numValues : 0;
}

export default function WellbeingPage() {
  const { t, isRTL } = useLocalization("components.dashboard.wellbeingSection");
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
      {players && Object.keys(playerData).length !== 0 && (
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
            value: Math.round(value.basic.performance * 100),
          }),
        )}
        p2PerformanceHistory={
          selectedPlayer
            ? Object.entries(selectedPlayerMetrics).map(([day, value]) => ({
                date: day,
                value: Math.round(value.basic.performance * 100),
              }))
            : undefined
        }
      />

      <StrainSection
        p1Name={playerData.display_name}
        p2Name={selectedPlayer?.display_name}
        p1StrainToday={Math.round(primaryMetrics[today]?.basic.strain * 21)}
        p2StrainToday={
          selectedPlayer
            ? Math.round(selectedPlayerMetrics[today]?.basic.strain * 21)
            : undefined
        }
        p1AvgStrain={Math.round(
          getAvgValue(primaryMetrics, ["basic", "strain"]) * 21,
        )}
        p2AvgStrain={
          selectedPlayer
            ? Math.round(
                getAvgValue(selectedPlayerMetrics, ["basic", "strain"]) * 21,
              )
            : undefined
        }
      />
      <StressSection
        p1Name={playerData.display_name}
        p2Name={selectedPlayer?.display_name}
        p1StressToday={Math.round(primaryMetrics[today]?.basic.stress * 10)}
        p2StressToday={
          selectedPlayer
            ? Math.round(selectedPlayerMetrics[today]?.basic.stress * 10)
            : undefined
        }
        p1AvgStress={Math.round(
          getAvgValue(primaryMetrics, ["basic", "stress"]) * 10,
        )}
        p2AvgStress={
          selectedPlayer
            ? Math.round(
                getAvgValue(selectedPlayerMetrics, ["basic", "stress"]) * 10,
              )
            : undefined
        }
      />
      <SleepSection
        p1Name={playerData.display_name}
        p2Name={selectedPlayer?.display_name}
        p1Score={Number(primaryMetrics[today]?.sleep.score || 0)}
        p2Score={
          selectedPlayer
            ? Number(selectedPlayerMetrics[today]?.sleep.score || 0)
            : undefined
        }
        p1StageSummary={primaryMetrics[today]?.sleep.stage_summary}
        p2StageSummary={
          selectedPlayer
            ? selectedPlayerMetrics[today]?.sleep.stage_summary
            : undefined
        }
      />
    </ParallaxScrollView>
  );
}
