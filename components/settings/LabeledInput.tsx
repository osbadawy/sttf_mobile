import { Text, TextInput, View } from "react-native";

type KeyboardKinds =
  | "default"
  | "email-address"
  | "numeric"
  | "phone-pad"
  | "number-pad"
  | "decimal-pad"
  | "url"
  | "twitter"
  | "web-search"
  | "visible-password"
  | "ascii-capable"
  | "numbers-and-punctuation"
  | "name-phone-pad";

type Props = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardKinds;
  containerClass?: string;
};

export default function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  containerClass = "",
}: Props) {
  return (
    <View className={`flex-1 ${containerClass}`}>
      <Text className="mb-1 text-xs text-neutral-600">{label}</Text>
      <View className="rounded-xl bg-white shadow-sm">
        <TextInput
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-black"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}
