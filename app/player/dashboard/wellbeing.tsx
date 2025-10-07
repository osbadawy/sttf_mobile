import ParallaxScrollView from "@/components/ParallaxScrollView";
import PlayerSelector from "@/components/PlayerSelector";
import PerformanceSection from "@/components/wellbeing/PerformanceSection";
import SleepSection from "@/components/wellbeing/SleepSection";
import StrainSection from "@/components/wellbeing/StrainSection";
import StressSection from "@/components/wellbeing/StressSection";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAllPlayers } from "@/hooks/useAllPlayers";
import { MultiDayWhoopMetrics } from "@/schemas/whoop";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function WellbeingPage() {
  const { t, isRTL } = useLocalization("components.dashboard.wellbeingSection");
  const { user } = useAuth();
  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  const { players } = useAllPlayers();

  const [metrics, setMetrics] = useState<MultiDayWhoopMetrics>({});

  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const params = new URLSearchParams({
            firebase_id: playerData.firebase_id || user.uid,
            days: "14",
          });
          const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/app/days?${params}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });
          const data = await response.json();
          setMetrics(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user]);

  const today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();

  // Calculate averages for 14 days
  const dataValues = Object.values(metrics);
  const totalStrain = dataValues.reduce((sum, val) => sum + val.strain, 0);
  const numStrainValues =
    dataValues.reduce((sum, val) => (val ? sum + 1 : sum), 0) || 1;
  const avgStrain = numStrainValues > 0 ? totalStrain / numStrainValues : 0;

  const totalStress = dataValues.reduce((sum, val) => sum + val.stress, 0);
  const numStressValues =
    dataValues.reduce((sum, val) => (val ? sum + 1 : sum), 0) || 1;
  const avgStress = numStressValues > 0 ? totalStress / numStressValues : 0;

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
        p1PerformanceHistory={Object.entries(metrics).map(
          ([day, value]) => ({
            date: day,
            value: Math.round(value.performance * 100),
          }),
        )}
      />
      <StrainSection
        strainToday={Math.round(metrics[today]?.strain || 0 * 21)}
        strain14Days={Math.round(avgStrain * 21)}
      />
      <StressSection
        stress={Math.round(metrics[today]?.stress * 10)}
        stress14Days={Math.round(avgStress * 10)}
      />
      <SleepSection
        rem={Number(
          metrics[today]?.sleep.stage_summary.total_rem_sleep_time_milli || 0,
        )}
        sws={Number(
          metrics[today]?.sleep.stage_summary
            .total_slow_wave_sleep_time_milli || 0,
        )}
        light={Number(
          metrics[today]?.sleep.stage_summary.total_light_sleep_time_milli || 0,
        )}
        awake={Number(
          metrics[today]?.sleep.stage_summary.total_awake_time_milli || 0,
        )}
        score={Number(metrics[today]?.sleep.score || 0)}
      />
    </ParallaxScrollView>
  );
}
