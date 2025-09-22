import { Text, TouchableOpacity } from "react-native";

export enum ButtonColor {
  primary="bg-primary",
}


interface ButtonProps {
  title: string;
  onPress: () => void;
  color: ButtonColor;
}

export default function Button({ title, onPress, color }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} className={`px-16 rounded-lg ${color}`}>
      <Text className="text-white text-center text-2xl effra-regular p-4">{title}</Text>
    </TouchableOpacity>
  );
}