import colors from "@/colors";
import { CheckIcon } from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlannedActivities } from "@/hooks/activities/usePlannedActivities";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function PlayerPlannedActivitiesPage() {
  const { t } = useLocalization("components.activities.plan");
  const { date: dateParam } = useLocalSearchParams();
  const dateState = useState(new Date((dateParam as string) || new Date()));
  const [date, setDate] = dateState;

  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const { activities, loading, error } = usePlannedActivities({
    day: date,
  });

  const { user } = useAuth();

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("title"),
        showBackButton: true,
        showDateSelector: true,
        useDateState: dateState,
        customDescription: "",
        showCalendarIcon: false,
        disableFutureDates: false,
      }}
      error={!!error}
    >
      {loading && <Text>Loading...</Text>}
      {!loading &&
        !error &&
        user &&
        activities.map((activity) => {
          const activityName = activity.is_custom
            ? activity.activity_type
            : tActivityTypes(activity.activity_type);
          const time = new Date(activity.start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const activityAssignment = activity.players_assigned.find(
            (assignment) =>
              assignment.assigned_to_user.firebase_id === user.uid,
          );
          const isCompleted = activityAssignment?.performance !== null;

          // Check if activity is in the future
          const activityDate = new Date(activity.start);
          const currentDate = new Date();
          const isFutureActivity = activityDate > currentDate;

          return (
            <LinearGradient
              key={activity.id}
              colors={
                isCompleted
                  ? ["white", "#D4FFEA"]
                  : isFutureActivity
                    ? ["#F5F5F5", "#F5F5F5"]
                    : ["white", "white"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-[16px] border-2 border-[#B5BCBF] p-6"
              style={{
                overflow: "hidden",
                opacity: isFutureActivity ? 0.6 : 1,
              }}
            >
              <View
                className="flex-row items-center justify-between border-b pb-4"
                style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
              >
                <View className="flex-row items-center" style={{ gap: 16 }}>
                  <DynamicActivityIcon activityType={activity.activity_type} />
                  <Text className="effra-medium text-base">
                    {activityName} · {time}
                  </Text>
                </View>
                {!isFutureActivity && (
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname:
                          `/player/activities/plan/${activity.id}/self-assessment` as RelativePathString,
                        params: {
                          date: date.toISOString(),
                        },
                      });
                    }}
                    className="items-center justify-center border border-[#AAAAAA]"
                    style={{
                      backgroundColor: isCompleted ? colors.primary : "white",
                      borderWidth: isCompleted ? 0 : 1,
                      borderRadius: 6,
                      width: 26,
                      height: 26,
                    }}
                  >
                    {isCompleted && <CheckIcon fill={"white"} />}
                  </TouchableOpacity>
                )}
              </View>
              <View className="flex-row py-4 items-center">
                <Text
                  className="effra-regular flex-1 text-base"
                  style={{ opacity: 0.6 }}
                >
                  {activity.notes}
                </Text>
                {isCompleted && (
                  <Text className="effra-semibold text-xl text-primary">
                    {t("completed")}
                  </Text>
                )}
              </View>
            </LinearGradient>
          );
        })}
    </ParallaxScrollView>
  );
}
