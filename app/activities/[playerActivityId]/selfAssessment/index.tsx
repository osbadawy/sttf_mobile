import Button, { ButtonColor } from "@/components/Button";
import Card from "@/components/Card";
import { ExclamationMark } from "@/components/icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CustomSlider from "@/components/Slider";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import Constants from "expo-constants";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function SelfAssessmentPage() {
  const { playerActivityId, activityType } = useLocalSearchParams();
  const { t } = useLocalization("components.activities.selfAssessment");
  const useDateState = useState(new Date());
  const { user } = useAuth();
  const [value, setValue] = useState(5);
  const [ disableButton, setDisableButton ] = useState(false);

  const onPress = async () => {
    if (user && playerActivityId){
      setDisableButton(true);
      const token = await user.getIdToken();
      const body: any = {
        player_activity_id: playerActivityId,
        self_assessment_score: value/10,
      }

      if (activityType){
        body.activity_type = activityType;
      }

      const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_URL}/player-activity/self-assessment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok){
        router.push("/activities" as RelativePathString);
      } else {
        const errorData = await response.json();
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          requestBody: body,
        });
      }
      setDisableButton(false);
    }
  };

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("title"),
        showDateSelector: false,
        useDateState: useDateState,
        showBGImage: false,
        showCalendarIcon: false,
        showBackButton: true,
      }}
    >
      <View className="flex-1 flex-col justify-between pb-[60px]">
        <Card className="flex-row items-center py-5 px-4" style={{ gap: 24, borderRadius: 24 }}>
          <Card className="w-[40px] h-[40px] items-center justify-center rounded-full bg-white drop-shadow-md">
            <ExclamationMark />
          </Card>
          <Text className="effra-light text-xs">{t("notice")}</Text>
        </Card>

        <View>
          <Text className="effra-regualr text-2xl pb-5 text-center">
            {t("sliderTitle")}
          </Text>
          <CustomSlider
            value={value}
            onChange={setValue}
            leftLabel="Tired"
            rightLabel="Ready!"
          />
        </View>

        <Button
          title={t("done")}
          onPress={onPress}
          color={ButtonColor.primary}
        />
      </View>
    </ParallaxScrollView>
  );
}
