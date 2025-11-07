import { useLocalization } from "@/contexts/LocalizationContext";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";

type PickerItem = {
  label: string;
  value: string | number;
};

type Props = {
  visible: boolean;
  selectedValue: string | number;
  items: PickerItem[];
  onChange: (value: string | number) => void;
  onClose: () => void;
  mode?: "dropdown" | "dialog";
};

export default function PickerModal({
  visible,
  selectedValue,
  items,
  onChange,
  onClose,
  mode = "dropdown",
}: Props) {
  // Track the selected value internally for iOS
  const [selected, setSelected] = useState(selectedValue);
  const { t } = useLocalization("common");

  // Reset internal state when modal opens
  useEffect(() => {
    if (visible) {
      setSelected(selectedValue);
    }
  }, [visible, selectedValue]);

  if (!visible) return null;

  const handleDone = () => {
    onChange(selected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="bg-transparent w-screen h-screen absolute bottom-0">
        {/* Backdrop without close functionality */}
        <View className="flex-1 bg-black/30" />
        
        {/* Content Sheet */}
        <View
          className="absolute bottom-0 w-screen px-12 pt-2 pb-12 bg-white"
          style={{
            maxHeight: "70%",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        >
          <Text className="mb-3 text-base font-semibold text-black">
            {t("selectOption")}
          </Text>

          <View className="items-center">
            <Picker
              selectedValue={selected}
              onValueChange={(value) => {
                if (Platform.OS === "android") {
                  onChange(value);
                  onClose();
                } else {
                  // iOS: update internal state as user scrolls
                  setSelected(value);
                }
              }}
              mode={mode}
              style={{ width: "100%" }}
            >
              {items.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>

          {/* iOS explicit Done; on Android we already close in onValueChange */}
          {Platform.OS === "ios" && (
            <View className="mt-4 flex-row justify-end">
              <Pressable
                className="rounded-xl bg-neutral-900 px-4 py-2"
                onPress={handleDone}
              >
                <Text className="text-white">{t("done")}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
