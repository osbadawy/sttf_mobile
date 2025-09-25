import colors from "@/colors";
import { formatDuration } from "@/utils/activities";
import { Text, TouchableOpacity, View } from "react-native";
import { Arrow } from "../icons";

export default function ActivityCard({
  activity,
  isRTL,
}: {
  activity: any;
  isRTL: boolean;
}) {
  const duration = formatDuration(activity.started_at, activity.ended_at);
  const needsAction =
    !activity.activity_type || activity.activity_type === "activity";

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between pb-10 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      disabled={!needsAction}
    >
      <View
        className="w-[56px] h-[56px] rounded-full bg-white"
        style={{
          boxShadow: needsAction ? `0 0 8px 0 ${colors.stress}` : "none",
        }}
      />
      <View className="flex-1 pl-4">
        <Text className="text-base effra-medium">
          {activity.activity_type}{" "}
        </Text>
        {needsAction ? (
          <Text
            className={`text-base effra-light ${needsAction ? "text-stress" : ""}`}
          >
            Assessment Needed
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
