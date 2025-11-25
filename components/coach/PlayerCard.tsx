import ReadinessBar from "@/components/coach/ReadinessBar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CountryFlag from "react-native-country-flag";

export type CoachDashboardPlayer = {
  id: string;
  email?: string;
  age?: number;
  readiness: number;
  meal: boolean;
  workout: boolean;
  nationality?: string;
  photo_url?: string;
  display_name?: string;
};

interface PlayerCardProps {
  p: CoachDashboardPlayer;
  onPress?: (p: CoachDashboardPlayer) => void;
  selected?: boolean; // <-- NEW
  selectMode?: boolean; // <-- optional (if you want to adjust affordances)
  needsAssessment?: boolean;
}

export default function PlayerCard({
  p,
  onPress,
  selected = false,
  needsAssessment = false,
}: PlayerCardProps) {
  const R = 130;
  const offsetX = 26;
  const offsetY = 28;
  const email_short = p.email ? p.email.split("@")[0] : "";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="w-[46%] mb-4 relative"
      onPress={() => onPress?.(p)}
    >
      <View className="rounded-2xl bg-white shadow-sm">
        <View className="rounded-2xl p-3">
          {/* --- CLIP ZONE --- */}
          <View className="overflow-hidden" style={{ paddingBottom: 4 }}>
            {/* Header: name stack + flag */}
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold">
                  {p.display_name ?? email_short}
                </Text>
                {p.age && (
                  <Text className="text-neutral-600 text-lg mt-0.5">
                    Age <Text className="font-bold text-gray-700">{p.age}</Text>
                  </Text>
                )}
              </View>

              {p.nationality ? (
                <CountryFlag
                  isoCode={p.nationality}
                  size={18}
                  style={{ marginLeft: 8 }}
                />
              ) : (
                <Ionicons name="globe-outline" size={18} color="#9ca3af" />
              )}
            </View>

            {/* Image + straight white fade */}
            <View className="items-end relative">
              {p.photo_url ? (
                <Image
                  source={{
                    uri: p.photo_url,
                  }}
                  style={{
                    width: R,
                    height: R,
                    borderRadius: R / 2,
                    transform: [
                      { translateX: offsetX },
                      { translateY: offsetY },
                    ],
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: R,
                    height: R,
                    borderRadius: R / 2,
                    transform: [
                      { translateX: offsetX },
                      { translateY: offsetY },
                    ],
                  }}
                />
              )}
              <LinearGradient
                colors={["transparent", "white"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                  position: "absolute",
                  bottom: -5,
                  height: R * 0.35,
                  width: R,
                }}
              />
            </View>
          </View>

          {/* --- READINESS BAR --- */}
          <ReadinessBar value={p.readiness * 100} />
        </View>
        {/* light green highlight overlay when selected */}
        {selected && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,140,70,0.10)",
            }}
            className="rounded-2xl"
          />
        )}
        {needsAssessment && (
          <View
            className="absolute w-[16px] h-[16px] rounded-full bg-yellow"
            style={{
              top: -4,
              right: -4,
              boxShadow: `0px 0px 12px 1px rgba(250, 187, 0, 0.5)`,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
