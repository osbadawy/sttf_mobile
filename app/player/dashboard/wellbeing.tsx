import ParallaxScrollView from "@/components/ParallaxScrollView";
import PerformanceSection from "@/components/wellbeing/PerformanceSection";
import SleepSection from "@/components/wellbeing/SleepSection";
import StrainSection from "@/components/wellbeing/StrainSection";
import StressSection from "@/components/wellbeing/StressSection";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import {
  extractMultiDayMetricsFromData,
  MultiDayMetrics,
} from "@/utils/whoopMetrics";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

interface WellbeingPageProps {
  user_id?: string;
}

export default function WellbeingPage({ user_id }: WellbeingPageProps) {
  const { t, isRTL } = useLocalization("components.dashboard.wellbeingSection");
  const { user } = useAuth();

  const [metrics, setMetrics] = useState<MultiDayMetrics>({
    performance: [],
    stress: [],
    strain: [],
    sleepScore: [],
    sleepDurationMilli: [],
    sleepNeededMilli: [],
    restingHeartRate: [],
    maxHeartRate: [],
    dailyAvgHeartRate: [],
    hrv: [],
    workoutAverageHeartRate: [],
  });

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

          // Extract metrics from all cycles
          const extractedMetrics = extractMultiDayMetricsFromData(data);
          setMetrics(extractedMetrics);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user, user_id]);

  // Calculate current values (most recent cycle)
  const currentPerformance = metrics.performance[0]?.value || 0;
  const currentStrain = metrics.strain[0] || 0;
  const currentStress = metrics.stress[0] || 0;
  const currentSleepScore = metrics.sleepScore[0] || 0;

  // Calculate averages for 14 days
  const avgStrain =
    metrics.strain.length > 0
      ? metrics.strain.reduce((sum, val) => sum + val, 0) /
        metrics.strain.length
      : 0;
  const avgStress =
    metrics.stress.length > 0
      ? metrics.stress.reduce((sum, val) => sum + val, 0) /
        metrics.stress.length
      : 0;

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
        performance={Math.round(currentPerformance * 100)}
        performance14DaysHistory={metrics.performance
          .slice()
          .reverse()
          .map((p) => ({
            date: p.date,
            value: Math.round(p.value * 100),
          }))}
      />
      <StrainSection
        strainToday={Math.round(currentStrain * 21)}
        strain14Days={Math.round(avgStrain * 21)}
      />
      <StressSection
        stress={Math.round(currentStress * 10)}
        stress14Days={Math.round(avgStress * 10)}
      />
      <SleepSection
        rem={12}
        sws={15.5}
        light={18}
        awake={21}
        score={currentSleepScore}
      />
    </ParallaxScrollView>
  );
}
