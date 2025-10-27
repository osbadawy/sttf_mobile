import { useLocalization } from "@/contexts/LocalizationContext";
import { Image, Text, View } from "react-native";

export default function EmptyCoachDashboard() {
  const { t } = useLocalization("components.coach.coachDashboard");
  return (
    <View className="flex-1 justify-center items-center px-6">
      <Image
        source={require("../../assets/images/EmptyCoachSelector.png")}
        style={{
          width: 160,
          height: 160,
          resizeMode: "contain",
          marginBottom: 16,
        }}
      />
      <Text className="text-center text-neutral-500 text-2xl font-semibold mb-12">
        {t("empty state dashboard coach")}
      </Text>
      <View className="absolute bottom-8 w-full">
        <Text className="text-center text-sm text-gray-900">
          {t("ask players")}
        </Text>
      </View>
    </View>
  );
}
