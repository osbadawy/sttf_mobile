import colors from "@/colors";
import { CheckIcon, FilterIcon } from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SelectionModal from "@/components/SelectionModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlannedActivities } from "@/hooks/activities/usePlannedActivities";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function PlayerPlannedActivitiesPage() {
  const { t } = useLocalization("components.activities.plan");
  const { t: tActivityCategories } = useLocalization(
    "components.activities.activityTypes.categories",
  );
  const { date: dateParam } = useLocalSearchParams();
  const dateState = useState(new Date((dateParam as string) || new Date()));
  const [date, setDate] = dateState;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const isToday = date.toDateString() === today.toDateString();

  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");
  const isCoachViewing = Object.keys(playerData).length > 0;

  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const { activities, loading, error } = usePlannedActivities({
    day: date,
    users_assigned: playerData.firebase_id
      ? [playerData.firebase_id]
      : undefined,
  });

  const { user } = useAuth();

  // Filter state
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  return (
    <>
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
        {loading && <ActivityIndicator size="large" color={colors.primary} />}

        <View className="flex-row items-center justify-between">
          <View>
            <Text className="effra-regular text-base">
              {categoryFilters
                .map((filter) => tActivityCategories(filter))
                .join(", ")}
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center py-4 px-0"
            onPress={() => setShowFilterDropdown(true)}
            style={{ gap: 8 }}
          >
            <Text className="effra-light text-base">{t("filter")}</Text>
            <FilterIcon />
          </TouchableOpacity>
        </View>

        {!loading &&
          !error &&
          user &&
          activities
            .filter((activity) => {
              // Apply category filter if any filters are selected
              if (categoryFilters.length > 0) {
                return categoryFilters.includes(activity.category);
              }
              return true;
            })
            .map((activity) => {
              const activityName = activity.is_custom
                ? activity.activity_type
                : tActivityTypes(activity.activity_type);
              const time = new Date(activity.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const activityAssignment = activity.players_assigned.find(
                (assignment) =>
                  assignment.assigned_to_user.firebase_id ===
                    playerData.firebase_id || user.uid,
              );
              const isCompleted = Boolean(
                activityAssignment && activityAssignment.completions.length > 0,
              );

              return (
                <LinearGradient
                  key={activity.id}
                  colors={
                    isCompleted ? ["white", "#D4FFEA"] : ["white", "white"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-[16px] border-2 border-[#B5BCBF] p-6"
                  style={{
                    overflow: "hidden",
                    opacity: 1,
                  }}
                >
                  <View
                    className="flex-row items-center justify-between border-b pb-4"
                    style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                  >
                    <View className="flex-row items-center" style={{ gap: 16 }}>
                      <DynamicActivityIcon
                        activityType={activity.activity_type}
                      />
                      <Text className="effra-medium text-base">
                        {activityName} · {time}
                      </Text>
                    </View>
                    {isToday && !isCoachViewing && !isCompleted && (
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
                          backgroundColor: isCompleted
                            ? colors.primary
                            : "white",
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

      {showFilterDropdown && (
        <SelectionModal
          title={t("filter")}
          uniqueItems={[
            {
              name: tActivityCategories("technical"),
              value: "technical",
              icon: <DynamicActivityIcon activityType="technical" />,
            },
            {
              name: tActivityCategories("strength"),
              value: "strength",
              icon: <DynamicActivityIcon activityType="strength" />,
            },
            {
              name: tActivityCategories("recovery"),
              value: "recovery",
              icon: <DynamicActivityIcon activityType="recovery" />,
            },
          ]}
          selectedItems={categoryFilters}
          setSelectedItems={setCategoryFilters}
          setShowSelectionModal={setShowFilterDropdown}
          outerColor="rgba(0, 0, 0, 0.2)"
          checkMark={true}
        />
      )}
    </>
  );
}
