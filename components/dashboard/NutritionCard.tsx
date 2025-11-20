import NutritionProgress from "@/components/nutrition/NutritionProgress";
import { useLocalization } from "@/contexts/LocalizationContext";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function NutritionCard({
  calories,
  totalCalories,
}: {
  calories: number;
  totalCalories: number;
}) {
  const { t } = useLocalization("components.nutrition.nutritionList");
  const { player } = useLocalSearchParams();
  const [pressed, setPressed] = useState(false);

  return (
    <View className="bg-white mt-20 rounded-2xl p-5 shadow-md overflow-hidden relative">
      {/* Top Row */}
      <View className="flex-row items-center mb-4">
        <Image
          source={require("../../assets/images/leaf.png")}
          className="w-5 h-5 mr-2"
          resizeMode="contain"
        />
        <Text className="text-green-700 font-semibold text-base">
          {t("title")}
        </Text>
        <Text className="ml-auto text-gray-400">{">"}</Text>
      </View>

      {/* Calories + Progress (extracted) */}
      <NutritionProgress consumed={calories} goal={totalCalories} unit="Kcal" />

      {/* Text + Button */}
      <View className="flex-row items-center justify-between mt-6 mb-40">
        <Text className="text-gray-600 w-1/2 text-sm">
          {t("dashboard message")}
        </Text>
        <TouchableOpacity
          className="bg-[#008C46] px-10 py-4 rounded-lg"
          onPress={() =>
            router.push({
              pathname: `player/nutrition` as RelativePathString,
              params: { player: player },
            })
          }
          activeOpacity={1}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          style={{
            zIndex: 10,
            backgroundColor: pressed ? "rgba(0, 140, 70, 0.8)" : "#008C46",
          }}
        >
          <Text className="text-white font-medium text-center">
            {t("view meal plan")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Background */}
      <Image
        source={require("../../assets/images/nutritionCircle.png")}
        className="absolute bottom-0 right-0 w-50 h-100"
        resizeMode="contain"
      />
    </View>
  );
}
