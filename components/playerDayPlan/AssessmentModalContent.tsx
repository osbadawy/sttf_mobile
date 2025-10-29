import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { PlayerSelfAssessment } from "@/schemas/PlayerSelfAssessment";
import Constants from "expo-constants";
import { User } from "firebase/auth";
import { Alert } from "react-native";
import SelfAssessmentIcon from "../icons/SelfAssessmentIcon";

interface AssessmentModalContentProps {
  assessment: PlayerSelfAssessment;
  category: string;
  user: User | null;
  score: number;
  onClose: () => void;
  onRefetch: () => void;
}

export default function AssessmentModalContent({
  assessment,
  category,
  user,
  score,
  onClose,
  onRefetch,
}: AssessmentModalContentProps) {
  const { t: tTiredness } = useLocalization(
    "components.selfAssessment.tiredness",
  );
  const { t: tReadiness } = useLocalization(
    "components.selfAssessment.readiness",
  );
  const { t } = useLocalization("components.dayPlan");

  const selfAssessmentText =
    category === "tiredness"
      ? t("selfAssessmentTiredness")
      : t("selfAssessmentReadiness");

  // subtitle = t(category);
  const title = t("assessment");

  const startOfDay = new Date();
  startOfDay.setHours(7, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(19, 0, 0, 0);

  let start = category === "readiness" ? startOfDay : endOfDay;
  if (assessment) {
    start = assessment.createdAt;
  }

  const handleComplete = async () => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return false;
    }

    try {
      const token = await user.getIdToken();
      const backendUrl = Constants.expoConfig?.extra?.BACKEND_URL;
      const url = `${backendUrl}/player-self-assessment`;
      const body = {
        score: score / 5,
        assessment_type: assessment?.assessment_type || category,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(`Failed to complete assessment: ${errorData.message}`);
      }

      Alert.alert("Success", "Assessment completed successfully!");
      onClose();
      onRefetch();
      return true;
    } catch (error) {
      console.error("Error completing assessment:", error);
      Alert.alert("Error", "Failed to complete assessment. Please try again.");
      return false;
    }
  };

  return {
    subtitle: t("assessment"),
    title,
    icon: <SelfAssessmentIcon />,
    color: colors.yellow,
    contentElement: null,
    selfAssessmentText,
    points: 20,
    startTime: start,
    calories: null,
    onComplete: handleComplete,
  };
}
