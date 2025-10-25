import PlayerCard, { Player } from "@/components/coach/PlayerCard";
import React from "react";
import { Text, View } from "react-native";

export default function PlayerSection({
  title,
  colorClass,
  players,
  comparator,
}: {
  title: string;
  colorClass: string;
  players: Player[];
  comparator: (a: Player, b: Player) => number;
}) {
  const sorted = React.useMemo(() => [...players].sort(comparator), [players, comparator]);

  return (
    <View className="mb-6">
      <View className="mb-3 px-1">
        <Text className={`font-semibold ${colorClass}`}>{title}</Text>
        <View className="mt-1 h-[1px] w-full bg-neutral-200" />
      </View>

      <View className="flex-row flex-wrap justify-between">
        {sorted.map((p) => <PlayerCard key={p.id} p={p} />)}
        {sorted.length === 0 && (
          <View className="w-full rounded-xl border border-dashed border-neutral-300 p-4 bg-white">
            <Text className="text-neutral-500">No players in this category.</Text>
          </View>
        )}
      </View>
    </View>
  );
}
