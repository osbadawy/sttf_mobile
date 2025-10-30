import colors from "@/colors";
import CustomButton, { ButtonColor, ButtonSize } from "@/components/Button";
import { ArrowBig } from "@/components/icons";
import BodyMetricsCard from "@/components/nutrition/BodyMetricsCard";
import MacroCircleProgress from "@/components/nutrition/MacroCircleProgress";
import MacroSummaryCards from "@/components/nutrition/MacroSummaryCards";
import MealLog from "@/components/nutrition/MealLog";
import NutritionProgress from "@/components/nutrition/NutritionProgress";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlannedMeals } from "@/hooks/meals/usePlannedMeals";
import { useBodyCompositionLatest } from "@/hooks/useBodyCompositionLatest";
import { getMealSummary } from "@/utils/meal";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
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
    onlyMatchSelectedPlayers: true,
  });

  const { data: bodyComposition } = useBodyCompositionLatest({
    firebase_id: playerData.firebase_id,
  });

  const {
    calories,
    carbs,
    protein,
    fats,
    totalCalories,
    totalCarbs,
    totalProteins,
    totalFats,
  } = getMealSummary(meals);

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
            goal={totalCalories || 2000}
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
            weightKg={bodyComposition?.weight_kg || 0}
            bmi={bodyComposition?.bmi || 0}
            fatPercent={bodyComposition?.body_fat_percentage || 0}
            musclePercent={bodyComposition?.muscle_mass_percentage || 0}
          />
          <View className="mt-4 mb-6 self-start">
            <CustomButton
              title={t("body composition")}
              onPress={() =>
                router.push({
                  pathname: "/player/body" as RelativePathString,
                  params: {
                    player_id: String(playerData.id),
                    date: date.toISOString(),
                    player: JSON.stringify(playerData),
                  },
                })
              }
              icon={<ArrowBig stroke={colors.primary} direction="right" />}
              color={ButtonColor.primary}
              size={ButtonSize.sm}
            />
          </View>
        </View>
        <View className="mt-10 mb-6">
          <MealLog firebase_id={playerData.firebase_id} />
        </View>
      </View>
    </ParallaxScrollView>
  );
}
