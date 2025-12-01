import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import TimePickerModal from "./settings/TimePickerModal";

interface TimePickerProps {
  value: Date | null;
  onChange: (time: Date) => void;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Extract hours and minutes from the current value, ensuring local time
  const currentTime = value || new Date();
  const hours = value ? currentTime.getHours() : 0;
  const minutes = value ? currentTime.getMinutes() : 0;

  const handleTimeChange = (selectedDate: Date) => {
    onChange(selectedDate);
  };

  return (
    <View>
      {/* Time Display */}
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        className="flex-row items-center justify-center space-x-2"
      >
        <View
          className="bg-white w-[32px] h-[36px] items-center justify-center"
          style={{ borderRadius: 4, boxShadow: "0px 2px 4px 0px #00000018" }}
        >
          <Text className="text-base effra-medium text-black">
            {value ? hours.toString().padStart(2, "0") : "--"}
          </Text>
        </View>

        <Text className="text-base effra-medium text-black">:</Text>

        <View
          className="bg-white w-[32px] h-[36px] items-center justify-center"
          style={{ borderRadius: 4, boxShadow: "0px 2px 4px 0px #00000018" }}
        >
          <Text className="text-base effra-medium text-black">
            {value ? minutes.toString().padStart(2, "0") : "--"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* iOS: Use TimePickerModal */}
      {Platform.OS === "ios" && (
        <TimePickerModal
          visible={showPicker}
          time={currentTime}
          onChange={handleTimeChange}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Android: Use DateTimePicker directly */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={currentTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            setShowPicker(false);
            if (event.type === "set" && selectedTime) {
              handleTimeChange(selectedTime);
            }
          }}
        />
      )}
    </View>
  );
}
