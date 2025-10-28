import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import { Text, View } from "react-native";
import CameraInput from "../nutrition/CameraInput";
import MacroSummaryCards from "../nutrition/MacroSummaryCards";
import DynamicMealIcon from "../plan/meal/DynamicMealIcon";

interface MealModalContentProps {
  meal: GetMealsResponse;
  category: string;
}

export default function MealModalContent({
  meal,
  category,
}: MealModalContentProps) {
  const { t: tMeal } = useLocalization("components.nutrition.nutritionList");
  const { t } = useLocalization("components.dayPlan");

  const subtitle = tMeal(category);
  const title = tMeal(meal.category);
  const icon = (
    <DynamicMealIcon
      mealType={meal.category as "breakfast" | "lunch" | "dinner" | "snack"}
    />
  );
  const color = colors.orange;

  const mealAmountText = meal.amount
    ? `${meal.amount} ${meal.amount_unit == "Na" ? "" : meal.amount_unit}`
    : "";

  const completions = meal.players_assigned[0].completions;
  let start = meal.start;
  if (completions && completions.length > 0) {
    start = completions[0].createdAt;
  }

  return {
    subtitle,
    title,
    icon,
    color,
    contentElement: (
      <View>
        <Text className="text-base effra-regular">
          {Math.round(meal.kilojoule / 4.184)}Kcal · {mealAmountText}
        </Text>

        <View
          className="w-full border-b border-gray-300"
          style={{ marginVertical: 12 }}
        />

        <Text className="text-lg effra-semibold pb-5">
          {t("foodInformation")}
        </Text>
        <MacroSummaryCards
          totalCarbs={Math.round(meal.carbohydrates)}
          totalProteins={Math.round(meal.protein)}
          totalFats={Math.round(meal.fat)}
          carbs={meal.carbohydrates}
          protein={meal.protein}
          fats={meal.fat}
        />

        <View
          className="flex-row items-center justify-center pt-5"
          style={{ gap: 20 }}
        >
          <Text className="text-base effra-regular">{t("takePicture")}</Text>
          <CameraInput
            onImageCapture={(photoUri) => {
              console.log(photoUri);
            }}
          />
        </View>

        <View
          className="w-full border-b border-gray-300"
          style={{ marginTop: 50, marginBottom: 40 }}
        />
      </View>
    ),
    selfAssessmentText: "",
    points: 20,
    startTime: start,
    calories: Math.round(meal.kilojoule / 4.184),
  };
}
