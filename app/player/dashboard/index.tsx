import {
  HeartSection,
  SleepSection,
  WellbeingSection,
} from "@/components/dashboard";
import NutritionCard from "@/components/dashboard/NutritionCard";
import { HeaderColor } from "@/components/Header";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  extractSingleDayMetricsFromData,
  SingleDayMetrics,
} from "@/utils/whoopMetrics";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

interface DashboardProps {
  user_id?: string;
}

export default function Dashboard({ user_id }: DashboardProps) {
  const { user } = useAuth();
  const { userName, profilePicture } = useUserProfile();

  const useDateState = useState(new Date());
  const [date, setDate] = useDateState;

  const [metrics, setMetrics] = useState<SingleDayMetrics>({
    performance: 0,
    stress: 0,
    strain: 0,
    sleepScore: 0,
    sleepDurationMilli: 0,
    sleepNeededMilli: 0,
    restingHeartRate: 0,
    maxHeartRate: 0,
    dailyAvgHeartRate: 0,
    hrv: 0,
    workoutAverageHeartRate: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const params = new URLSearchParams({
            firebase_id: user_id || user.uid,
            day: date.toISOString(),
          });
          const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/app/day?${params}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });
          console.log(params.get("day"))
          const data = await response.json();
          const extractedMetrics = extractSingleDayMetricsFromData(data);
          setMetrics(extractedMetrics);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [date, user, user_id]);

  return (
    <ParallaxScrollView
      headerProps={{
        name: userName || "User",
        profilePicture: profilePicture,
        color: HeaderColor.BG,
        showDateSelector: true,
        useDateState: useDateState,
      }}
    >
      <WellbeingSection
        performance={metrics.performance}
        strain={metrics.strain}
        stress={metrics.stress}
        animationDuration={1000}
      />
      <SleepSection
        sleepScore={metrics.sleepScore}
        sleepDurationMilli={metrics.sleepDurationMilli}
        sleepNeededMilli={metrics.sleepNeededMilli}
      />
      <HeartSection
        dailyAvg={metrics.dailyAvgHeartRate}
        max={metrics.maxHeartRate}
        resting={metrics.restingHeartRate}
      />
      <NutritionCard />
    </ParallaxScrollView>
  );
}
