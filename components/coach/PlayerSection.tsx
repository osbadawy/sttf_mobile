import PlayerCard, { Player } from "@/components/coach/PlayerCard";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  colorClass: string;
  players: Player[];
  comparator: (a: Player, b: Player) => number;
  onPlayerPress?: (p: Player) => void;
  selectMode?: boolean;         // <-- NEW
  selectedIds?: string[];       // <-- NEW
};

export default function PlayerSection({
  title,
  colorClass,
  players,
  comparator,
  onPlayerPress,
  selectMode = false,
  selectedIds = [],
}: Props) {
  const sorted = React.useMemo(() => [...players].sort(comparator), [players, comparator]);

  return (
    <View className="mb-6">
      <View className="mb-3 px-1">
        <Text className={`font-semibold ${colorClass}`}>{title}</Text>
        <View className="mt-1 h-[1px] w-full bg-neutral-200" />
      </View>

      <View className="flex-row flex-wrap justify-between">
        {sorted.map((p) => {
          const id = (p as any).firebase_id ?? p.id;
          const isSelected = selectMode && selectedIds.includes(id);
          return (
            <PlayerCard
              key={id}
              p={p}
              onPress={onPlayerPress}
              selected={isSelected}      // <-- NEW: visual highlight
              selectMode={selectMode}    // <-- NEW (if you want to tweak UI in card)
            />
          );
        })}

        {sorted.length === 0 && (
          <View className="w-full rounded-xl border border-dashed border-neutral-300 p-4 bg-white">
            <Text className="text-neutral-500">No players in this category.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

