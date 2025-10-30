// components/nutrition/MealsList.tsx
import BreakfastIcon from "@/components/icons/nutrition/BreakfastIcon";
import DinnerIcon from "@/components/icons/nutrition/DinnerIcon";
import LunchIcon from "@/components/icons/nutrition/LunchIcon";
import SnackIcon from "@/components/icons/nutrition/SnackIcon";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlayerMealLogs } from "@/hooks/meals/usePlayerMealLogs";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

// Helper to convert kilojoules to calories
const kilojouleToCalories = (kilojoule: number): number => {
  return Math.round(kilojoule / 4.184);
};

const ICON_BY_TYPE: Record<
  MealType,
  React.ComponentType<{ className?: string }>
> = {
  breakfast: BreakfastIcon,
  lunch: LunchIcon,
  dinner: DinnerIcon,
  snack: SnackIcon,
};

// ---- Helper: format date like "Tue, 02.09" ----
function formatDateLabel(date: number): string {
  const d = new Date(date);
  const wd = d.toLocaleDateString(undefined, { weekday: "short" }); // Tue
  const dd = d
    .toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" })
    .replace("/", ".");
  // Some locales use "/", normalize to 02.09
  const [m, day] = dd.includes(".") ? dd.split(".") : dd.split("/");
  // dd mm order can vary; ensure "DD.MM"
  const dt = Number(day ?? m) ? `${day}.${m}` : `${m}.${day}`;
  return `${wd}, ${dt}`;
}

export default function MealLog({ firebase_id }: { firebase_id?: string }) {
  const { t, isRTL } = useLocalization("components.nutrition.nutritionList");
  const { data, dataRange, loading, error, fetchAdditionalData } =
    usePlayerMealLogs({
      initialDaysBack: 14,
      user_id: firebase_id,
    });

  const handleLoadMore = () => {
    if (loading) return;

    // If we've loaded all visible data, fetch more from the API
    if (dataRange.earliest) {
      const newEndDate = new Date(dataRange.earliest);
      newEndDate.setDate(newEndDate.getDate() - 1);
      newEndDate.setHours(23, 59, 59, 999);

      const newStartDate = new Date(dataRange.earliest);
      newStartDate.setDate(newStartDate.getDate() - 14);
      newStartDate.setHours(0, 0, 0, 0);

      fetchAdditionalData(newStartDate, newEndDate);
    }
  };

  return (
    <View className="px-5">
      <Text
        className="text-xl font-semibold text-neutral-900 mb-3"
        style={{ textAlign: isRTL ? "right" : "left" }}
      >
        {t("meal log")}
      </Text>
      <View className="h-[1px] bg-neutral-200 mb-2" />

      {loading && Object.keys(data).length === 0 ? (
        <View className="items-center justify-center py-10">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : error ? (
        <View className="items-center justify-center py-10">
          <Text className="text-red-500">{error}</Text>
        </View>
      ) : Object.keys(data).length === 0 ? (
        <View className="items-center justify-center py-10">
          <Text className="text-neutral-500">No meals found</Text>
        </View>
      ) : (
        <>
          {Object.keys(data).map((key) => {
            return (
              <View key={key} className="mb-3">
                <Text className="text-xs text-neutral-500 mb-3">
                  {formatDateLabel(parseInt(key))}
                </Text>

                {data[parseInt(key)].map((m: GetMealsResponse) => {
                  // Map category to meal type for icon, default to snack if unknown
                  const mealType =
                    (m.category?.toLowerCase() as MealType) || "snack";
                  const Icon = ICON_BY_TYPE[mealType] || SnackIcon;
                  const calories = kilojouleToCalories(m.kilojoule);

                  return (
                    <View key={m.id} className="flex-row items-center mb-4">
                      {/* Icon circle */}
                      <View className="w-12 h-12 rounded-full bg-neutral-100 items-center justify-center mr-3">
                        <Icon />
                      </View>

                      {/* Title + weight */}
                      <View className="flex-1">
                        <Text className="text-[15px] text-neutral-900 font-medium">
                          {m.name}
                        </Text>
                        {m.amount && (
                          <Text className="text-[13px] text-neutral-500">
                            {m.amount}{" "}
                            {m.amount_unit === "Na" ? "" : m.amount_unit}
                          </Text>
                        )}
                      </View>

                      {/* Calories */}
                      <View className="flex-row items-baseline">
                        <Text className="effra-semibold text-2xl">
                          {calories ? calories : "--"}{" "}
                          <Text className="effra-light text-base">Kcal</Text>
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}

          {/* Load More */}
          {
            <View className="mt-2 mb-6">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleLoadMore}
                className="h-12 rounded-xl border border-emerald-600 items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#10b981" />
                ) : (
                  <Text className="text-emerald-700 font-medium">
                    Load More
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          }
        </>
      )}
    </View>
  );
}
