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
import { getAvgValue } from "@/utils/data";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";

export default function WellbeingPage() {
  const { t, isRTL } = useLocalization("components.dashboard.wellbeingSection");
  const { player } = useLocalSearchParams();
  const playerData = useMemo(
    () => JSON.parse((player as string) || "{}"),
    [player],
  );

  const { players } = useAllPlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const { user } = useAuth();

  const {
    primaryMetrics,
    selectedPlayerMetrics,
    primaryError,
    selectedPlayerError,
  } = useMultiPlayerWhoopData({
    primaryFirebaseId: playerData.firebase_id || user?.uid,
    selectedPlayerFirebaseId: selectedPlayer?.firebase_id,
    days: 14,
  });

  const today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();

  const primaryMetricsExist = Object.keys(primaryMetrics).length > 0;
  const selectedPlayerMetricsExist =
    Object.keys(selectedPlayerMetrics).length > 0;

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("title"),
        showBackButton: true,
        showDateSelector: false,
        showBGImage: false,
        showCalendarIcon: false,
      }}
      error={Boolean(primaryError) || Boolean(selectedPlayerError)}
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
        p1StrainToday={
          primaryMetricsExist
            ? Math.round(primaryMetrics[today]?.basic.strain * 21)
            : 0
        }
        p2StrainToday={
          selectedPlayer && selectedPlayerMetricsExist
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
        p1StressToday={
          primaryMetricsExist
            ? Math.round(primaryMetrics[today]?.basic.stress * 10)
            : 0
        }
        p2StressToday={
          selectedPlayer && selectedPlayerMetricsExist
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
        p1Score={
          primaryMetricsExist
            ? Number(primaryMetrics[today]?.sleep.score || 0)
            : 0
        }
        p2Score={
          selectedPlayer && selectedPlayerMetricsExist
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
