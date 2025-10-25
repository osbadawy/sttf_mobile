import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";

interface ReadinessBarProps {
  value: number; // 0–100
}

export default function ReadinessBar({ value }: ReadinessBarProps) {
  const { t } = useLocalization("components.nutrition.nutritionList");
  const clamped = Math.max(0, Math.min(100, value));

  // Choose bar color based on readiness level
  let barColor = "bg-rose-500"; // default red
  if (clamped > 75) barColor = "bg-emerald-500";
  else if (clamped >= 25 && clamped <= 75) barColor = "bg-amber-500";

  return (
    <View>
      <View className="flex-row items-baseline mb-1">
        <Text className="text-2xl font-bold">{clamped}</Text>
        <Text className="ml-1 text-xs text-neutral-600">{t("readiness")}</Text>
      </View>

      <View className="h-1 w-full rounded-full bg-neutral-200 overflow-hidden">
        <View
          className={`h-1 rounded-full ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </View>
    </View>
  );
}
