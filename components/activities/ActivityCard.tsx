import { useLocalization } from "@/contexts/LocalizationContext";
import { formatDuration } from "@/utils/dateTimeHelpers";
import { RelativePathString, router, usePathname } from "expo-router";
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
  const pathname = usePathname();

  const duration = formatDuration({
    started_at: activity.start,
    ended_at: activity.end,
  });

  const onPress = () => {
    router.push(`${pathname}/${activity.id}` as RelativePathString);
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between pb-10 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      onPress={onPress}
    >
      <View className="w-[56px] h-[56px] rounded-full bg-white items-center justify-center">
        <DynamicActivityIcon activityType={activity.sport_name} />
      </View>
      <View className="flex-1 pl-4">
        <Text className="text-base effra-medium">
          {tActivityTypes(activity.sport_name.split("_")[0])}{" "}
        </Text>
        <Text className="text-base effra-light">{duration}</Text>
      </View>

      <Arrow direction={isRTL ? "left" : "right"} stroke="black" />
    </TouchableOpacity>
  );
}
