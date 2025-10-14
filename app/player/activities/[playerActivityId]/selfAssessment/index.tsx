import SelfAssessmentPage, {
  SelfAssessmentOnPressProps,
} from "@/components/SelfAssessment";
import { useLocalization } from "@/contexts/LocalizationContext";
import Constants from "expo-constants";
import {
  RelativePathString,
  router,
  useLocalSearchParams,
  usePathname,
} from "expo-router";

export default function PlayerActivitySelfAssessmentPage() {
  const { playerActivityId, activityType } = useLocalSearchParams();
  const { t } = useLocalization("components.activities.selfAssessment");
  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  let pathname = usePathname();
  pathname = pathname.split("/").slice(0, -1).join("/");

  const onPress = async ({
    value,
    user,
    setDisableButton,
  }: SelfAssessmentOnPressProps) => {
    const body: any = {
      player_activity_id: playerActivityId,
      self_assessment_score: value,
    };

    if (activityType) {
      body.activity_type = activityType;
    }

    const response = await fetch(
      `${Constants.expoConfig?.extra?.BACKEND_URL}/player-activity/self-assessment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (response.ok) {
      router.replace(`${pathname}` as RelativePathString);
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
  };

  return (
    <SelfAssessmentPage
      onPress={onPress}
      pageText={{
        title: t("title"),
        notice: t("notice"),
        sliderTitle: t("sliderTitle"),
        sliderLeft: t("sliderLeft"),
        sliderRight: t("sliderRight"),
        buttonText: t("done"),
      }}
      customBackPath={
        `player/dashboard?player=${JSON.stringify(playerData)}` as RelativePathString
      }
    />
  );
}
