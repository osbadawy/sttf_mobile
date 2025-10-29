// components/body/RenderHistory.tsx
import { BodyCompositionData } from "@/components/body/HistoryGraphSelector";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

type HistoryRow = {
  dateISO: string; // e.g., "2025-09-02"
  weightKg: number; // e.g., 82
  bmi: number; // e.g., 20.5
  fatPct: number; // e.g., 12.5
  musclePct: number; // e.g., 82.5
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const wd = d.toLocaleDateString(undefined, { weekday: "short" }); // e.g., Tue
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

type Props = {
  bodyCompositions: BodyCompositionData[];
};

export default function RenderHistory({ bodyCompositions }: Props) {
  const { player_id, date, player } = useLocalSearchParams<{
    player_id: string;
    date?: string;
    player?: string;
  }>();

  // Transform API data to HistoryRow format
  const rows: HistoryRow[] = bodyCompositions.map((item) => ({
    dateISO: item.day || item.measurement_date || "",
    weightKg: parseFloat(String(item.weight_kg || 0)),
    bmi: parseFloat(String(item.bmi || 0)),
    fatPct: parseFloat(String(item.body_fat_percentage || 0)),
    musclePct: parseFloat(String(item.muscle_mass_percentage || 0)),
  }));

  return (
    <View className="w-full px-4 py-6">
      <Text className="mb-3 text-xl font-semibold text-black">
        Body Data - Log
      </Text>
      <View className="h-px bg-neutral-200 mb-2" />

      {rows.map((row, idx) => (
        <View key={row.dateISO}>
          {/* Header line with date + Edit */}
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
                    player_id: String(player_id),
                  },
                })
              }
            >
              <Text className="text-emerald-700 underline">Edit</Text>
            </Pressable>
          </View>

          {/* 4-column stat row */}
          <View className="flex-row gap-4 py-1">
            <StatCell value={row.weightKg} label="Weight" suffix="Kg" />
            <StatCell value={row.bmi} label="BMI" />
            <StatCell value={row.fatPct} label="Fat %" suffix="%" />
            <StatCell value={row.musclePct} label="Muscle %" suffix="%" />
          </View>

          {/* Separator (skip after last) */}
          {idx < rows.length - 1 && (
            <View className="h-px bg-neutral-200 mt-4" />
          )}
        </View>
      ))}
    </View>
  );
}
