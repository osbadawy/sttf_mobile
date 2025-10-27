import {
  HeartSection,
  SleepSection,
  WellbeingSection,
} from "@/components/dashboard";
import NutritionCard from "@/components/dashboard/NutritionCard";
import { HeaderColor } from "@/components/Header";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useWhoopData } from "@/hooks/useWhoopData";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator } from "react-native";

export default function Dashboard() {
  const { userName, profilePicture, access } = useUserProfile();
  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  const useDateState = useState(new Date());
  const [date, setDate] = useDateState;

  const { metrics, loading, error } = useWhoopData({
    firebaseId: playerData.firebase_id,
    date: date,
  });

  return (
    <ParallaxScrollView
      headerProps={{
        name: (playerData.display_name as string) || userName || access,
        profilePicture:
          (playerData.profile_picture as string) || profilePicture,
        color: HeaderColor.BG,
        showDateSelector: true,
        useDateState: useDateState,
      }}
      error={Boolean(error)}
    >
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <WellbeingSection
        performance={metrics.basic.performance}
        strain={metrics.basic.strain}
        stress={metrics.basic.stress}
        animationDuration={1000}
      />
      <SleepSection sleep={metrics.sleep} />
      <HeartSection
        dailyAvg={metrics.heart.avg}
        max={metrics.heart.max}
        resting={metrics.heart.resting}
      />
      <NutritionCard />
    </ParallaxScrollView>
  );
}
