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
          console.log('Extracted metrics:', extractedMetrics);
          setMetrics(extractedMetrics);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user]);

  // Calculate current values (most recent cycle)
  const currentDailyAvgHeartRate = metrics.dailyAvgHeartRate.length > 0 ? metrics.dailyAvgHeartRate[0] : 0;

  // Create history data for MaxAndRestingHeartRateSection
  const heartRateHistory = metrics.restingHeartRate.length > 0 
    ? metrics.restingHeartRate.map((resting, index) => ({
        resting: Math.round(resting || 0),
        max: Math.round(metrics.maxHeartRate[index] || 0),
      }))
    : [{resting: 0, max: 0}];

  // Create average heart rate history for AverageHeartRateSection
  const averageHeartRateHistory = metrics.dailyAvgHeartRate.length > 0
    ? metrics.dailyAvgHeartRate.map((rate, index) => ({
        time: metrics.performance[index]?.date || `${index + 1}`,
        heartRate: Math.round(rate || 0),
      }))
    : [{time: "1", heartRate: 0}];

  console.log('All metrics:', metrics)
  console.log('Daily avg heart rate:', metrics.dailyAvgHeartRate)
  console.log('Resting heart rate:', metrics.restingHeartRate)
  console.log('Max heart rate:', metrics.maxHeartRate)
  // console.log('HRV data:', metrics.hrv)

  return (
    <PageWithArrow
      title={t("title")}
      backLink={"dashboard" as RelativePathString}
      isRTL={isRTL}
    >
      <AverageHeartRateSection
        averageHeartRate={Math.round(currentDailyAvgHeartRate)}
        averageHeartRateHistory={averageHeartRateHistory}
        HRV={metrics.hrv.length > 0 ? Math.round(metrics.hrv[0]) : 0}
        averageHRV={metrics.hrv.length > 0 ? Math.round(metrics.hrv.reduce((sum, val) => sum + (val || 0), 0) / metrics.hrv.length) : 0}
      />
      <MaxAndRestingHeartRateSection
        history={heartRateHistory}
      />

      <Text>Heart</Text> 
    </PageWithArrow>
  );
}
