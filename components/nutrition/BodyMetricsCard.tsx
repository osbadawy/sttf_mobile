// components/nutrition/BodyMetricsCard.tsx
import { Text, View } from "react-native";

export type BodyMetricsProps = {
  weightKg: number; // e.g., 83.2
  bmi: number; // e.g., 20.5
  fatPercent: number; // e.g., 12.2
  musclePercent: number; // e.g., 35.6
  title?: string; // optional override for the header
};

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-row items-center py-3">
      <Text className="text-[16px] text-neutral-800">{label}</Text>
      <Text className="ml-auto text-[16px] font-semibold text-neutral-900">
        {value}
      </Text>
    </View>
  );
}

export default function BodyMetricsCard({
  weightKg,
  bmi,
  fatPercent,
  musclePercent,
  title = "Body Metrics",
}: BodyMetricsProps) {
  // format helpers to mirror the mock
  const fmt1 = (n: number) => n.toFixed(1);

  return (
    <View className="px-4">
      {/* Header */}
      <Text className="text-[18px] font-semibold text-neutral-900 mb-3">
        {title}
      </Text>

      {/* Rows */}
      <View className="bg-transparent">
        <Row label="Weight" value={`${fmt1(weightKg)}Kg`} />
        <View className="h-[1px] bg-neutral-200" />

        <Row label="BMI" value={fmt1(bmi)} />
        <View className="h-[1px] bg-neutral-200" />

        <Row label="Fat %" value={`${fmt1(fatPercent)}%`} />
        <View className="h-[1px] bg-neutral-200" />

        <Row label="Muscle %" value={`${fmt1(musclePercent)}%`} />
      </View>
    </View>
  );
}
