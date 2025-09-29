import AvgHeartRate from "@/components/activities/AvgHeartRate";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlayerActivities } from "@/hooks/activities/usePlayerActivities";
import { useSinglePlayerActivity } from "@/hooks/activities/useSinglePlayerActivity";
import { formatDate, formatDuration } from "@/utils/activities";
import { RelativePathString, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function ViewActivityPage() {
  const { playerActivityId } = useLocalSearchParams();
  const playerActivityIdString = Array.isArray(playerActivityId)
    ? playerActivityId[0]
    : playerActivityId;

  const useDateState = useState(new Date());
  const [hrViewWidth, setHrViewWidth] = useState(0);
  const { t } = useLocalization("components.activities.activityView");

  const {
    data: activities14Days,
    dataRange,
    loading,
    error,
    fetchAdditionalData,
  } = usePlayerActivities({
    initialDaysBack: 14,
  });

  const {
    activity,
    loading: activityLoading,
    error: activityError,
    refetch,
  } = useSinglePlayerActivity({
    playerActivityId: playerActivityIdString || "",
  });

  if (loading || activityLoading) {
    return <View />;
  }

  return (
    <ParallaxScrollView
      headerProps={{
        title: activity ? activity.activity_type : "--",
        customDescription: activity ? formatDate(activity.started_at) : "--",
        useDateState: useDateState,
        showCalendarIcon: false,
        backLink: "activities" as RelativePathString,
      }}
    >
      <View className="flex-row pb-[100px]">
        <View className="flex-1">
          <Text className="font-inter-light text-base pb-2">
            {t("duration")}
          </Text>
          <Text className="font-inter-semibold text-3xl pb-8">
            {formatDuration({
              started_at: activity?.started_at,
              ended_at: activity?.ended_at,
            })}
          </Text>
          {activity?.workout?.score?.kilojoule && (
            <>
              <Text className="font-inter-light text-base pb-2">
                {t("calories")}
              </Text>
              <Text className="font-inter-semibold text-3xl">
                {Math.round(activity?.workout?.score?.kilojoule / 4.184)}
              </Text>
            </>
          )}
        </View>
        <View className="flex-1">
          <Text className="font-inter-light text-base pb-2">
            {t("feeling")}
          </Text>
        </View>
      </View>

      {activity?.workout?.score && (
        <AvgHeartRate
          averageHeartRate={activity?.workout?.score?.average_heart_rate}
          zone1Milli={activity?.workout?.score?.zoneDurations?.zone_one_milli}
          zone2Milli={activity?.workout?.score?.zoneDurations?.zone_two_milli}
          zone3Milli={activity?.workout?.score?.zoneDurations?.zone_three_milli}
          zone4Milli={activity?.workout?.score?.zoneDurations?.zone_four_milli}
          zone5Milli={activity?.workout?.score?.zoneDurations?.zone_five_milli}
        />
      )}
    </ParallaxScrollView>
  );
}
