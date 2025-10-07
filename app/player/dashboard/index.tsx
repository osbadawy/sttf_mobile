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
import { exampleWhoopMetrics, WhoopMetrics } from "@/schemas/whoop";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

interface DashboardProps {
  user_id?: string;
}

export default function Dashboard({ user_id }: DashboardProps) {
  const { user } = useAuth();
  const { userName, profilePicture } = useUserProfile();
  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  const useDateState = useState(new Date());
  const [date, setDate] = useDateState;

  const [metrics, setMetrics] = useState<WhoopMetrics>(exampleWhoopMetrics);
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const params = new URLSearchParams({
            firebase_id: playerData.firebase_id || user.uid,
            day: date.toISOString(),
          });
          const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/app/day?${params}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });
          const data = await response.json();
          setMetrics(
            (Object.values(data)[0] as WhoopMetrics) || exampleWhoopMetrics,
          );
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
        name: (playerData.display_name as string) || userName || "User",
        profilePicture:
          (playerData.profile_picture as string) || profilePicture,
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
      <SleepSection sleep={metrics.sleep} />
      <HeartSection
        dailyAvg={metrics.dailyAvgHeartRate}
        max={metrics.maxHeartRate}
        resting={metrics.restingHeartRate}
      />
      <NutritionCard />
    </ParallaxScrollView>
  );
}
