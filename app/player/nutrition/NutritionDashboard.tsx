import BodyMetricsCard from "@/components/nutrition/BodyMetricsCard";
import MacroCircleProgress from "@/components/nutrition/MacroCircleProgress";
import MacroSummaryCards from "@/components/nutrition/MacroSummaryCards";
import MealLog from "@/components/nutrition/MealLog";
import NutritionProgress from "@/components/nutrition/NutritionProgress";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { View } from "react-native";

export default function NutritionDashboard() {
  const { t } = useLocalization("components.nutrition.nutritionList");

  // Placeholder totals; wire these to real data later
  const consumed = 924;
  const goal = 2802;

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("nutritionDashboard"),
        showBackButton: true,
        showDateSelector: false,
        showBGImage: false,
        showCalendarIcon: true,
      }}
    >
      <View className="p-2">
        {/* Macro summary cards */}
        <MacroSummaryCards
          totalCarbs={115}
          totalProteins={60}
          totalFats={24}
          carbs={280}
          protein={150}
          fats={132}
        />
        {/* Calories + Progress */}
        <View className="mt-10">
          <NutritionProgress consumed={consumed} goal={goal} unit="Kcal" />
        </View>
        <View className="flex items-center mt-10">
          <MacroCircleProgress
            totalCarbs={280}
            totalProteins={150}
            totalFats={132}
            carbs={180}
            protein={100}
            fats={132}
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
