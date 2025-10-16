import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import NutritionCamera from "./NutritionCamera";

type MealType = "breakfast" | "lunch" | "snack" | "dinner";

interface MealCardProps {
  name: string;
  amount: string;    // e.g., "230g"
  calories: number;  // e.g., 534
  type?: MealType;
}

export default function MealCard({
  name,
  amount,
  calories,
  type = "lunch",
}: MealCardProps) {
  const iconForType: Record<MealType, keyof typeof Ionicons.glyphMap> = {
    breakfast: "cafe-outline",
    lunch: "fast-food-outline",
    dinner: "fast-food-outline",
    snack: "ice-cream-outline",
  };

  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const toggleOpen = () => {
    if (confirmed) return;
    setOpen((prev) => !prev);
  };

  // Called by NutritionCamera when swipe confirm succeeds
  async function handleConfirm(photoUri: string | null) {
    setConfirmed(true);
    setOpen(false); // close the dropdown
    console.log("Sending image to backend...", { uri: photoUri, meal: name, type });
  }

return (
  <View className="mb-4">
    {/* Header */}
    {confirmed ? (
      <LinearGradient
        colors={["rgba(16,185,129,0.06)", "rgba(16,185,129,0.24)"]} // subtle → richer emerald
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} // left → right
        className="rounded-xl px-3 py-2"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {/* Icon */}
            <View className="rounded-full p-[3px] bg-orange-200/40">
              <View className="size-12 rounded-full items-center justify-center bg-white border border-[#E5E5E5]">
                <Ionicons name={iconForType[type]} size={22} color="#B8B8B8" />
              </View>
            </View>

            {/* Title + details */}
            <View className="mx-4">
              <Text className="text-[16px] font-semibold text-neutral-900">{name}</Text>
              <Text className="text-[14px] text-neutral-600">
                {amount}  •  {calories} kcal
              </Text>
            </View>
          </View>

          {/* Right: check */}
          <Ionicons name="checkmark" size={22} color="#059669" />
        </View>
      </LinearGradient>
    ) : (
      <View className="flex-row items-center justify-between rounded-xl px-3 py-2 bg-transparent">
        <View className="flex-row items-center">
          {/* Icon */}
          <View className="rounded-full p-[3px] bg-orange-200/40">
            <View className="size-12 rounded-full items-center justify-center bg-white border border-[#E5E5E5]">
              <Ionicons name={iconForType[type]} size={22} color="#B8B8B8" />
            </View>
          </View>

          {/* Title + details */}
          <View className="mx-4">
            <Text className="text-[16px] font-semibold text-neutral-900">{name}</Text>
            <Text className="text-[14px] text-neutral-600">
              {amount}  •  {calories} kcal
            </Text>
          </View>
        </View>

        {/* Right: Add */}
        <TouchableOpacity
          onPress={toggleOpen}
          activeOpacity={0.8}
          className="flex-row items-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-[15px] font-medium text-emerald-600">Add</Text>
          <Ionicons
            name={open ? "chevron-down" : "chevron-forward"}
            size={16}
            color="#10B981"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>
    )}

    {/* Simple dropdown (no animation) */}
    {open && !confirmed && (
      <View className="mt-2">
        <NutritionCamera hideSwipePill onConfirm={handleConfirm} />
      </View>
    )}
  </View>
);
}
