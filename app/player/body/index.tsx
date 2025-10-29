import BMIIndicator from "@/components/body/BMIIndicator";
import BodyStats from "@/components/body/BodyStats";
import HistoryGraphSelector from "@/components/body/HistoryGraphSelector";
import CustomButton, { ButtonColor, ButtonSize } from "@/components/Button";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useBodyCompositionLatest } from "@/hooks/useBodyCompositionLatest";
import { useBodyCompositions } from "@/hooks/useBodyCompositions";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Body() {
  const { t } = useLocalization("components.body");
  const dateState = useState(new Date());
  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  const {
    data: latestBodyComposition,
    loading: latestBodyCompositionLoading,
    error: latestBodyCompositionError,
  } = useBodyCompositionLatest({ firebase_id: playerData.firebase_id });
  const {
    data: bodyCompositions,
    loading: bodyCompositionsLoading,
    error: bodyCompositionsError,
  } = useBodyCompositions({ firebase_id: playerData.firebase_id, limit: 10 });

  const statsData = [
    { label: "bmi", value: "20.4" },
    { label: "fat %", value: "12.3" },
    { label: "muscle %", value: "81.1" },
  ];

  console.log({ latestBodyComposition, bodyCompositions });

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
      error={Boolean(latestBodyCompositionError || bodyCompositionsError)}
    >
      {(latestBodyCompositionLoading || bodyCompositionsLoading) && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
      <View className="py-4">
        <BodyStats stats={statsData} />
      </View>
      <View className="py-4">
        <BMIIndicator bmi={34.4} heightCm={182} />
      </View>

      <View className="py-4">
        <View className="mt-10 mb-6 mx-10">
          <CustomButton
            title={t("add measurements")}
            onPress={() =>
              router.push({
                pathname:
                  "/player/body/[player_id]/BodyData" as RelativePathString,
                params: {
                  player: player,
                },
              })
            }
            color={ButtonColor.disabled}
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
