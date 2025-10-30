import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";

export type BodyMetricsProps = {
  weightKg: number; // e.g., 83.2
  bmi: number; // e.g., 20.5
  fatPercent: number; // e.g., 12.2
  musclePercent: number; // e.g., 35.6
  title?: string; // optional override
};

function Row({
  label,
  value,
  isRTL,
}: {
  label: string;
  value: string | number;
  isRTL: boolean;
}) {
  return (
    <View
      className="flex-row items-center py-3"
      style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
    >
      <Text
        className="text-[16px] text-neutral-800"
        style={{ textAlign: isRTL ? "right" : "left" }}
      >
        {label}
      </Text>
      <Text
        className="ml-auto text-[16px] font-semibold text-neutral-900"
        style={{
          textAlign: isRTL ? "left" : "right",
          marginLeft: isRTL ? 0 : "auto",
          marginRight: isRTL ? "auto" : 0,
        }}
      >
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
  title,
}: BodyMetricsProps) {
  const { t, isRTL } = useLocalization("components.nutrition.nutritionList");

  const fmt1 = (n: number) => (n ? n.toFixed(1) : "--");

  return (
    <View className="px-4">
      {/* Localized header */}
      <Text
        className="text-[18px] font-semibold text-neutral-900 mb-3"
        style={{ textAlign: isRTL ? "right" : "left" }}
      >
        {title ?? t("body metrics")}
      </Text>

      <View className="bg-transparent">
        <Row isRTL={isRTL} label={t("weight")} value={`${fmt1(weightKg)}Kg`} />
        <View className="h-[1px] bg-neutral-200" />

        <Row isRTL={isRTL} label={t("bmi")} value={fmt1(bmi)} />
        <View className="h-[1px] bg-neutral-200" />

        <Row isRTL={isRTL} label={t("fat %")} value={`${fmt1(fatPercent)}%`} />
        <View className="h-[1px] bg-neutral-200" />

        <Row
          isRTL={isRTL}
          label={t("muscle %")}
          value={`${fmt1(musclePercent)}%`}
        />
      </View>
    </View>
  );
}
