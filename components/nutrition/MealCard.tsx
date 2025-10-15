import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type MealType = "breakfast" | "lunch" | "snack" | "dinner" ;

interface MealCardProps {
  name: string;
  amount: string;         // e.g., "230g"
  calories: number;       // e.g., 534
  type?: MealType;        // "breakfast" | "meal" | "snack"
  onAddPress?: () => void;
}

export default function MealCard({
  name,
  amount,
  calories,
  type = "lunch",
  onAddPress,
}: MealCardProps) {
  const iconForType: Record<MealType, keyof typeof Ionicons.glyphMap> = {
    breakfast: "cafe-outline",   // steaming cup
    lunch: "fast-food-outline", 
    dinner: "fast-food-outline",   
    snack: "ice-cream-outline",  // snacky vibe
  };

  return (
    <View className="mb-4">
      {/* Top row: icon + title on left, Add on right */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {/* soft glow ring */}
          <View className="rounded-full p-[3px] bg-orange-200/40">
            {/* inner circle */}
            <View className="size-12 rounded-full items-center justify-center bg-white border border-orange-100">
              <Ionicons
                name={iconForType[type]}
                size={22}
                color="#B8B8B8"
              />
            </View>
          </View>

          {/* title */}
          <Text className="ml-3 text-[16px] font-semibold text-neutral-900">
            {name}
          </Text>
        </View>

        {/* Add action */}
        <TouchableOpacity
          onPress={onAddPress}
          className="flex-row items-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-[15px] font-medium text-orange-500">Add</Text>
          <Ionicons name="chevron-down" size={16} color="#F97316" className="ml-1" />
        </TouchableOpacity>
      </View>

      {/* details line */}
      <Text className="mt-1.5 ml-[58px] text-[14px] text-neutral-600">
        {amount}  •  {calories} kcal
      </Text>
    </View>
  );
}

