import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import { uploadToFirebase } from "@/utils/uploadToFirebase";
import Constants from "expo-constants";
import { User } from "firebase/auth";
import { Alert, Text, View } from "react-native";
import CameraInput from "../nutrition/CameraInput";
import MacroSummaryCards from "../nutrition/MacroSummaryCards";
import DynamicMealIcon from "../plan/meal/DynamicMealIcon";

interface MealModalContentProps {
  meal: GetMealsResponse;
  category: string;
  onImageCapture?: (photoUri: string | null) => void;
  user: User | null;
  imageUrl: string | null;
  onClose: () => void;
  onRefetch: () => void;
}

export default function MealModalContent({
  meal,
  category,
  onImageCapture,
  user,
  imageUrl,
  onClose,
  onRefetch,
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

  const handleComplete = async () => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return false;
    }

    try {
      let uploadedImageUrl: string | null = null;

      // Upload image to Firebase Storage if imageUrl exists
      if (imageUrl) {
        try {
          uploadedImageUrl = await uploadToFirebase({
            folderName: "sttf/nutrition",
            id: user.uid,
            includeDate: true,
            imageUri: imageUrl,
          });
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          Alert.alert(
            "Warning",
            "Failed to upload image, but continuing with meal completion.",
          );
          return false;
        }
      }

      const token = await user.getIdToken();
      const backendUrl = Constants.expoConfig?.extra?.BACKEND_URL;
      const url = `${backendUrl}/meal/complete`;
      const body = {
        id: meal.id,
        img_url: uploadedImageUrl,
      };

      const apiResponse = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error("API Error:", {
          status: apiResponse.status,
          statusText: apiResponse.statusText,
          error: errorData,
        });
        throw new Error(`Failed to complete meal: ${errorData.message}`);
      }

      Alert.alert("Success", "Meal completed successfully!");
      onClose();
      onRefetch();
      return true;
    } catch (error) {
      console.error("Error completing meal:", error);
      Alert.alert("Error", "Failed to complete meal. Please try again.");
      return false;
    }
  };

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
              if (onImageCapture) {
                onImageCapture(photoUri);
              }
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
    onComplete: handleComplete,
  };
}
