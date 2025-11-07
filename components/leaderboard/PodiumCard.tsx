// features/leaderboard/components/PodiumCard.tsx
import ProfilePictureDefaultIcon from "@/components/icons/ProfilePictureDefault";
import { Image, Text, View } from "react-native";

interface PodiumCardProps {
  rankLabel: "1st" | "2nd" | "3rd";
  name?: string | null;
  score: number;
  avatar?: string | null;
  emphasized?: boolean;
}

export default function PodiumCard({
  rankLabel,
  name,
  score,
  avatar,
  emphasized = false,
}: PodiumCardProps) {
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
      {avatar ? (
        <Image
          source={{ uri: avatar }}
          className="h-24 w-24 rounded-2xl"
          resizeMode="cover"
        />
      ) : (
        <View className="h-24 w-24 rounded-2xl bg-neutral-200 items-center justify-center">
          <View style={{ transform: [{ scale: 2.5 }] }}>
            <ProfilePictureDefaultIcon />
          </View>
        </View>
      )}
      <Text className={`mt-2 text-lg font-bold ${rankColor}`}>{rankLabel}</Text>
      <Text
        className="mt-1 text-center text-[13px] text-neutral-800"
        numberOfLines={1}
      >
        {name ?? "Anonymous Player"}
      </Text>
      <Text className="text-center text-neutral-500">
        {score?.toLocaleString() ?? "0"}
      </Text>
    </View>
  );
}
