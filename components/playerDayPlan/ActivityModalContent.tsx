import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { PlannedActivity } from "@/schemas/PlannedActivity";
import Constants from "expo-constants";
import { User } from "firebase/auth";
import { Alert, Text } from "react-native";
import DynamicActivityIcon from "../icons/activities";

interface ActivityModalContentProps {
  activity: PlannedActivity;
  category: string;
  user: User | null;
  score: number;
  onClose: () => void;
  onRefetch: () => void;
}

export default function ActivityModalContent({
  activity,
  category,
  user,
  score,
  onClose,
  onRefetch,
}: ActivityModalContentProps) {
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const { t: tActivityCategory } = useLocalization(
    "components.activities.activityTypes.categories",
  );

  const { t } = useLocalization("components.dayPlan");

  const subtitle = tActivityCategory(category);
  const title = activity.is_custom
    ? activity.activity_type
    : tActivityTypes(activity.activity_type);
  const icon = <DynamicActivityIcon activityType={activity.activity_type} />;
  const color = colors.blue;

  let start = activity.start;
  const completions = activity.players_assigned[0].completions;
  if (completions && completions.length > 0) {
    start = completions[0].createdAt;
  }

  const handleComplete = async () => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return false;
    }

    try {
      const token = await user.getIdToken();
      const backendUrl = Constants.expoConfig?.extra?.BACKEND_URL;
      const url = `${backendUrl}/planned-activity/player-self-assessment`;
      const body = {
        id: activity.id,
        self_assessment_score: score / 5,
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
        throw new Error(`Failed to complete activity: ${errorData.message}`);
      }

      Alert.alert("Success", "Activity completed successfully!");
      onClose();
      onRefetch();
      return true;
    } catch (error) {
      console.error("Error completing activity:", error);
      Alert.alert("Error", "Failed to complete activity. Please try again.");
      return false;
    }
  };

  return {
    subtitle,
    title,
    icon,
    color,
    contentElement: (
      <Text className="text-base effra-regular">{activity.notes}</Text>
    ),
    selfAssessmentText: t("selfAssessmentActivity"),
    points: 20,
    startTime: start,
    calories: null,
    onComplete: handleComplete,
  };
}
