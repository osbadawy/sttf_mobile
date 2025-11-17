import colors from "@/colors";
import CustomButton, { ButtonColor } from "@/components/Button";
import DateSelector from "@/components/DateSelector";
import {
  Arrow,
  ProfilePictureDefaultIcon,
  TrashIcon,
} from "@/components/icons";
import NutritionDataInput from "@/components/nutrition/NutritionDataInput";
import DynamicMealIcon from "@/components/plan/meal/DynamicMealIcon";
import CustomSwitch from "@/components/Switch";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import Constants from "expo-constants";
import { User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

interface CreateMealMainProps {
  players: string[];
  t: (key: string) => string;
  category: "breakfast" | "lunch" | "dinner" | "snack";
  setCategory: (
    category: "breakfast" | "lunch" | "dinner" | "snack" | null,
  ) => void;
  onClose: () => void;
  user: User | null;
  onMealCreated?: () => void;
  date: Date;
  onOpenPlayersSelection: () => void;
  editingMeal?: GetMealsResponse | null; // Meal being edited
  originalPlayers?: string[]; // Original players for deletion
  onDeleteMeal?: (meal: GetMealsResponse) => void;
  clearCacheForRecurringDays: (
    startDate: Date,
    endDate: Date,
    recurringDays: string[],
    users?: string[],
  ) => void;
}

export default function CreateMealMain({
  date,
  players,
  t,
  category,
  setCategory,
  onClose,
  user,
  onMealCreated,
  onOpenPlayersSelection,
  editingMeal,
  originalPlayers = [],
  onDeleteMeal,
  clearCacheForRecurringDays,
}: CreateMealMainProps) {
  const [mealName, setMealName] = useState(editingMeal ? editingMeal.name : "");
  const [nutritionData, setNutritionData] = useState({
    calories: editingMeal ? editingMeal.kilojoule / 4.184 : undefined, // Convert kJ to kcal
    carbs: editingMeal ? editingMeal.carbohydrates : undefined,
    protein: editingMeal ? editingMeal.protein : undefined,
    fat: editingMeal ? editingMeal.fat : undefined,
    amount: editingMeal ? editingMeal.amount : undefined,
    amount_unit: editingMeal ? editingMeal.amount_unit : "Na",
  });
  const [isPlanned, setIsPlanned] = useState(
    editingMeal ? editingMeal.is_planned : true,
  );
  const [isRecurring, setIsRecurring] = useState(
    editingMeal ? editingMeal.recurrence_patterns.length > 0 : false,
  );
  const [recurranceEndDate, setRecurranceEndDate] = useState<Date | null>(
    editingMeal && editingMeal.recurrence_patterns.length > 0
      ? new Date(editingMeal.recurrence_patterns[0].end)
      : null,
  );
  const [disabled, setDisabled] = useState<boolean>(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isButtonDisabled =
    disabled ||
    mealName === "" ||
    nutritionData.amount === undefined ||
    nutritionData.calories === undefined ||
    nutritionData.protein === undefined ||
    nutritionData.carbs === undefined ||
    nutritionData.fat === undefined;

  const recurranceDaysOptions = [
    { label: "Mo", value: "mon" },
    { label: "Tu", value: "tue" },
    { label: "We", value: "wed" },
    { label: "Th", value: "thu" },
    { label: "Fr", value: "fri" },
    { label: "Sa", value: "sat" },
    { label: "Su", value: "sun" },
  ];
  const [recurranceDays, setRecurranceDays] = useState<string[]>(
    editingMeal && editingMeal.recurrence_patterns.length > 0
      ? (() => {
          const pattern = editingMeal.recurrence_patterns[0];
          const days: string[] = [];
          if (pattern.sun) days.push("sun");
          if (pattern.mon) days.push("mon");
          if (pattern.tue) days.push("tue");
          if (pattern.wed) days.push("wed");
          if (pattern.thu) days.push("thu");
          if (pattern.fri) days.push("fri");
          if (pattern.sat) days.push("sat");
          return days;
        })()
      : [],
  );

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      setDisabled(true);
      const isEditing = !!editingMeal;

      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/meal`;

      // Handle meal removals for editing
      if (isEditing) {
        // Find players that were removed
        const removedPlayers = originalPlayers.filter(
          (playerId) => !players.includes(playerId),
        );

        // Make a single DELETE request for all removed players
        if (removedPlayers.length > 0) {
          await deleteMeal(editingMeal.id, removedPlayers, user);
        }
      }

      const start = new Date(date);
      if (category === "breakfast") {
        start.setHours(6, 0, 0, 0);
      } else if (category === "lunch") {
        start.setHours(11, 0, 0, 0);
      } else if (category === "dinner") {
        start.setHours(7, 0, 0, 0);
      } else if (category === "snack") {
        start.setHours(0, 0, 0, 0);
      }

      const body: any = {
        users_assigned: players,
        start: start,
        category: category,
        name: mealName,
        kilojoule: nutritionData.calories! * 4.184, // Convert kcal to kJ
        protein: nutritionData.protein!,
        carbohydrates: nutritionData.carbs!,
        fat: nutritionData.fat!,
        is_planned: isPlanned,
        amount: nutritionData.amount,
        amount_unit: nutritionData.amount_unit,
      };

      if (isEditing) {
        body.id = editingMeal.id;
        body.day = date;
      }

      if (isRecurring && recurranceDays.length > 0) {
        body.recurrance = {
          start: start,
          recurring_days: recurranceDays,
        };

        if (recurranceEndDate) {
          body.recurrance.end = recurranceEndDate;
        }
      }

      const token = await user.getIdToken();

      const response = await fetch(url, {
        method: editingMeal ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(
          `Failed to ${editingMeal ? "update" : "create"} meal: ${errorData.message}`,
        );
      }

      // Notify parent that meal was created (sets flag for refetch on close)
      // Parent will clear entire cache to handle recurring meals
      onMealCreated?.();

      // Show success alert
      Alert.alert(
        "Success",
        `Meal ${editingMeal ? "updated" : "created"} successfully`,
      );

      // Close modal - parent will handle refetch via useEffect
      onClose();
    } catch (error) {
      console.error("Error saving meal", error);
      // Only show error alert if component is still mounted
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          `Failed to ${editingMeal ? "update" : "create"} meal`,
        );
      }
    } finally {
      if (isMountedRef.current) {
        setDisabled(false);
      }
    }
  };

  // Helper function to delete player assignments
  async function deleteMeal(mealId: string, playerIds: string[], user: any) {
    const deleteUrl = `${Constants.expoConfig?.extra?.BACKEND_URL}/meal`;
    const deleteBody = {
      id: mealId,
      users_assigned: playerIds,
      day: date,
    };

    const token = await user.getIdToken();
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error deleting player assignments:", errorData);
      throw new Error(`Failed to remove players: ${errorData.message}`);
    }
  }

  return (
    <View>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200">
        <Text className="font-inter-regular text-base pb-2 pt-[24px]">
          {t("mealSelectionTitle")}
        </Text>
        {editingMeal && (
          <TouchableOpacity onPress={() => onDeleteMeal?.(editingMeal!)}>
            <TrashIcon />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Selection */}
      <View className="flex-row items-center justify-between border-b border-gray-200 h-[56px]">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <DynamicMealIcon mealType={category} />
          <Text className="effra-medium text-base">{t(category)}</Text>
        </View>
        <TouchableOpacity onPress={() => setCategory(null)}>
          <Text className="effra-regular underline text-base text-primary">
            {t("edit")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Players Selection */}
      <View className="flex-row items-center justify-between border-b border-gray-200 h-[56px]">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <ProfilePictureDefaultIcon fill={"black"} />
          <Text className="effra-medium text-base">{t("players")}</Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center"
          style={{ gap: 4 }}
          onPress={onOpenPlayersSelection}
        >
          <Text className="effra-regular text-base" style={{ opacity: 0.6 }}>
            {players.length} {t("players")}
          </Text>
          <Arrow />
        </TouchableOpacity>
      </View>

      {/* Recurring Selection */}
      <View className="border-b border-gray-200">
        <View className="flex-row items-center justify-between h-[56px]">
          <Text className="effra-medium text-base">{t("recurring")}</Text>
          <CustomSwitch
            value={isRecurring}
            onValueChange={(v) => {
              if (!v) {
                setRecurranceDays([]); // reset the recurrance days
              }
              setIsRecurring(v);
            }}
          />
        </View>

        {isRecurring && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row items-center" style={{ gap: 12 }}>
                <TouchableHighlight
                  underlayColor={colors.primaryLight}
                  onPress={() => {
                    setRecurranceDays(
                      recurranceDaysOptions.map((option) => option.value),
                    );
                  }}
                  className="px-6 py-2 bg-white rounded-lg"
                >
                  <Text className="effra-medium text-base">
                    {t("everyDay")}
                  </Text>
                </TouchableHighlight>

                {recurranceDaysOptions.map(({ label, value }) => {
                  const isSelected = recurranceDays.includes(value);
                  return (
                    <TouchableHighlight
                      underlayColor={colors.primaryLight}
                      key={value}
                      onPress={() => {
                        if (isSelected) {
                          setRecurranceDays(
                            recurranceDays.filter((d) => d !== value),
                          );
                        } else {
                          setRecurranceDays([...recurranceDays, value]);
                        }
                      }}
                      className={`items-center justify-center rounded-lg ${isSelected ? "bg-primary" : "bg-white"}`}
                      style={{
                        width: 36,
                        height: 36,
                      }}
                    >
                      <Text
                        className={`effra-medium text-base ${isSelected ? "text-white" : "text-primary"}`}
                      >
                        {label}
                      </Text>
                    </TouchableHighlight>
                  );
                })}
              </View>
            </ScrollView>
            <View style={{ paddingVertical: 24 }}>
              <DateSelector
                value={recurranceEndDate}
                onChange={setRecurranceEndDate}
              />
            </View>
          </View>
        )}
      </View>

      {/* Meal Card */}
      <View className="bg-[#F8F9F2] rounded-2xl mb-6 py-4" style={{ gap: 8 }}>
        {/* Meal Name */}
        <View
          className="bg-white rounded-xl border border-[#E8E8E8] px-4 h-[48px]"
          style={{ flex: 1 }}
        >
          <TextInput
            className="text-base effra-regular"
            placeholder={t("name")}
            value={mealName}
            onChangeText={setMealName}
          />
        </View>

        {/* Nutrition Data Input */}
        <NutritionDataInput
          value={nutritionData}
          onChange={(data) =>
            setNutritionData({
              carbs: data.carbs,
              protein: data.protein,
              fat: data.fat,
              calories: data.calories,
              amount: data.amount,
              amount_unit: data.amount_unit || "Na",
            })
          }
        />
      </View>

      {/* Save Button */}
      <CustomButton
        title={editingMeal ? t("save") : t("add")}
        onPress={handleSave}
        color={isButtonDisabled ? ButtonColor.disabled : ButtonColor.primary}
        disabled={isButtonDisabled}
      />
    </View>
  );
}
