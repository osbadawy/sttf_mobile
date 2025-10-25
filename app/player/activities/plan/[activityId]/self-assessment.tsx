import SelfAssessmentPage, {
  SelfAssessmentOnPressProps,
} from "@/components/SelfAssessment";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlannedActivities } from "@/hooks/activities/usePlannedActivities";
import Constants from "expo-constants";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function PlayerActivitySelfAssessmentPage() {
  const { activityId, date } = useLocalSearchParams();
  const { t } = useLocalization("components.activities.selfAssessment");
  const [error, setError] = useState<boolean>(false);

  // Get the planned activities hook to access refetch and clearCache functions
  const { refetch, clearCache } = usePlannedActivities({
    day: new Date((date as string) || new Date()),
  });

  // Get the path to go back to the planned activities page
  const plannedActivitiesPath = "/player/activities/plan";

  const onPress = async ({
    value,
    user,
    setDisableButton,
  }: SelfAssessmentOnPressProps) => {
    const body: any = {
      id: activityId,
      self_assessment_score: value,
    };

    const response = await fetch(
      `${Constants.expoConfig?.extra?.BACKEND_URL}/planned-activity/player-self-assessment`,
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
      // Clear the cache and refetch activities data to reflect the updated completion status
      clearCache();
      await refetch();

      // Use router.replace to ensure the previous page refreshes with new data
      router.replace(plannedActivitiesPath as RelativePathString);
      setError(false);
    } else {
      const errorData = await response.json();
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestBody: body,
      });
      setError(true);
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
      error={Boolean(error)}
    />
  );
}
