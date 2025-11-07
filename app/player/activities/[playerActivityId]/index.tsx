import AvgHeartRate from "@/components/activities/AvgHeartRate";
import WorkoutPointsCircle from "@/components/activities/FeelingCircle";
import { StrainIcon } from "@/components/icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { StrainSectionLine } from "@/components/wellbeing/StrainSection";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlayerActivities } from "@/hooks/activities/usePlayerActivities";
import { useSinglePlayerActivity } from "@/hooks/activities/useSinglePlayerActivity";
import { formatDate, formatDuration } from "@/utils/dateTimeHelpers";
import { useLocalSearchParams, usePathname } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

export default function ViewActivityPage() {
  const { user } = useAuth();
  const { playerActivityId, player } = useLocalSearchParams();
  const playerActivityIdString = Array.isArray(playerActivityId)
    ? playerActivityId[0]
    : playerActivityId;

  const playerData = useMemo(
    () => JSON.parse((player as string) || "{}"),
    [player],
  );

  let pathname = usePathname();
  pathname = pathname.split("/").slice(0, -1).join("/");

  const useDateState = useState(new Date());
  const { t, isRTL } = useLocalization("components.activities.activityView");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const {
    data: activities14Days,
    loading,
    error,
  } = usePlayerActivities({
    user_id: playerData.firebase_id || user?.uid || undefined,
    initialDaysBack: 14,
  });

  const {
    activity,
    loading: activityLoading,
    error: activityError,
  } = useSinglePlayerActivity({
    playerActivityId: playerActivityIdString || "",
  });

  if (loading || activityLoading) {
    return <View />;
  }

  // Safety check: if no activity and there's an error, show error state
  if (!activity && (error || activityError)) {
    console.error("Failed to load activity:", { error, activityError });
  }

  const strainToday = activity?.score?.strain;

  let strain14Days: number | undefined = 0;
  let strain14DaysCount = 0;
  try {
    for (const activity of Object.values(activities14Days || {}).flat()) {
      if (
        activity?.score?.strain &&
        typeof activity.score.strain === "number"
      ) {
        strain14Days += activity.score.strain;
        strain14DaysCount++;
      }
    }
  } catch (e) {
    console.error("Error calculating 14-day strain:", e);
  }
  strain14Days =
    strain14DaysCount > 0 ? strain14Days / strain14DaysCount : undefined;

  const textClassNameSmall = "font-inter-light text-base pb-2";
  const textClassNameLarge = "font-inter-regular text-2xl pb-2";
  let textClassName = activity ? textClassNameSmall : textClassNameLarge;
  textClassName = `${textClassName} ${isRTL ? "text-right" : "text-left"}`;

  return (
    <ParallaxScrollView
      headerProps={{
        title: activity?.sport_name
          ? tActivityTypes(activity.sport_name)
          : "--",
        customDescription: activity?.start
          ? formatDate(new Date(activity.start))
          : "--",
        useDateState: useDateState,
        showCalendarIcon: false,
        showBackButton: true,
      }}
      error={Boolean(error) || Boolean(activityError)}
    >
      <View
        className={`pb-[100px] ${!activity ? "flex-col gap-20" : isRTL ? "flex-row-reverse" : "flex-row"}`}
      >
        <View className="flex-1">
          <Text className={textClassName}>{t("duration")}</Text>
          <Text
            className={`font-inter-semibold pb-8 ${activity ? "text-3xl" : "text-4xl"} ${isRTL ? "text-right" : "text-left"}`}
          >
            {formatDuration({
              started_at: activity?.start,
              ended_at: activity?.end,
            })}
          </Text>
          {activity?.score?.kilojoule && (
            <>
              <Text className={textClassName}>{t("calories")}</Text>
              <Text
                className={`font-inter-semibold text-3xl ${isRTL ? "text-right" : "text-left"}`}
              >
                {Math.round(activity?.score?.kilojoule / 4.184)}
              </Text>
            </>
          )}
        </View>
        <View>
          <Text className={textClassName}>{t("score")}</Text>
          <WorkoutPointsCircle score={activity?.points || 20} maxScore={40} />
        </View>
      </View>

      {activity?.score && (
        <AvgHeartRate
          averageHeartRate={activity?.score?.average_heart_rate || 0}
          zone1Milli={activity?.score?.zoneDurations?.zone_one_milli || 0}
          zone2Milli={activity?.score?.zoneDurations?.zone_two_milli || 0}
          zone3Milli={activity?.score?.zoneDurations?.zone_three_milli || 0}
          zone4Milli={activity?.score?.zoneDurations?.zone_four_milli || 0}
          zone5Milli={activity?.score?.zoneDurations?.zone_five_milli || 0}
        />
      )}

      {activity?.score && (
        <View
          className={`pt-[64px] ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          <View className="w-[30px] items-center">
            <StrainIcon />
          </View>
          <View className={`flex-1 ${isRTL ? "pl-[30px]" : "pr-[30px]"}`}>
            <Text
              className={`effra-medium text-2xl pb-10 pl-1 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t("strainTitle")}
            </Text>

            <View
              className={`flex-row justify-between pb-[32px] ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            >
              {strainToday && (
                <View className={`flex ${isRTL ? "items-end" : "items-start"}`}>
                  <Text className="font-inter-light text-xs pb-3">
                    {t("thisWorkout")}
                  </Text>
                  <Text className="font-inter-semibold text-5xl text-strain">
                    {strainToday.toFixed(1)}
                  </Text>
                </View>
              )}

              {strain14Days && (
                <View className={`flex ${isRTL ? "items-end" : "items-start"}`}>
                  <Text className="font-inter-light text-xs pb-3">
                    {t("workoutAverage")}
                  </Text>
                  <Text className="font-inter-semibold text-5xl text-[#4B4B4B]">
                    {strain14Days.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            {strainToday && strain14Days && (
              <StrainSectionLine
                p1StrainToday={strainToday}
                p2StrainToday={strain14Days}
                selectedPlayer={0}
                secondaryExists={false}
              />
            )}
          </View>
        </View>
      )}
    </ParallaxScrollView>
  );
}
