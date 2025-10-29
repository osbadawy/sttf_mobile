import DateTimePicker from "@react-native-community/datetimepicker";
import { Modal, Platform, Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  visible: boolean;
  date: Date;
  onChange: (next: Date) => void;
  onClose: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  isRTL: boolean;
};

export default function DatePickerModal({
  title,
  visible,
  date,
  onChange,
  onClose,
  minimumDate,
  maximumDate,
  isRTL,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable className="flex-1 bg-black/30" onPress={onClose}>
        {/* Stop backdrop presses from closing when interacting with the sheet */}
        <Pressable
          className="mt-auto rounded-t-2xl bg-white px-4 pb-6 pt-4"
          onPress={() => {}}
        >
          <Text className="mb-3 text-base font-semibold text-black">
            {title}
          </Text>

          <View className="items-center">
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.select({ ios: "spinner", android: "calendar" })}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              // ✅ Important: handle Android OK / Cancel properly
              onChange={(event, selectedDate) => {
                if (Platform.OS === "android") {
                  if (event.type === "set" && selectedDate) {
                    onChange(selectedDate);
                  }
                  // Close for both OK and Cancel so the user doesn't have to tap again
                  onClose();
                } else {
                  // iOS updates live; user taps "Done" to close
                  if (selectedDate) onChange(selectedDate);
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
                onPress={onClose}
              >
                <Text className="text-white">Done</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
