import { Text, TouchableOpacity, View } from "react-native";

export enum ButtonColor {
  primary = "bg-primary",
  activity = "bg-activity",
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
}

export default function Button({
  title,
  onPress,
  color,
  icon,
  size = ButtonSize.lg,
}: ButtonProps) {
  const sizeClass = size === ButtonSize.sm ? "px-6 py-3" : "px-16 py-4";
  const textSizeClass =
    size === ButtonSize.sm ? "text-base" : "text-2xl effra-regular";
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className={`rounded-lg flex-row justify-between items-center ${color} ${sizeClass}`}
    >
      <Text className={`text-white text-center ${textSizeClass}`}>{title}</Text>
      {icon ? <View style={{ paddingLeft: 12 }}>{icon}</View> : null}
    </TouchableOpacity>
  );
}
