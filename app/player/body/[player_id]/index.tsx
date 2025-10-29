import BMIIndicator from "@/components/body/BMIIndicator";
import BodyStats from "@/components/body/BodyStats";
import HistoryGraphSelector from "@/components/body/HistoryGraphSelector";
import CustomButton, { ButtonColor, ButtonSize } from "@/components/Button";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
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
      showNav={true}
    >
      <View className="py-4">
        <BodyStats stats={statsData} />
      </View>
      <View className="py-4">
        <BMIIndicator bmi={34.4} heightCm={182} />
      </View>

      <View className="py-4">
        <View className="mt-10 mb-6 mx-10">
          <CustomButton
            title="Add Measurements"
            onPress={() =>
              router.push({
                pathname:
                  "/player/body/[player_id]/BodyData" as RelativePathString,
                params: {
                  player_id: String(player_id),
                },
              })
            }
            color={ButtonColor.white}
            size={ButtonSize.sm}
          />
        </View>
      </View>

      <View className="mt-8 mb-10">
        <HistoryGraphSelector initialTab="history" />
      </View>
    </ParallaxScrollView>
  );
}
