import { Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  valueLabel: string;
  onPress: () => void;
  isRTL: boolean;
};

export default function SelectField({ label, valueLabel, onPress, isRTL }: Props) {
  return (
    <View className="mt-3">
      <Text className="mb-1 text-xs text-neutral-600">{label}</Text>
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3"
      >
        <Text className="text-black">{valueLabel}</Text>
        <Text className="text-neutral-500">▾</Text>
      </Pressable>
    </View>
  );
}
