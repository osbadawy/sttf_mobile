import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export enum ButtonColor {
  primary = "bg-primary",
  red = "bg-red",
  disabled = "bg-white border border-primary",
}

export enum ButtonSize {
  sm,
  lg,
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  color: ButtonColor;
  icon?: React.ReactNode;
  size?: ButtonSize;
  disabled?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  color,
  icon,
  size = ButtonSize.lg,
  disabled = false,
}: ButtonProps) {
  const sizeClass = size === ButtonSize.sm ? "px-6 py-3" : "px-16 py-4";
  const textSizeClass =
    size === ButtonSize.sm ? "text-base" : "text-2xl effra-regular";
  const [pressed, setPressed] = useState(false);

  const textColorClass =
    color === ButtonColor.disabled ? "text-black" : "text-white";
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      className={`flex-row items-center ${icon ? "justify-between" : "justify-center"} ${disabled ? "bg-gray-300" : color} ${sizeClass}`}
      style={{ borderRadius: 8, transform: [{ scale: pressed ? 0.97 : 1 }] }}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <Text className={`${textColorClass} text-center ${textSizeClass}`}>
        {title}
      </Text>
      {icon ? <View style={{ paddingLeft: 12 }}>{icon}</View> : null}
    </TouchableOpacity>
  );
}
