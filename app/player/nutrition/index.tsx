import MealCard from "@/components/nutrition/MealCard";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useLocalSearchParams } from "expo-router";
import { Key, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MealLogPage() {
  const { t, isRTL } = useLocalization("components.nutrition.nutritionList");

  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  const [meals, setMeals] = useState<any[]>([]);
  const [mealFilters, setMealFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showNewMealDropdown, setShowNewMealDropdown] = useState(false);

  useEffect(() => {
    const fetchMeals = async () => {
      const data = [
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

  const groupedMeals = meals.reduce((acc: any, meal: any) => {
    const { meal_type, food, calories, amount } = meal;
    if (!acc[meal_type]) acc[meal_type] = [];
    acc[meal_type].push({ food, calories, amount });
    return acc;
  }, {});

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
            <Text className={`text-base font-normal text-[#008C46] underline ${titleAlign}`}>{t("show data")}</Text>
        </View>

        <ScrollView className="mt-5">
          {["Breakfast", "Lunch", "Dinner", "Snacks"].map((mealType) => (
            <View key={mealType} className="mb-5">
              <Text className={`text-xl font-normal mb-2 ${titleAlign}`}>{mealType}</Text>
               <View className="h-[1px] bg-gray-300 w-full mb-3" />
              {groupedMeals[mealType]?.map(
                (
                  meal: { food: string; amount: string; calories: number },
                  index: Key | null | undefined
                ) => (
                  <MealCard
                    key={index}
                    name={meal.food}
                    amount={meal.amount}
                    calories={meal.calories}
                  />
                )
              )}
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity className="mt-5" onPress={() => setShowFilterDropdown(true)}>
          <Text className={`text-base ${titleAlign}`}>{t("filterMeals")}</Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}
