import { useLocalization } from "@/contexts/LocalizationContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  date: Date;
  onChange: (next: Date) => void;
  onClose: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
};

export default function DatePickerModal({
  visible,
  date,
  onChange,
  onClose,
  minimumDate,
  maximumDate,
}: Props) {
  // Track the selected date internally for iOS
  const [selectedDate, setSelectedDate] = useState(date);
  const { t } = useLocalization("common");

  // Reset internal state when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedDate(date);
    }
  }, [visible, date]);

  if (!visible) return null;

  const handleDone = () => {
    onChange(selectedDate);
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
            {t("selectDate")}
          </Text>

          <View className="items-center">
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.select({ ios: "spinner", android: "calendar" })}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              onChange={(event, newDate) => {
                if (Platform.OS === "android") {
                  if (event.type === "set" && newDate) {
                    onChange(newDate);
                  }
                  onClose();
                } else {
                  // iOS: update internal state as user scrolls
                  if (newDate) setSelectedDate(newDate);
                }
              }}
              themeVariant={Platform.OS === "ios" ? "light" : undefined}
            />
          </View>

          {/* iOS explicit Done; on Android we already close in onChange */}
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
