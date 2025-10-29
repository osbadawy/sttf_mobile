// components/body/RenderHistory.tsx
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

type HistoryRow = {
  dateISO: string;
  weightKg: number;
  bmi: number;
  fatPct: number;
  musclePct: number;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const wd = d.toLocaleDateString(undefined, { weekday: "short" });
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${wd}, ${dd}.${mm}`;
};

function StatCell({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <View className="flex-1">
      <Text className="text-base font-semibold text-black">
        {value}
        {suffix}
      </Text>
      <Text className="mt-1 text-[11px] text-neutral-500">{label}</Text>
    </View>
  );
}

export default function RenderHistory() {
  // TODO: replace mockData with fetched data from backend
  const rows = mockData;
  const { player_id, date, player } = useLocalSearchParams<{
    player_id: string;
    date?: string;
    player?: string;
  }>();

  return (
    <View className="w-full px-4 py-6">
      <Text className="mb-3 text-xl font-semibold text-black">
        {t("body data - log")}
      </Text>
      <View className="h-px bg-neutral-200 mb-2" />

      {rows.map((row, idx) => (
        <View key={row.dateISO}>
          {/* Date + Edit */}
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-xs text-neutral-500">
              {formatDate(row.dateISO)}
            </Text>

            <Pressable
              onPress={() =>
                router.push({
                  pathname:
                    "/player/body/[player_id]/BodyData" as RelativePathString,
                  params: {
                    player_id: String(player_id ?? ""),
                    dateISO: row.dateISO,
                    weightKg: String(row.weightKg),
                    bmi: String(row.bmi),
                    fatPct: String(row.fatPct),
                    musclePct: String(row.musclePct),
                  },
                })
              }
            >
              <Text className="text-emerald-700 underline">{t("edit")}</Text>
            </Pressable>
          </View>

          {/* Values row */}
          <View className="flex-row gap-4 py-1">
            <StatCell value={row.weightKg} label={t("weight")} suffix="Kg" />
            <StatCell value={row.bmi} label="BMI" />
            <StatCell value={row.fatPct} label={t("fat")} suffix="%" />
            <StatCell value={row.musclePct} label={t("muscle")} suffix="%" />
          </View>

          {idx < rows.length - 1 && (
            <View className="h-px bg-neutral-200 mt-4" />
          )}
        </View>
      ))}
    </View>
  );
}
