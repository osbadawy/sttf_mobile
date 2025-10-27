import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export type FAQEntry = {
  id: string;
  question: string;
  answer: string;
};

type Props = {
  item: FAQEntry;
  initiallyExpanded?: boolean;
};

export default function FAQItem({ item, initiallyExpanded = false }: Props) {
  const [open, setOpen] = useState<boolean>(initiallyExpanded);

  return (
    <View className="w-full">
      {/* Header row */}
      <Pressable
        onPress={() => setOpen((v) => !v)}
        className="flex-row items-center justify-between px-4 py-4"
        accessibilityRole="button"
        accessibilityLabel={item.question}
        accessibilityState={{ expanded: open }}
      >
        <Text className="flex-1 pr-4 text-base text-black">
          {item.question}
        </Text>
        <Text className="text-2xl text-neutral-700">{open ? "–" : "+"}</Text>
      </Pressable>

      {/* Divider */}
      <View className="h-px bg-neutral-200" />

      {/* Body (collapsible) */}
      {open && (
        <View className="px-4 pb-4 pt-3">
          <Text className="text-sm leading-5 text-neutral-700">
            {item.answer}
          </Text>
        </View>
      )}
    </View>
  );
}
