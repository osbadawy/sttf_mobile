import BodyMetricsCard from "@/components/nutrition/BodyMetricsCard";
import MacroCircleProgress from "@/components/nutrition/MacroCircleProgress";
import MacroSummaryCards from "@/components/nutrition/MacroSummaryCards";
import MealLog from "@/components/nutrition/MealLog";
import NutritionProgress from "@/components/nutrition/NutritionProgress";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlannedMeals } from "@/hooks/meals/usePlannedMeals";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function NutritionDashboard() {
  const { t } = useLocalization("components.nutrition.nutritionList");
  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  const { user } = useAuth();
  const firebaseId = user?.uid || playerData.firebase_id;

  const dateState = useState(new Date());
  const [date, setDate] = dateState;

  const { meals, loading, error } = usePlannedMeals({
    users_assigned: [firebaseId],
    day: date,
  });

  const completedEntries = meals.filter((meal) => {
    const assinedEntry = meal.players_assigned.find(
      (player) => player.assigned_to_user.firebase_id === firebaseId,
    );
    return assinedEntry && assinedEntry.completions.length > 0;
  });

  const calories = Math.round(
    completedEntries.reduce((acc, meal) => acc + meal.kilojoule / 4.184, 0),
  );
  const carbs = Math.round(
    completedEntries.reduce((acc, meal) => acc + meal.carbohydrates, 0),
  );
  const protein = Math.round(
    completedEntries.reduce((acc, meal) => acc + meal.protein, 0),
  );
  const fats = Math.round(
    completedEntries.reduce((acc, meal) => acc + meal.fat, 0),
  );

  const totalCalories = Math.round(
    meals.reduce((acc, meal) => acc + meal.kilojoule / 4.184, 2000),
  );
  const totalCarbs = Math.round(
    meals.reduce((acc, meal) => acc + meal.carbohydrates, 0),
  );
  const totalProteins = Math.round(
    meals.reduce((acc, meal) => acc + meal.protein, 0),
  );
  const totalFats = Math.round(meals.reduce((acc, meal) => acc + meal.fat, 0));

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("nutritionDashboard"),
        showBackButton: true,
        showDateSelector: true,
        showBGImage: false,
        showCalendarIcon: true,
        useDateState: dateState,
      }}
    >
      <View className="p-2">
        {/* Macro summary cards */}
        <MacroSummaryCards
          totalCarbs={totalCarbs}
          totalProteins={totalProteins}
          totalFats={totalFats}
          carbs={carbs}
          protein={protein}
          fats={fats}
        />
        {/* Calories + Progress */}
        <View className="mt-10">
          <NutritionProgress
            consumed={calories}
            goal={totalCalories}
            unit="Kcal"
          />
        </View>
        <View className="flex items-center mt-10">
          <MacroCircleProgress
            totalCarbs={totalCarbs}
            totalProteins={totalProteins}
            totalFats={totalFats}
            carbs={carbs}
            protein={protein}
            fats={fats}
            size={240}
            strokeWidth={24}
          />
        </View>
        <View className="mt-10">
          <BodyMetricsCard
            weightKg={83.2}
            bmi={20.5}
            fatPercent={12.2}
            musclePercent={35.6}
          />
        </View>
        <View className="mt-10 mb-6">
          <MealLog />
        </View>
      </View>
    </ParallaxScrollView>
  );
}
