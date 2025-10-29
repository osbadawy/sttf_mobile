// components/body/BodyStats.tsx
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";

type StatCardProps = {
  label: string;
  value: number | string;
};

type BodyStatsProps = {
  stats: StatCardProps[];
};

function StatCard({ label, value }: StatCardProps) {
  const { t } = useLocalization("components.body.body");
  // Add % only for Fat % and Muscle %
  const displayValue =
    label.toLowerCase().includes(t("fat")) ||
    label.toLowerCase().includes(t("muscle"))
      ? `${value}%`
      : `${value}`;

  return (
    <View className="flex-1 rounded-3xl bg-white border border-neutral-200 px-4 py-5 shadow-sm">
      <Text className="text-md text-neutral-500 mb-8">{label}</Text>
      <Text className="text-2xl font-semibold text-black">{displayValue}</Text>
    </View>
  );
}

export default function BodyStats({ stats }: BodyStatsProps) {
  return (
    <View className="px-4">
      <View className="flex-row gap-3">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </View>
    </View>
  );
}
