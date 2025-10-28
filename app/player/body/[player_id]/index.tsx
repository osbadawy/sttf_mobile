import BMIIndicator from "@/components/body/BMIIndicator";
import BodyStats from "@/components/body/BodyStats";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function Body() {
  const { t } = useLocalization("components.plan.meal");
  const dateState = useState(new Date());
  const { player_id, date, player } = useLocalSearchParams<{
    player_id: string;
    date?: string;
    player?: string;
  }>();

    const statsData = [
    { label: "BMI", value: "20.4" },
    { label: "Fat %", value: "12.3" },
    { label: "Muscle %", value: "81.1" },
  ];

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("body"),
        showBackButton: true,
        showBGImage: false,
        showCalendarIcon: true,
        showDateSelector: true,
        disableFutureDates: false,
        useDateState: dateState,
      }}
      showNav={false}
    >
      <View className="py-4">
        <BodyStats stats={statsData} />
      </View>
      <View className="py-4">
        <BMIIndicator bmi={34.4} heightCm={182} />
      </View>
    </ParallaxScrollView>
  );
}
