import colors from "@/colors";
import MealCard from "@/components/nutrition/MealCard";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlannedMeals } from "@/hooks/meals/usePlannedMeals";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import { Ionicons } from "@expo/vector-icons";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ---- Types & mappings ----
type MealType = "breakfast" | "lunch" | "snack" | "dinner";

const UI_MEAL_LABELS = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;

export default function MealLogPage() {
  const { t, isRTL } = useLocalization("components.nutrition.nutritionList");
  const [manualPressed, setManualPressed] = useState(false);

  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");
  const dateState = useState(new Date());
  const [date, setDate] = dateState;

  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

  const { meals, loading, error } = usePlannedMeals({
    users_assigned:
      Object.keys(playerData).length > 0 ? [playerData.firebase_id] : undefined,
    day: date,
  });

  const organisedMeals: { type: MealType; meals: GetMealsResponse[] }[] =
    mealTypes.map((m) => {
      return {
        type: m,
        meals: meals.filter((meal) => meal.category === m),
      };
    });

  const titleAlign = isRTL ? "text-right" : "text-left";

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("title"),
        showBackButton: true,
        showDateSelector: true,
        showBGImage: false,
        showCalendarIcon: true,
        useDateState: dateState,
        disableFutureDates: false,
      }}
      error={!!error}
    >
      <View className="p-5">
        <View className="mt-4 flex-row items-center justify-between">
          <Text className={`text-2xl font-semibold ${titleAlign}`}>
            {t("header")}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname:
                  "/player/nutrition/NutritionDashboard" as RelativePathString,
                params: {
                  player: player,
                },
              })
            }
          >
            <Text
              className={`text-base font-normal text-primary underline ${titleAlign}`}
            >
              {t("show data")}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        <ScrollView className="mt-5">
          {meals.length > 0 ? (
            organisedMeals.map((m) => {
              if (m.meals.length === 0) {
                return null;
              }

              return (
                <View key={m.type} className="mb-5">
                  <Text className={`text-xl font-normal mb-2 ${titleAlign}`}>
                    {t(m.type)}
                  </Text>
                  <View className="h-[1px] bg-gray-300 w-full" />
                  {m.meals.map((meal, idx) => (
                    <MealCard
                      key={`${m.type}-${idx}-${meal.name}`}
                      name={meal.name}
                      amount={Math.round(meal.amount)}
                      calories={Math.round(meal.kilojoule * 4.184)}
                      type={m.type}
                    />
                  ))}
                </View>
              );
            })
          ) : (
            // Empty state when there are no meals at all
            <View className="items-center justify-center py-10">
              <Ionicons name="fast-food-outline" size={28} color="#94a3b8" />
              <Text className="mt-2 text-slate-500">
                {t("no meals planned") ?? "No meals logged yet."}
              </Text>
            </View>
          )}
          {/* OR divider */}
          <View
            className="my-6 flex-row items-center"
            accessible
            accessibilityRole="text"
            accessibilityLabel="or separator"
          >
            <View className="flex-1 h-[1px] bg-neutral-300" />
            <Text className="mx-3 text-neutral-600 font-medium text-xl">
              {t("or")}
            </Text>
            <View className="flex-1 h-[1px] bg-neutral-300" />
          </View>
          {/* Add Meal Manually button */}
          <TouchableOpacity
            activeOpacity={0.95}
            onPressIn={() => setManualPressed(true)}
            onPressOut={() => setManualPressed(false)}
            onPress={() => router.push("/player/nutrition/ManualInput")}
            className={`
              flex-row items-center justify-center rounded-2xl px-4 py-6
              border-[1px] border-dotted
              ${manualPressed ? "border-emerald-500 bg-emerald-50" : "border-neutral-300 bg-transparent"}
            `}
            accessibilityRole="button"
            accessibilityLabel="Add meal manually"
          >
            <Ionicons
              name="add"
              size={18}
              color={manualPressed ? "#047857" : "#475569"}
            />
            <Text
              className={`ml-2 text-[16px] font-semibold ${
                manualPressed ? "text-emerald-700" : "text-slate-600"
              }`}
            >
              {t("add meal")}
            </Text>
          </TouchableOpacity>
          <View className="h-6" />
          <View className="h-6" /> {/* bottom spacer */}
        </ScrollView>
      </View>
    </ParallaxScrollView>
  );
}
