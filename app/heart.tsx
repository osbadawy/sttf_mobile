import PageWithArrow from "@/components/PageWithArrow";
import AverageHeartRateSection from "@/components/heart/AverageHeartRateSection";
import MaxAndRestingHeartRateSection from "@/components/heart/MaxAndRestingHeartRateSection";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import {
  extractMultiDayMetricsFromData,
  MultiDayMetrics,
} from "@/utils/whoopMetrics";
import Constants from "expo-constants";
import { RelativePathString } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";

interface HeartPageProps {
  user_id?: string;
}

export default function HeartPage({ user_id }: HeartPageProps) {
  const { t, isRTL } = useLocalization("components.dashboard.heartSection");
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

  // const [isLoading, setIsLoading] = useState(true);

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

  // Calculate current values (most recent cycle) - filter out zero values
  const validWorkoutRates = metrics.workoutAverageHeartRate.filter(
    (rate) => rate.value > 0,
  );
  const currentWorkoutAvgHeartRate =
    validWorkoutRates.length > 0 ? validWorkoutRates[0].value : 0;

  // Create history data for MaxAndRestingHeartRateSection
  const heartRateHistory =
    metrics.restingHeartRate.length > 0
      ? metrics.restingHeartRate.map((resting, index) => ({
          resting: Math.round(resting || 0),
          max: Math.round(metrics.maxHeartRate[index] || 0),
        }))
      : [{ resting: 0, max: 0 }];

  // Create workout average heart rate history for AverageHeartRateSection - filter out zero values
  const averageHeartRateHistory =
    validWorkoutRates.length > 0
      ? validWorkoutRates
          .map((workoutRate) => ({
            time: workoutRate.date,
            heartRate: Math.round(workoutRate.value),
          }))
          .reverse()
      : [{ time: "1", heartRate: 0 }];

  return (
    <PageWithArrow
      title={t("title")}
      backLink={"dashboard" as RelativePathString}
      isRTL={isRTL}
    >
      <AverageHeartRateSection
        averageHeartRate={Math.round(currentWorkoutAvgHeartRate)}
        averageHeartRateHistory={averageHeartRateHistory}
        HRV={metrics.hrv.length > 0 ? Math.round(metrics.hrv[0]) : 0}
        averageHRV={
          metrics.hrv.length > 0
            ? Math.round(
                metrics.hrv.reduce((sum, val) => sum + (val || 0), 0) /
                  metrics.hrv.length,
              )
            : 0
        }
      />
      <MaxAndRestingHeartRateSection history={heartRateHistory} />

      <Text>Heart</Text>
    </PageWithArrow>
  );
}
