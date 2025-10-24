import DynamicActivityIcon from "@/components/icons/activities";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, TouchableOpacity, View } from "react-native";

interface PlannedActivityItemProps {
  activity: any;
  onPress: (activity: any) => void;
  isSelected?: boolean;
}

export default function PlannedActivityItem({
  activity,
  onPress,
  isSelected = false,
}: PlannedActivityItemProps) {
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );
  const { t } = useLocalization("components.plan.workout");

  const date = new Date(activity.start);
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const activityName = activity.is_custom
    ? activity.activity_type
    : tActivityTypes(activity.activity_type);

  return (
    <TouchableOpacity
      key={activity.id}
      className={`bg-white border-2 rounded-[16px] px-[24px] py-[20px] mb-3 flex-row items-center ${
        isSelected ? "border-primary" : "border-[#B5BCBF]"
      }`}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.5)",
      }}
      onPress={() => onPress(activity)}
    >
      <DynamicActivityIcon activityType={activity.activity_type} />

      <View className="pl-4">
        <Text>
          {activityName} · {time}
        </Text>
        <Text className="effra-regular text-base" style={{ opacity: 0.6 }}>
          {activity.players_assigned.length} {t("players")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
