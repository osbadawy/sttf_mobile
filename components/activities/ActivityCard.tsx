import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { formatDuration } from "@/utils/activities";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Arrow } from "../icons";
import DynamicActivityIcon from "../icons/activities";

interface ActivityCardProps {
  activity: any;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { t, isRTL } = useLocalization("components.activities.activityCard");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const duration = formatDuration({
    started_at: activity.started_at,
    ended_at: activity.ended_at,
  });
  const needsAction = !activity.self_assessment_score;

  const onPress = () => {
    if (needsAction) {
      if (activity.activity_type === "activity") {
        router.push(`/activities/${activity.id}/selfAssessment/sportSelection`);
      } else {
        router.push(`/activities/${activity.id}/selfAssessment`);
      }
    } else {
      router.push(`/activities/${activity.id}`);
    }
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between pb-10 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      onPress={onPress}
    >
      <View
        className="w-[56px] h-[56px] rounded-full bg-white items-center justify-center"
        style={{
          boxShadow: needsAction ? `0 0 8px 0 ${colors.stress}` : "none",
        }}
      >
        <DynamicActivityIcon activityType={activity.activity_type} />
      </View>
      <View className="flex-1 pl-4">
        <Text className="text-base effra-medium">
          {tActivityTypes(activity.activity_type)}{" "}
        </Text>
        {needsAction ? (
          <Text
            className={`text-base effra-light ${needsAction ? "text-stress" : ""}`}
          >
            {t("assessmentNeeded")}
          </Text>
        ) : (
          <Text className="text-base effra-light">{duration}</Text>
        )}
      </View>

      <Arrow
        direction={isRTL ? "left" : "right"}
        stroke={needsAction ? colors.stress : "black"}
      />
    </TouchableOpacity>
  );
}
