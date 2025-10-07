import ParallaxScrollView from "@/components/ParallaxScrollView";
import PerformanceSection from "@/components/wellbeing/PerformanceSection";
import SleepSection from "@/components/wellbeing/SleepSection";
import StrainSection from "@/components/wellbeing/StrainSection";
import StressSection from "@/components/wellbeing/StressSection";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { MultiDayWhoopMetrics } from "@/schemas/whoop";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

interface WellbeingPageProps {
  user_id?: string;
}

export default function WellbeingPage({ user_id }: WellbeingPageProps) {
  const { t, isRTL } = useLocalization("components.dashboard.wellbeingSection");
  const { user } = useAuth();

  const [metrics, setMetrics] = useState<MultiDayWhoopMetrics>({});

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const params = new URLSearchParams({
            firebase_id: user_id || user.uid,
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
  }, [user, user_id]);

  const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

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
      <PerformanceSection
        performance={Math.round(metrics[today]?.performance || 0 * 100)}
        performance14DaysHistory={Object.entries(metrics).map(
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
        stress={Math.round(metrics[today]?.stress || 0 * 10)}
        stress14Days={Math.round(avgStress * 10)}
      />
      <SleepSection
        rem={
          metrics[today]?.sleep.stage_summary.total_rem_sleep_time_milli || 0
        }
        sws={
          metrics[today]?.sleep.stage_summary
            .total_slow_wave_sleep_time_milli || 0
        }
        light={
          metrics[today]?.sleep.stage_summary.total_light_sleep_time_milli || 0
        }
        awake={metrics[today]?.sleep.stage_summary.total_awake_time_milli || 0}
        score={metrics[today]?.sleep.score || 0}
      />
    </ParallaxScrollView>
  );
}
