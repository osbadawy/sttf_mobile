import { useLocalization } from "@/contexts/LocalizationContext";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CheckIcon } from "./icons";
import Modal from "./Modal";

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
  checkMark?: boolean;
  showIcons?: boolean;
  customOnPress?: (item: Item) => void;
  showClearButton?: boolean;
  outerColor?: string;
}

interface ModalItemProps {
  item: Item;
  isSelected: boolean;
  onPress: () => void;
  showIcons: boolean;
  isRTL: boolean;
  isFirstItem?: boolean;
}

export function ModalItem({
  item,
  isSelected,
  onPress,
  showIcons,
  isRTL,
  isFirstItem = false,
}: ModalItemProps) {
  return (
    <TouchableOpacity
      key={item.value}
      onPress={onPress}
      className={`border-b border-gray-200 h-[56px] items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      style={{ borderTopWidth: isFirstItem ? 1 : 0 }}
      activeOpacity={0.9}
    >
      <View className="flex-row items-center" style={{ gap: 10 }}>
        {showIcons && (
          <View className="w-10 h-7 items-center justify-center">
            {item.icon}
          </View>
        )}
        <Text>{item.name}</Text>
      </View>
      {isSelected && <CheckIcon fill={"#000"} />}
    </TouchableOpacity>
  );
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
  outerColor,
}: SelectionModalProps) {
  const { isRTL } = useLocalization();

  return (
    <Modal
      onClose={() => setShowSelectionModal(false)}
      outterColor={outerColor}
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
            <ModalItem
              key={item.value}
              item={item}
              isSelected={isSelected}
              onPress={onPress}
              showIcons={showIcons}
              isRTL={isRTL}
            />
          );
        })}
      </ScrollView>
    </Modal>
  );
}
