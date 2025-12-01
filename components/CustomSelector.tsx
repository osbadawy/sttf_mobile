import { Pressable, Text, View } from "react-native";

export type SelectorOption<T = string> = {
  id: T;
  label: string;
};

type CustomSelectorProps<T = string> = {
  options: SelectorOption<T>[];
  value: T;
  onChange: (value: T) => void;
  isRTL?: boolean;
};

export default function CustomSelector<T = string>({
  options,
  value,
  onChange,
  isRTL = false,
}: CustomSelectorProps<T>) {
  const rowDir = isRTL ? "flex-row-reverse" : "flex-row";

  const Seg = ({ option }: { option: SelectorOption<T> }) => {
    const selected = value === option.id;
    return (
      <Pressable
        onPress={() => onChange(option.id)}
        className={[
          "px-5 py-2 rounded-full",
          selected
            ? "bg-white border border-emerald-600"
            : "bg-neutral-100 border border-transparent",
        ].join(" ")}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <Text
          className={
            selected ? "text-black font-medium" : "text-neutral-500 font-medium"
          }
        >
          {option.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      className={[
        "self-center rounded-full p-1 border border-neutral-200/60 bg-white/70",
        "shadow-sm shadow-black/5",
      ].join(" ")}
    >
      <View className={`${rowDir} gap-2 bg-neutral-100 rounded-full `}>
        {options.map((option) => (
          <Seg key={String(option.id)} option={option} />
        ))}
      </View>
    </View>
  );
}

