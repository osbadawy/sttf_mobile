import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  visible: boolean;
  time: Date;
  onChange: (next: Date) => void;
  onClose: () => void;
  isRTL?: boolean;
};

export default function TimePickerModal({
  title,
  visible,
  time,
  onChange,
  onClose,
  isRTL = false,
}: Props) {
  // Track the selected time internally for iOS
  const [selectedTime, setSelectedTime] = useState(time);

  // Reset internal state when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedTime(time);
    }
  }, [visible, time]);

  if (!visible) return null;

  const handleDone = () => {
    onChange(selectedTime);
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
            {title}
          </Text>

          <View className="items-center">
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display={Platform.select({ ios: "spinner", android: "default" })}
              onChange={(event, newTime) => {
                if (Platform.OS === "android") {
                  if (event.type === "set" && newTime) {
                    onChange(newTime);
                  }
                  onClose();
                } else {
                  // iOS: update internal state as user scrolls
                  if (newTime) setSelectedTime(newTime);
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
                <Text className="text-white">Done</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

