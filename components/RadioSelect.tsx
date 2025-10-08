import { Text, TouchableOpacity, View } from "react-native";

interface Item {
  name: string;
  value: string;
}

interface RadioSelectProps {
  items: Item[];
  selectedItem?: Item;
  setSelectedItem: (item: Item) => void;
  p1Color: string;
  p2Color: string;
}

export default function RadioSelect({
  items,
  selectedItem,
  setSelectedItem,
  p1Color,
  p2Color,
}: RadioSelectProps) {
  return (
    <View className="flex-row gap-2">
      {items.map((item, index) => {
        const isSelected = selectedItem?.value === item.value;
        const color = index === 0 ? p1Color : p2Color;
        return (
          <TouchableOpacity
            activeOpacity={1}
            className={`flex-row items-center gap-2 bg-white rounded-[24px] px-4 py-2`}
            style={{
              borderColor: isSelected ? color : "#B0B8B7",
              borderWidth: 1,
              boxShadow: "0px 2px 8px 0px rgba(0, 0, 0, 0.3)",
            }}
            key={item.value}
            onPress={() => setSelectedItem(item)}
          >
            <View
              className={`w-[8px] h-[8px] rounded-full`}
              style={{
                backgroundColor: color,
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
