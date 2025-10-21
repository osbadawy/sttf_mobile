// components/nutrition/NutritionProgress.tsx
import { Text, View } from "react-native";

type Props = {
  consumed: number; // e.g., 924
  goal: number; // e.g., 2802
  unit?: string; // e.g., "Kcal" (default)
  barColor?: string; // progress color (default green)
  backgroundColor?: string; // track color
};

export default function NutritionProgress({
  consumed,
  goal,
  unit = "Kcal",
  barColor = "#16A34A", // tailwind bg-green-600
  backgroundColor = "#E5E7EB", // tailwind bg-gray-200
}: Props) {
  const progress = Math.max(0, Math.min(1, goal ? consumed / goal : 0));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(progress * 100), min: 0, max: 100 }}
    >
      {/* Values row */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-3xl font-bold">
          {consumed} <Text className="text-base font-normal">{unit}</Text>
        </Text>
        <Text className="text-gray-500">
          {goal} {unit}
        </Text>
      </View>

      {/* Progress bar */}
      <View
        className="w-full h-1.5 rounded-full mb-4"
        style={{ backgroundColor }}
      >
        <View
          className="h-1.5 rounded-full"
          style={{ width: `${progress * 100}%`, backgroundColor: barColor }}
        />
      </View>
    </View>
  );
}
