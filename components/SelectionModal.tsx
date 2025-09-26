import { useLocalization } from "@/contexts/LocalizationContext";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CheckIcon } from "./icons";

interface Item {
  name: string;
  value: string;
  icon?: React.ReactNode;
}

interface SelectionModalProps {
  title: string;
  uniqueItems: Item[];
  selectedItems?: string[];
  setSelectedItems?: (selectedItems: string[]) => void;
  setShowSelectionModal: (showSelectionModal: boolean) => void;
  checkMark?: React.ReactNode;
  showIcons?: boolean;
  customOnPress?: (item: Item) => void;
  showClearButton?: boolean;
}

export default function SelectionModal({
  title,
  uniqueItems,
  selectedItems = [],
  setSelectedItems = () => {},
  setShowSelectionModal,
  checkMark = true,
  showIcons = true,
  customOnPress,
  showClearButton = true,
}: SelectionModalProps) {
  const { isRTL } = useLocalization();

  return (
    <TouchableOpacity
      className="bg-transparent w-screen h-screen absolute z-100 bottom-0"
      onPress={() => setShowSelectionModal(false)}
    >
      <View
        className="bg-white absolute bottom-0 w-screen rounded-3xl px-12 pt-2 pb-12"
        style={{
          maxHeight: "70%",
        }}
      >
        <View
          className={`items-center justify-between py-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          <Text className="font-inter-regular text-base">{title}</Text>
          {showClearButton && (
            <TouchableOpacity onPress={() => setSelectedItems([])}>
            <Text className="font-inter-regular text-base underline">
                clear
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="w-full h-0 border-b border-gray-200" />
        <ScrollView>
          {uniqueItems.map((item) => {
            const isSelected = selectedItems.includes(item.value);
            const onPress = () => {
              if (customOnPress) {
                customOnPress(item);
                return;
              }
              if (isSelected) {
                setSelectedItems(
                  selectedItems.filter(
                    (selectedItem) => selectedItem !== item.value,
                  ),
                );
              } else {
                setSelectedItems([...selectedItems, item.value]);
              }
            };
            return (
              <TouchableOpacity
                key={item.value}
                onPress={onPress}
                className={`border-b border-gray-200 h-[56px] items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}
              >
                <View className="flex-row items-center" style={{ gap: 10 }}>
                  {showIcons && (
                    <View className="w-10 h-7 items-center justify-center">
                      {item.icon}
                    </View>
                  )}
                  <Text>{item.name}</Text>
                </View>
                {isSelected && <CheckIcon />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
}
