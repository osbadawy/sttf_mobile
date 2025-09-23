import PageWithArrow from "@/components/PageWithArrow";
import PerformanceSection from "@/components/wellbeing/PerformanceSection";
import SleepSection from "@/components/wellbeing/SleepSection";
import StrainSection from "@/components/wellbeing/StrainSection";
import StressSection from "@/components/wellbeing/StressSection";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import Constants from "expo-constants";
import { RelativePathString } from "expo-router";
import { useEffect, useState } from "react";

interface WellbeingPageProps {
  user_id?: string;
}

interface PerformanceDataPoint {
  date: string;
  value: number;
}

interface WellbeingMetrics {
  performance: PerformanceDataPoint[];
  stress: number[];
  strain: number[];
  sleepScore: number[];
  sleepDurationMilli: number[];
  sleepNeededMilli: number[];
  restingHeartRate: number[];
  maxHeartRate: number[];
  dailyAvgHeartRate: number[];
}

function extractWellbeingMetricsFromData(data: any): WellbeingMetrics {
  const cycles = data.whoop_user.cycles;

  // Sort cycles by start date (newest first)
  const sortedCycles = cycles.sort(
    (a: any, b: any) =>
      new Date(b.start).getTime() - new Date(a.start).getTime(),
  );

  const performance: PerformanceDataPoint[] = [];
  const stress: number[] = [];
  const strain: number[] = [];
  const sleepScore: number[] = [];
  const sleepDurationMilli: number[] = [];
  const sleepNeededMilli: number[] = [];
  const restingHeartRate: number[] = [];
  const maxHeartRate: number[] = [];
  const dailyAvgHeartRate: number[] = [];

  sortedCycles.forEach((cycle: any) => {
    let _performance = 0;
    let _stress = 0;
    let _strain = 0;
    let _sleepScore = 0;
    let _sleepDurationMilli = 0;
    let _sleepNeededMilli = 0;
    let _restingHeartRate = 0;
    let _maxHeartRate = 0;
    let _dailyAvgHeartRate = 0;

    if (cycle) {
      _strain = cycle.score.strain / 21;
      _dailyAvgHeartRate = cycle.score.average_heart_rate;
      _maxHeartRate = cycle.score.max_heart_rate;

      if (cycle.recoveries.length > 0) {
        _stress = (100 - cycle.recoveries[0].score.recovery_score) / 100;
        _restingHeartRate = cycle.recoveries[0].score.resting_heart_rate;
      }

      if (cycle.sleeps.length > 0) {
        // Choose the sleep which lasts the longest (stop-start) and nap is false
        const longestSleep = cycle.sleeps
          .filter((sleep: any) => !sleep.nap) // Filter out naps
          .sort((a: any, b: any) => {
            const durationA =
              new Date(a.end).getTime() - new Date(a.start).getTime();
            const durationB =
              new Date(b.end).getTime() - new Date(b.start).getTime();
            return durationB - durationA; // Sort by duration descending
          })[0];

        if (longestSleep) {
          _sleepScore = longestSleep.score.sleep_performance_percentage / 100;
          _sleepDurationMilli =
            longestSleep.score.stage_summary.total_in_bed_time_;
          _sleepNeededMilli = longestSleep.score.sleep_needed.baseline_milli;
        }
      }
    }

    // Calculate performance metric
    if (_stress && _strain) {
      _performance = 1 - (_stress + _strain) / 2;
    }

    performance.push({
      date: new Date(cycle.start).toLocaleDateString("en-US", {
        day: "2-digit",
      }),
      value: _performance,
    });
    stress.push(_stress);
    strain.push(_strain);
    sleepScore.push(_sleepScore);
    sleepDurationMilli.push(_sleepDurationMilli);
    sleepNeededMilli.push(_sleepNeededMilli);
    restingHeartRate.push(_restingHeartRate);
    maxHeartRate.push(_maxHeartRate);
    dailyAvgHeartRate.push(_dailyAvgHeartRate);
  });

  return {
    performance,
    stress,
    strain,
    sleepScore,
    sleepDurationMilli,
    sleepNeededMilli,
    restingHeartRate,
    maxHeartRate,
    dailyAvgHeartRate,
  };
}

export default function WellbeingPage({ user_id }: WellbeingPageProps) {
  const { t, isRTL } = useLocalization("components.dashboard.wellbeingSection");
  const { user } = useAuth();

  const [metrics, setMetrics] = useState<WellbeingMetrics>({
    performance: [],
    stress: [],
    strain: [],
    sleepScore: [],
    sleepDurationMilli: [],
    sleepNeededMilli: [],
    restingHeartRate: [],
    maxHeartRate: [],
    dailyAvgHeartRate: [],
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
          console.log(data);

          // Extract metrics from all cycles
          const extractedMetrics = extractWellbeingMetricsFromData(data);
          setMetrics(extractedMetrics);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user]);

  // Calculate current values (most recent cycle)
  const currentPerformance = metrics.performance[0]?.value || 0;
  const currentStrain = metrics.strain[0] || 0;
  const currentStress = metrics.stress[0] || 0;
  const currentSleepScore = metrics.sleepScore[0] || 0;

  // Calculate averages for 14 days
  const avgPerformance =
    metrics.performance.length > 0
      ? metrics.performance.reduce((sum, val) => sum + val.value, 0) /
        metrics.performance.length
      : 0;
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
    <PageWithArrow
      title={t("title")}
      backLink={"dashboard" as RelativePathString}
      isRTL={isRTL}
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
    </PageWithArrow>
  );
}
