import { useMemo } from "react";
import { Text, View } from "react-native";

type Props = {
  bmi?: number;
  weightKg?: number;
  heightCm?: number;
};

export default function BMIIndicator({ bmi, weightKg, heightCm }: Props) {
  // ---- derived weight display ----
  // ---- scale ----
  const LOWER = 10;
  const UPPER = 40;

  // Colors
  const RED = "#C62828";
  const ORANGE = "#EF6C00";
  const YELLOW = "#F9A825";
  const TEAL = "#16BAC5";

  // Define exact numeric boundaries to align perfectly with colors visually
  const segments = [
    { label: t("severely underweight"), color: RED, min: 10, max: 14 },
    { label: t("moderately underweight"), color: ORANGE, min: 14, max: 16 },
    { label: t("slightly underweight"), color: YELLOW, min: 16, max: 18.5 },
    { label: t("healthy"), color: TEAL, min: 18.5, max: 25 },
    { label: t("slightly obese"), color: YELLOW, min: 25, max: 30 },
    { label: t("moderately obese"), color: ORANGE, min: 30, max: 35 },
    { label: t("severely obese"), color: RED, min: 35, max: 40 },
  ];

  // Compute bar widths based on the actual numeric span of each segment
  const segmentWidths = useMemo(() => {
    const totalRange = UPPER - LOWER;
    return segments.map((s) => (s.max - s.min) / totalRange);
  }, []);

  // Compute category based on same segments used for rendering
  const { categoryLabel, categoryColor } = useMemo(() => {
    const clamped = Math.min(UPPER, Math.max(LOWER, bmi));
    const seg =
      segments.find((s) => clamped >= s.min && clamped < s.max) ??
      segments[segments.length - 1];
    return { categoryLabel: seg.label, categoryColor: seg.color };
  }, [bmi]);

  // Marker position in percentage
  const markerLeftPct = useMemo(() => {
    const clamped = Math.min(UPPER, Math.max(LOWER, bmi));
    return ((clamped - LOWER) / (UPPER - LOWER)) * 100;
  }, [bmi]);

  return (
    <View className="px-4">
      {/* Top row: weight + category */}
      <View className="mb-2 flex-row items-baseline justify-between">
        <View className="flex-row items-baseline">
          <Text className="text-3xl font-semibold text-black">{weightKg}</Text>
          <Text className="ml-1 text-neutral-500">Kg</Text>
        </View>

        <Text
          numberOfLines={1}
          style={{ color: categoryColor }}
          className="text-sm font-medium"
        >
          {categoryLabel}
        </Text>
      </View>

      {/* Bar */}
      <View className="relative">
        <View className="h-1.5 rounded-full overflow-hidden flex-row">
          {segments.map((seg, i) => (
            <View
              key={seg.label}
              style={{
                flex: segmentWidths[i],
                backgroundColor: seg.color,
              }}
            />
          ))}
        </View>

        {/* Marker */}
        <View
          style={{
            position: "absolute",
            left: `${markerLeftPct}%`,
            top: -4,
            height: 12,
            width: 3,
            backgroundColor: "#111827",
            transform: [{ translateX: -1.5 }],
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
}
