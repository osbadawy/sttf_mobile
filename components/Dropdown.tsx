import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Arrow, CheckIcon } from "./icons";

interface Item {
  name: string;
  value: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  items: Item[];
  selectedItem?: Item;
  setSelectedItem: (item: Item) => void;
  placeholder?: string;
  placeholderIcon?: React.ReactNode;
}

export default function Dropdown({
  items,
  selectedItem,
  setSelectedItem,
  placeholder,
  placeholderIcon,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  return (
    <View className="relative">
      <TouchableOpacity
        className={`flex-row items-center justify-between rounded-3xl bg-white px-8 py-4 ${selectedItem ? "border-2 border-primary" : ""}`}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
        style={{ boxShadow: "0px 2px 4px 0px #00000018" }}
      >
        {selectedItem ? (
          <View className="flex-row items-center">
            {selectedItem.icon && (
              <View className="mr-3">{selectedItem.icon}</View>
            )}
            <Text className="effra-regular text-base">
              {selectedItem?.name}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center">
            {placeholderIcon && <View className="mr-3">{placeholderIcon}</View>}
            {placeholder && (
              <Text className="effra-regular text-base opacity-50">
                {placeholder}
              </Text>
            )}
          </View>
        )}
        <Arrow direction={isOpen ? "up" : "down"} />
      </TouchableOpacity>

      {isOpen && (
        <View
          className="absolute top-full left-0 right-0 mt-2 z-10 rounded-3xl bg-white"
          style={{ boxShadow: "0px 2px 4px 0px #00000018" }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.value}
                className={`flex-row items-center px-8 py-4 ${
                  index !== items.length - 1 ? "border-b border-gray-100" : ""
                }`}
                onPress={() => handleItemSelect(item)}
                activeOpacity={0.7}
              >
                {item.icon && <View className="mr-3">{item.icon}</View>}
                <Text className="effra-regular text-base flex-1">
                  {item.name}
                </Text>
                {selectedItem?.value === item.value && (
                  <CheckIcon style={{ scale: 0.75 }} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
