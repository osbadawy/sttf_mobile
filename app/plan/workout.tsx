import { ThinPlusIcon } from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CreateWorkoutModal from "@/components/plan/workout/CreateWorkoutModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlannedActivities } from "@/hooks/activities/usePlannedActivities";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function WorkoutPlan() {
  const { t } = useLocalization("components.plan.workout");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  // TODO: Get from params later
  const players = [
    "j3qvXziHUwbzVkKpR0OcG35axWV2",
    "oCK9lOmTSeZsx28W5E9QZJhe7Yy1",
  ];

  const dateState = useState(new Date());
  const [date, setDate] = dateState;
  const [showCreateWorkoutModal, setShowCreateWorkoutModal] = useState(false);
  const { user } = useAuth();

  // Fetch planned activities for the selected players and date
  const { activities, loading, error, refetch, clearCache } =
    usePlannedActivities({
      users_assigned: players,
      day: date,
    });

  // Handle activity creation success
  const handleActivityCreated = () => {
    clearCache(); // Clear cache to force refetch
    refetch(); // Refetch the activities
  };

  return (
    <ParallaxScrollView
      headerProps={
        showCreateWorkoutModal
          ? undefined
          : {
              title: t("title"),
              // customDescription: TODO: Made the players icons + title here,
              showBackButton: true,
              showBGImage: false,
              showCalendarIcon: false,
              showDateSelector: true,
              disableFutureDates: false,
              useDateState: dateState,
            }
      }
      showNav={false}
    >
      {/* Display planned activities */}
      {loading && (
        <View className="py-4">
          <Text className="text-center text-gray-500">
            Loading activities...
          </Text>
        </View>
      )}

      {error && (
        <View className="py-4">
          <Text className="text-center text-red-500">Error: {error}</Text>
        </View>
      )}

      {activities.length > 0 && (
        <View className="mb-4">
          {activities.map((activity) => {
            const date = new Date(activity.start);
            const time = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            const activityName = activity.is_custom
              ? activity.activity_type
              : tActivityTypes(activity.activity_type);

            // Get assigned players names
            const assignedPlayers = activity.players_assigned
              .filter(assignment => !assignment.removed_at) // Only show active assignments
              .map(assignment => assignment.assigned_to_user.display_name || 'Unknown Player')
              .join(', ');

            return (
              <View
                key={activity.id}
                className="bg-white border-2 border-[#B5BCBF] rounded-[16px] px-[24px] py-[20px] mb-3"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                <View>
                  <DynamicActivityIcon activityType={activity.activity_type} />

                  <View>
                    <Text>
                      {activityName} · {time}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity
        className="w-full border-[#B5BCBF] border-2 rounded-[16px] py-[30px] items-center justify-center flex-row"
        style={{
          gap: 12,
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          borderStyle: "dashed",
        }}
        onPress={() => setShowCreateWorkoutModal(true)}
      >
        <View style={{ transform: [{ scale: 1.5 }] }}>
          <ThinPlusIcon color="#45575E" />
        </View>

        <Text className="effra-semibold text-xl text-[#45575E]">
          {t("addActivity")}
        </Text>
      </TouchableOpacity>

      {showCreateWorkoutModal && (
        <CreateWorkoutModal
          onClose={() => setShowCreateWorkoutModal(false)}
          players={players}
          user={user}
          onActivityCreated={handleActivityCreated}
          date={date}
        />
      )}
    </ParallaxScrollView>
  );
}
