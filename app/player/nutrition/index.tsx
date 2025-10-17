import MealCard from "@/components/nutrition/MealCard";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// ---- Types & mappings ----
type MealType = "breakfast" | "lunch" | "snack" | "dinner";

const UI_MEAL_LABELS = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;
type UiMealLabel = typeof UI_MEAL_LABELS[number];

const labelToMealType: Record<UiMealLabel, MealType> = {
  Breakfast: "breakfast",
  Lunch: "lunch",
  Dinner: "dinner",
  Snacks: "snack",
};

type Meal = { food: string; amount: string; calories: number };
type GroupedMeals = Partial<Record<UiMealLabel, Meal[]>>;

export default function MealLogPage() {
  const { t, isRTL } = useLocalization("components.nutrition.nutritionList");
  const [manualPressed, setManualPressed] = useState(false);

  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  const [meals, setMeals] = useState<
    Array<{ meal_type: UiMealLabel; food: string; calories: number; amount: string }>
  >([]);
  const [mealFilters, setMealFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showNewMealDropdown, setShowNewMealDropdown] = useState(false);

  useEffect(() => {
    const fetchMeals = async () => {
      const data: Array<{ meal_type: UiMealLabel; food: string; calories: number; amount: string }> = [
        { meal_type: "Breakfast", food: "Oatmeal", calories: 150, amount: "1 bowl" },
        { meal_type: "Breakfast", food: "Scrambled Eggs", calories: 200, amount: "2 eggs" },
        { meal_type: "Lunch", food: "Chicken Salad", calories: 350, amount: "1 plate" },
        { meal_type: "Lunch", food: "Quinoa Bowl", calories: 400, amount: "1 bowl" },
        { meal_type: "Dinner", food: "Grilled Salmon", calories: 500, amount: "1 fillet" },
        { meal_type: "Dinner", food: "Steamed Vegetables", calories: 100, amount: "1 cup" },
        { meal_type: "Snacks", food: "Almonds", calories: 150, amount: "1 handful" },
        { meal_type: "Snacks", food: "Greek Yogurt", calories: 120, amount: "1 cup" },
      ];
      setMeals(data);
    };

    fetchMeals();
  }, []);

  const groupedMeals: GroupedMeals = meals.reduce<GroupedMeals>((acc, meal) => {
    const { meal_type, food, calories, amount } = meal;
    if (!acc[meal_type]) acc[meal_type] = [];
    acc[meal_type]!.push({ food, calories, amount });
    return acc;
  }, {});

  // Only labels that have meals
  const presentLabels: UiMealLabel[] = UI_MEAL_LABELS.filter(
    (label) => (groupedMeals[label]?.length ?? 0) > 0
  );

  // ✅ Localize section titles BEFORE mapping/render
  const localizedLabel: Record<UiMealLabel, string> = {
    Breakfast: t("breakfast"),
    Lunch: t("lunch"),
    Dinner: t("dinner"),
    Snacks: t("snacks"),
  };

  // Build sections to render: keeps stable key (label), adds localized title + normalized mealType
  const sections = presentLabels.map((label) => ({
    label,
    title: localizedLabel[label],
    mealType: labelToMealType[label],
    items: groupedMeals[label] ?? [],
  }));

  const titleAlign = isRTL ? "text-right" : "text-left";

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("title"),
        showBackButton: true,
        showDateSelector: false,
        showBGImage: false,
        showCalendarIcon: false,
      }}
    >
      <View className="p-5">
        <View className="mt-4 flex-row items-center justify-between">
          <Text className={`text-2xl font-semibold ${titleAlign}`}>{t("header")}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/player/nutrition/NutritionDashboard")}
          >
            <Text className={`text-base font-normal text-[#008C46] underline ${titleAlign}`}>
              {t("show data")}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="mt-5">
          {sections.length > 0 ? (
            sections.map((section) => (
              <View key={section.label} className="mb-5">
                <Text className={`text-xl font-normal mb-2 ${titleAlign}`}>{section.title}</Text>
                <View className="h-[1px] bg-gray-300 w-full" />
                {section.items.map((meal, idx) => (
                  <MealCard
                    key={`${section.label}-${idx}-${meal.food}`}
                    name={meal.food}
                    amount={meal.amount}
                    calories={meal.calories}
                    type={section.mealType}
                  />
                ))}
              </View>
            ))
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
            <Text className="mx-3 text-neutral-600 font-medium text-xl">{t("or")}</Text>
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
            <Ionicons name="add" size={18} color={manualPressed ? "#047857" : "#475569"} />
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

