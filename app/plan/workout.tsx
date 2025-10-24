import { ThinPlusIcon } from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import Modal from "@/components/Modal";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CreateWorkoutModal from "@/components/plan/workout/CreateWorkoutModal";
import PlayersSelection from "@/components/plan/workout/PlayersSelection";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlannedActivities } from "@/hooks/activities/usePlannedActivities";
import { Player, useAllPlayers } from "@/hooks/useAllPlayers";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WorkoutPlan() {
  const { t } = useLocalization("components.plan.workout");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );
  const { players } = useAllPlayers();

  // TODO: Get from params later
  const originalSelectedPlayers = [
    "j3qvXziHUwbzVkKpR0OcG35axWV2",
    "oCK9lOmTSeZsx28W5E9QZJhe7Yy1",
  ];

  const [selectedPlayers, setSelectedPlayers] = useState(
    originalSelectedPlayers,
  );
  // Separate state for committed players that triggers the API call
  const [committedPlayers, setCommittedPlayers] = useState(
    originalSelectedPlayers,
  );

  const dateState = useState(new Date());
  const [date, setDate] = dateState;
  const [showCreateWorkoutModal, setShowCreateWorkoutModal] = useState(false);
  const [showPlayersSelection, setShowPlayersSelection] = useState(false);
  const { user } = useAuth();

  // Fetch planned activities for the committed players and date
  const { activities, loading, error, refetch, clearCache } =
    usePlannedActivities({
      users_assigned: committedPlayers,
      day: date,
    });

  // Handle activity creation success
  const handleActivityCreated = () => {
    clearCache(); // Clear cache to force refetch
    refetch(); // Refetch the activities
  };

  return (
    <>
      <ParallaxScrollView
        headerProps={{
          title: t("title"),
          showBackButton: true,
          showBGImage: false,
          showCalendarIcon: false,
          showDateSelector: true,
          disableFutureDates: false,
          useDateState: dateState,
          customDescription: (
            <TouchableOpacity onPress={() => setShowPlayersSelection(true)}>
              <Text className="effra-regular text-base text-primary">
                {committedPlayers.length} {t("players")}
              </Text>
            </TouchableOpacity>
          ),
        }}
        showNav={false}
        error={!!error}
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

              return (
                <View
                  key={activity.id}
                  className="bg-white border-2 border-[#B5BCBF] rounded-[16px] px-[24px] py-[20px] mb-3"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <View>
                    <DynamicActivityIcon
                      activityType={activity.activity_type}
                    />

                    <View>
                      <Text>
                        {activityName} · {time}
                      </Text>
                      <Text className="effra-regular text-base" style={{ opacity: 0.6 }}>{activity.players_assigned.length} {t("players")}</Text>
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
      </ParallaxScrollView>

      {showCreateWorkoutModal && (
        <CreateWorkoutModal
          onClose={() => setShowCreateWorkoutModal(false)}
          allPlayers={players as Player[]}
          originalSelectedPlayers={committedPlayers}
          user={user}
          onActivityCreated={handleActivityCreated}
          date={date}
        />
      )}

      {showPlayersSelection && (
        <Modal
          contentColor="#F8F9F2"
          outterColor="rgba(0, 0, 0, 0.2)"
          onClose={() => {
            // Commit the selected players and trigger API call
            setCommittedPlayers(selectedPlayers);
            setShowPlayersSelection(false);
          }}
          maxHeight={"80%"}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <PlayersSelection
              allPlayers={players as Player[]}
              selectedPlayers={selectedPlayers}
              onSelectPlayers={setSelectedPlayers}
              onClickBack={() => {
                // Commit the selected players and trigger API call
                setCommittedPlayers(selectedPlayers);
                setShowPlayersSelection(false);
              }}
            />
          </ScrollView>
        </Modal>
      )}
    </>
  );
}
