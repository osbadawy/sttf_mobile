import { useState } from "react";
import { Pressable, Text } from "react-native";

type Props = { label: string; isRTL: boolean; onPress: () => void };

export default function SettingsRow({ label, onPress, isRTL }: Props) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      className="flex-row items-center justify-between px-4 py-4"
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        backgroundColor: pressed
          ? "rgba(172, 172, 172, 0.64)"
          : "  rgb(245 245 245)",
      }}
    >
      <Text className="text-black">{label}</Text>
      <Text className="text-neutral-500">›</Text>
    </Pressable>
  );
}
