import SelfAssessmentPage, {
  SelfAssessmentOnPressProps,
} from "@/components/SelfAssessment";
import { useLocalization } from "@/contexts/LocalizationContext";
import Constants from "expo-constants";
import { RelativePathString, router } from "expo-router";
import { useState } from "react";

export default function TirednessSelfAssessmentPage() {
  const { t } = useLocalization("components.selfAssessment.tiredness");
  const [error, setError] = useState<boolean>(false);

  const onPress = async ({
    value,
    user,
    setDisableButton,
  }: SelfAssessmentOnPressProps) => {
    const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/player-self-assessment`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebase_id: user.uid,
        score: value,
        assessment_type: "tiredness",
      }),
    });
    if (response.ok) {
      router.replace("player/dashboard" as RelativePathString);
      setError(false);
    } else {
      const errorData = await response.json();
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestBody: {
          firebase_id: user.uid,
          score: value,
          assessment_type: "tiredness",
        },
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
