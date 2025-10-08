import colors from "@/colors.js";
import { Text, TouchableOpacity, View } from "react-native";

interface Item {
  name: string;
  value: string;
}

interface RadioSelectProps {
  items: Item[];
  selectedItem?: Item;
  setSelectedItem: (item: Item) => void;
  selectedColor?: string;
  unselectedColor?: string;
}

export default function RadioSelect({
  items,
  selectedItem,
  setSelectedItem,
  selectedColor = colors.performanceVeryLight,
  unselectedColor = colors.performance,
}: RadioSelectProps) {
  return (
    <View className="flex-row gap-2">
      {items.map((item) => {
        const isSelected = selectedItem?.value === item.value;
        return (
          <TouchableOpacity
            activeOpacity={1}
            className={`flex-row items-center gap-2 bg-white rounded-[24px] px-4 py-2`}
            style={{
              borderColor: isSelected ? selectedColor : "#B0B8B7",
              borderWidth: 1,
              boxShadow: "0px 2px 8px 0px rgba(0, 0, 0, 0.3)",
            }}
            key={item.value}
            onPress={() => setSelectedItem(item)}
          >
            <View
              className={`w-[8px] h-[8px] rounded-full`}
              style={{
                backgroundColor: isSelected ? selectedColor : unselectedColor,
              }}
            />
            <Text
              className={`effra-regular text-base  ${isSelected ? "" : "opacity-50"}`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
