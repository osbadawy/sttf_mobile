import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ClockInvertedIcon } from "./icons";
import DatePickerModal from "./settings/DatePickerModal";

interface DateSelectorProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function DateSelector({
  value,
  onChange,
  placeholder = "End Date",
  disabled = false,
}: DateSelectorProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (selectedDate: Date) => {
    onChange(selectedDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const showDatePicker = () => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  return (
    <View>
      {/* Date Display */}
      <TouchableOpacity
        onPress={showDatePicker}
        disabled={disabled}
        className={`flex-row items-center bg-white rounded-xl px-4 py-4 ${
          disabled ? "opacity-50" : ""
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        {/* Clock Icon */}
        <View className="mr-3">
          <ClockInvertedIcon />
        </View>

        {/* Date Text */}
        <Text className="flex-1 text-base font-inter-medium text-gray-600">
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {/* DatePickerModal */}
      <DatePickerModal
        visible={showPicker}
        date={value || new Date()}
        onChange={handleDateChange}
        onClose={() => setShowPicker(false)}
      />
    </View>
  );
}
