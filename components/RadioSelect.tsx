import { Text, TouchableOpacity, View } from "react-native";

interface Item {
  name: string;
  value: string;
}

interface RadioSelectProps {
  items: Item[];
  selectedItem?: Item;
  setSelectedItem: (item: Item) => void;
}

export default function RadioSelect({
  items,
  selectedItem,
  setSelectedItem,
}: RadioSelectProps) {
  return (
    <View className="flex-row gap-2">
      {items.map((item) => {
        const isSelected = selectedItem?.value === item.value;
        return (
          <TouchableOpacity
            activeOpacity={1}
            className={`flex-row items-center gap-2 bg-white rounded-[24px] px-4 py-2 border-2 ${isSelected ? "border-lightGreen" : "border-gray-200"}`}
            key={item.value}
            onPress={() => setSelectedItem(item)}
          >
            <View
              className={`w-[8px] h-[8px] rounded-full ${isSelected ? "bg-lightGreen" : "bg-primary"}`}
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
