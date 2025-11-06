// features/leaderboard/components/PodiumCard.tsx
import { Image, Text, View } from "react-native";

export default function PodiumCard({
  rankLabel,
  name,
  score,
  avatar,
  emphasized = false,
}: {
  rankLabel: "1st" | "2nd" | "3rd";
  name: string;
  score: number;
  avatar: string;
  emphasized?: boolean;
}) {
  const rankColor =
    rankLabel === "1st"
      ? "text-amber-500"
      : rankLabel === "2nd"
        ? "text-neutral-400"
        : "text-orange-500";

  return (
    <View
      className="mx-2 items-center"
      style={{ transform: emphasized ? [{ translateY: -12 }] : undefined }}
    >
      <Image
        source={{ uri: avatar }}
        className="h-24 w-24 rounded-2xl"
        resizeMode="cover"
      />
      <Text className={`mt-2 text-lg font-bold ${rankColor}`}>{rankLabel}</Text>
      <Text
        className="mt-1 text-center text-[13px] text-neutral-800"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="text-center text-neutral-500">
        {score.toLocaleString()}
      </Text>
    </View>
  );
}
