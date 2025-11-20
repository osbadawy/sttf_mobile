import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CountryFlag from "react-native-country-flag";

interface ChangeLanguageProps {
  isRTL: boolean;
  label: string;
  onPress: () => void;
}

export default function ChangeLanguage({
  isRTL,
  label,
  onPress,
}: ChangeLanguageProps) {
  const isoCode = isRTL ? "sa" : "gb";
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between px-4 py-4"
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        backgroundColor: pressed
          ? "rgba(172, 172, 172, 0.64)"
          : "  rgb(245 245 245)",
      }}
    >
      {/* Left side label */}
      <Text className="text-base text-black">{label}</Text>

      {/* Right side: current language indicator */}
      <View className="flex-row items-center gap-2">
        <CountryFlag isoCode={isoCode} size={18} />
        <Text className="text-neutral-500">›</Text>
      </View>
    </TouchableOpacity>
  );
}
