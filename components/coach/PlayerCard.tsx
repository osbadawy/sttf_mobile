import ReadinessBar from "@/components/coach/ReadinessBar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CountryFlag from "react-native-country-flag";

export type Player = {
  id: string;
  age?: number;
  readiness: number;
  meal: boolean;
  workout: boolean;
  nationality?: string;
  photo_url?: string;
  display_name?: string;
};

interface PlayerCardProps {
  p: Player;
  onPress?: (p: Player) => void;
  selected?: boolean; // <-- NEW
  selectMode?: boolean; // <-- optional (if you want to adjust affordances)
}

export default function PlayerCard({
  p,
  onPress,
  selected = false,
}: PlayerCardProps) {
  const R = 130;
  const offsetX = 26;
  const offsetY = 28;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="w-[46%] mb-4"
      onPress={() => onPress?.(p)}
    >
      <View className="rounded-2xl bg-white shadow-sm overflow-hidden">
        {/* light green highlight overlay when selected */}
        {selected && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,140,70,0.10)",
            }}
          />
        )}

        <View className="rounded-2xl p-3">
          {/* --- CLIP ZONE --- */}
          <View className="overflow-hidden" style={{ paddingBottom: 4 }}>
            {/* Header: name stack + flag */}
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold">
                  {p.display_name}
                </Text>
                <Text className="text-neutral-600 text-lg mt-0.5">
                  Age <Text className="font-bold text-gray-700">{p.age}</Text>
                </Text>
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
            {p.photo_url ? (
              <View className="items-end relative">
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
            ) : (
              <View style={{ height: 8 }} />
            )}
          </View>

          {/* --- READINESS BAR --- */}
          <ReadinessBar value={p.readiness} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
