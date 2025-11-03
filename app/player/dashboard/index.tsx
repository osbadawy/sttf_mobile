import {
  HeartSection,
  SleepSection,
  WellbeingSection,
} from "@/components/dashboard";
import NutritionCard from "@/components/dashboard/NutritionCard";
import { HeaderColor } from "@/components/Header";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { usePlannedMeals } from "@/hooks/meals/usePlannedMeals";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useWhoopData } from "@/hooks/useWhoopData";
import { getMealSummary } from "@/utils/meal";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function Dashboard() {
  const { userName, profilePicture, access } = useUserProfile();
  const { player } = useLocalSearchParams();
  const playerData = useMemo(
    () => JSON.parse((player as string) || "{}"),
    [player],
  );

  const useDateState = useState(new Date());
  const [date, setDate] = useDateState;

  const { metrics, loading, error } = useWhoopData({
    firebaseId: playerData.firebase_id,
    date: date,
  });

  const usersAssigned = useMemo(
    () => (playerData.firebase_id ? [playerData.firebase_id] : undefined),
    [playerData.firebase_id],
  );

  const {
    meals,
    loading: mealLoading,
    error: mealError,
  } = usePlannedMeals({
    users_assigned: usersAssigned,
    day: date,
    onlyMatchSelectedPlayers: true,
  });

  const { calories, totalCalories } = getMealSummary(meals);

  return (
    <ParallaxScrollView
      headerProps={{
        name: (playerData.display_name as string) || userName || access || "Player",
        profilePicture:
          (playerData.profile_picture as string) || profilePicture,
        color: HeaderColor.BG,
        showDateSelector: true,
        useDateState: useDateState,
      }}
      error={Boolean(error) || Boolean(mealError)}
    >
      {(loading || mealLoading) && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
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
      <NutritionCard calories={calories} totalCalories={totalCalories} />
    </ParallaxScrollView>
  );
}
