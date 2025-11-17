import { HeaderColor } from "@/schemas/components/HeaderTypes";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Arrow } from "./icons";

interface DateSelectorProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  color?: HeaderColor;
  disableFutureDates?: boolean;
}

export default function HeaderDateSelector({
  selectedDate = new Date(),
  onDateSelect,
  color = HeaderColor.BG,
  disableFutureDates = true,
}: DateSelectorProps) {
  const [currentWeek, setCurrentWeek] = useState(selectedDate);

  const textColor = color === HeaderColor.primary ? "text-white" : "text-black";
  const arrowColor = color === HeaderColor.primary ? "white" : "#9D9D9D";

  // Get the start of the week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Get all days in the current week
  const getWeekDays = (weekStart: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekStart = getWeekStart(currentWeek);
  const weekDays = getWeekDays(weekStart);

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    return date > today;
  };

  const handleDatePress = (date: Date) => {
    if (!disableFutureDates || !isFutureDate(date)) {
      onDateSelect?.(date);
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  // Check if current week is the latest week (current week)
  const isCurrentWeek = () => {
    const today = new Date();
    const currentWeekStart = getWeekStart(today);
    const displayedWeekStart = getWeekStart(currentWeek);
    return (
      currentWeekStart.setHours(0, 0, 0, 0) ===
      displayedWeekStart.setHours(0, 0, 0, 0)
    );
  };
  return (
    <View className={`flex-row items-center justify-between py-4 `}>
      {/* Previous week arrow */}
      <TouchableOpacity
        onPress={() => navigateWeek("prev")}
        activeOpacity={1}
        className="w-8 h-8 items-center justify-center"
      >
        <Arrow direction="left" stroke={arrowColor} strokeWidth={1} />
      </TouchableOpacity>

      {/* Week days */}
      <View className="flex-row flex-1 justify-between items-center space-x-2">
        {weekDays.map((date, index) => {
          const isSelected = isSelectedDate(date);
          const isFuture = isFutureDate(date);
          const dayNumber = date.getDate().toString().padStart(2, "0");
          const isDisabled = disableFutureDates && isFuture;

          return (
            <View key={index} className="items-center">
              {/* Day label */}
              <Text
                className={`effra-light text-base ${textColor} mb-3`}
                style={{ opacity: isDisabled ? 0.3 : 0.8 }}
              >
                {dayLabels[index]}
              </Text>

              {/* Date circle */}
              <TouchableOpacity
                onPress={() => handleDatePress(date)}
                disabled={isDisabled}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isSelected
                    ? "bg-primaryVeryDark shadow-lg"
                    : isDisabled
                      ? "bg-gray-300"
                      : "bg-white"
                }`}
                style={{
                  shadowColor: isSelected ? "#000" : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.25 : 0,
                  shadowRadius: isSelected ? 4 : 0,
                  elevation: isSelected ? 4 : 0,
                }}
              >
                <Text
                  className={`effra-redular text-base ${
                    isSelected
                      ? "text-white"
                      : isDisabled
                        ? "text-gray-500"
                        : "text-black"
                  }`}
                  style={{ opacity: isSelected ? 1 : isDisabled ? 0.5 : 0.6 }}
                >
                  {dayNumber}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Next week arrow - only show if not on current week */}
      {disableFutureDates && isCurrentWeek() ? (
        <View className="w-8 h-8" />
      ) : (
        <TouchableOpacity
          onPress={() => navigateWeek("next")}
          activeOpacity={1}
          className="w-8 h-8 items-center justify-center"
        >
          <Arrow direction="right" stroke={arrowColor} strokeWidth={1} />
        </TouchableOpacity>
      )}
    </View>
  );
}
