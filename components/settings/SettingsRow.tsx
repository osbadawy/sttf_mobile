import { Pressable, Text } from "react-native";

type Props = { label: string; onPress: () => void };

export default function SettingsRow({ label, onPress }: Props) {
  return (
    <Pressable
      className="flex-row items-center justify-between px-4 py-4"
      onPress={onPress}
    >
      <Text className="text-black">{label}</Text>
      <Text className="text-neutral-500">›</Text>
    </Pressable>
  );
}
