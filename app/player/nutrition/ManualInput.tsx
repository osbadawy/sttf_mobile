import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

const shadow = Platform.select({
  ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 4 },
});

export default function ManualInputDesign(){
  const { t, isRTL } = useLocalization("components.nutrition.nutritionList");
  return (
    <ParallaxScrollView
      headerProps={{
        title: t("AddMealtitle"),
        showBackButton: true,
        showDateSelector: false,
        showBGImage: false,
        showCalendarIcon: false,
      }}
    >
    <View className="flex-1 bg-[#F7F9F7]">
      {/* Header block */}
      <View className="bg-[#E6E6E6] pt-10 pb-6 px-4">

        {/* Camera icon */}
        <View className="items-center mt-6">
          <View
            className="w-16 h-16 rounded-2xl bg-white border border-neutral-300 items-center justify-center"
            style={shadow}
          >
            <Ionicons name="camera-outline" size={32} color="#A3A3A3" />
          </View>

        {/* Add picture button */}
          <TouchableOpacity
            activeOpacity={0.9}
            className="mt-4 rounded-md border border-emerald-600 px-5 py-2 bg-white"
            style={{
              ...(shadow as object),
              // subtle teal drop shadow like mock
              shadowColor: "#34d399",
              shadowOpacity: 0.18,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 6 },
            }}
          >
            <View className="flex-row items-center">
              <Text className="text-emerald-700 font-medium">Add picture</Text>
              <Text className="text-emerald-700 font-semibold ml-1">+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content area (light cream) */}
      <View className="flex-1 px-4 pt-5 bg-[#F3F6EE]">
        {/* Name input (visual only) */}
        <View
          className="w-full rounded-xl bg-white border border-[#E8E8E8] mb-3"
          style={shadow}
        >
          <TextInput
            editable={false}
            placeholder="Name of Meal"
            placeholderTextColor="#A3A3A3"
            className="px-4 py-3 text-[16px] text-neutral-900"
          />
        </View>

        {/* When input (visual only) */}
        <View
          className="w-full rounded-xl bg-white border border-[#E8E8E8] mb-6"
          style={shadow}
        >
          <View className="flex-row items-center justify-between px-4 py-3">
            <Text className="text-[16px] text-neutral-400">When</Text>
            <Ionicons name="chevron-down" size={16} color="#111827" />
          </View>
        </View>

        {/* Add Data */}
        <Text className="text-base text-neutral-700 text-center">
          Add Data <Text className="text-neutral-500">▾</Text>
        </Text>
      </View>

      {/* Disabled Swipe to Confirm pill */}
      <View className="px-4 pb-6">
        <View
          className="rounded-3xl bg-white/70 border border-[#E7EDE4] h-14 overflow-hidden"
          style={[shadow, { opacity: 0.8 }]}
        >
          {/* faint chevrons pattern */}
          <View className="absolute inset-0 flex-row items-center justify-center">
            <View className="absolute left-4 right-4 flex-row justify-between opacity-20">
              {Array.from({ length: 6 }).map((_, i) => (
                <Ionicons key={i} name="chevron-forward" size={28} color="#9CA3AF" />
              ))}
            </View>
          </View>

          {/* centered label */}
          <View className="flex-1 items-center justify-center">
            <Text className="text-base">
              <Text className="text-neutral-400">Swipe </Text>
              <Text className="text-emerald-600">to Confirm</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
    </ParallaxScrollView>
  );
}
