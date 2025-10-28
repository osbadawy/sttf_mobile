import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { PlannedActivity } from "@/schemas/PlannedActivity";
import { Text } from "react-native";
import DynamicActivityIcon from "../icons/activities";

interface ActivityModalContentProps {
  activity: PlannedActivity;
  category: string;
}

export default function ActivityModalContent({
  activity,
  category,
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
    start = completions[0].created_at;
  }

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
  };
}
