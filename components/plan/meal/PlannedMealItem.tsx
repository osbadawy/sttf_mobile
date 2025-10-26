import { useLocalization } from "@/contexts/LocalizationContext";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import { Text, TouchableOpacity, View } from "react-native";
import DynamicMealIcon from "./DynamicMealIcon";

interface PlannedMealItemProps {
  meal: GetMealsResponse;
  onPress: (meal: GetMealsResponse) => void;
  isSelected?: boolean;
}

export default function PlannedMealItem({
  meal,
  onPress,
  isSelected = false,
}: PlannedMealItemProps) {
  const { t } = useLocalization("components.plan.meal");

  const date = new Date(meal.start);
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const mealName = meal.name;

  return (
    <View
      key={meal.id}
      className={`bg-white border-2 rounded-[16px] px-[24px] py-[20px] mb-3 flex-row items-center justify-between ${
        isSelected ? "border-primary" : "border-[#B5BCBF]"
      }`}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.5)",
      }}
    >
      <View className="flex-row items-center">
        <DynamicMealIcon
          mealType={meal.category as "breakfast" | "lunch" | "dinner" | "snack"}
        />

        <View className="pl-4">
          <Text className="font-inter-semibold text-base">{mealName}</Text>
          <Text className="effra-regular text-sm" style={{ opacity: 0.6 }}>
            {meal.players_assigned.length} {t("players")} ·{" "}
            {Math.round(meal.amount)}
            {meal.amount_unit === "Na" ? "" : meal.amount_unit} ·{" "}
            {Math.round(meal.kilojoule / 4.184)}kcal
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => onPress(meal)} className="pl-4">
        <Text className="effra-regular text-base underline text-primary">
          {t("edit")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
