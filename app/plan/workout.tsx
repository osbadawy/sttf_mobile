import { FilterIcon, ThinPlusIcon } from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import Modal from "@/components/Modal";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import PlayersSelection from "@/components/plan/PlayersSelection";
import CreateWorkoutModal from "@/components/plan/workout/CreateWorkoutModal";
import DeletionConfirmation from "@/components/plan/workout/DeletionConfirmation";
import PlannedActivityItem from "@/components/plan/workout/PlannedActivityItem";
import SelectionModal from "@/components/SelectionModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlannedActivities } from "@/hooks/activities/usePlannedActivities";
import { Player, useAllPlayers } from "@/hooks/useAllPlayers";
import { PlannedActivity } from "@/schemas/PlannedActivity";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WorkoutPlan() {
  const { t } = useLocalization("components.plan.workout");
  const { t: tActivityCategories } = useLocalization(
    "components.activities.activityTypes.categories",
  );
  const { players } = useAllPlayers();

  let localSearchParams = useLocalSearchParams();
  const originalSelectedPlayers = localSearchParams.players
    ? JSON.parse(localSearchParams.players as string)
    : [];

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
  const [editingActivity, setEditingActivity] =
    useState<PlannedActivity | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );
  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState(false);
  const [activityToDelete, setActivityToDelete] =
    useState<PlannedActivity | null>(null);
  const { user } = useAuth();

  // Fetch planned activities for the committed players and date
  const {
    activities,
    loading,
    error,
    refetch,
    clearCache,
    clearCacheForRecurringDays,
  } = usePlannedActivities({
    users_assigned: committedPlayers,
    day: date,
  });

  // Handle activity creation success
  const handleActivityCreated = () => {
    refetch(); // Refetch will clear the specific cache entry and fetch fresh data
  };
  // Handle activity deletion
  const handleDeleteActivity = async () => {
    if (!user || !activityToDelete) {
      Alert.alert("Error", "User or activity not found");
      return;
    }

    try {
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/planned-activity`;
      const body = {
        users_assigned: committedPlayers, // Use original committed players
        id: activityToDelete.id,
        day: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      };

      const token = await user.getIdToken();

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(`Failed to delete activity: ${errorData.message}`);
      }

      // Close modal and refresh activities
      setShowDeletionConfirmation(false);
      setShowCreateWorkoutModal(false);
      setActivityToDelete(null);
      refetch(); // Refetch will clear the specific cache entry and fetch fresh data
    } catch (error) {
      console.error("Error deleting activity", error);
      Alert.alert("Error", "Failed to delete activity");
    }
  };

  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  return (
    <>
      <ParallaxScrollView
        headerProps={{
          title: t("title"),
          showBackButton: true,
          showBGImage: false,
          showCalendarIcon: true,
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

        {!loading && !error && activities.length > 0 && (
          <View>
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
            {activities
              .sort((a: PlannedActivity, b: PlannedActivity) => {
                return (
                  new Date(a.start).getTime() - new Date(b.start).getTime()
                );
              })
              .map((activity: PlannedActivity) => {
                if (
                  categoryFilters.length > 0 &&
                  !categoryFilters.includes(activity.category)
                ) {
                  return null;
                }

                return (
                  <PlannedActivityItem
                    key={activity.id}
                    activity={activity}
                    isSelected={selectedActivityId === activity.id}
                    onPress={(activity) => {
                      setSelectedActivityId(activity.id);
                      setEditingActivity(activity);
                      setShowCreateWorkoutModal(true);
                    }}
                  />
                );
              })}
          </View>
        )}

        <TouchableOpacity
          className="w-full border-[#B5BCBF] border-2 rounded-[16px] py-[30px] items-center justify-center flex-row bg-white/50"
          style={{
            gap: 12,
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
          onClose={() => {
            setEditingActivity(null);
            setSelectedActivityId(null);
            setShowCreateWorkoutModal(false);
          }}
          allPlayers={players as Player[]}
          originalSelectedPlayers={committedPlayers}
          user={user}
          onActivityCreated={handleActivityCreated}
          date={date}
          editingActivity={editingActivity}
          onDeleteActivity={(activity) => {
            setActivityToDelete(activity);
            setShowDeletionConfirmation(true);
          }}
          clearCacheForRecurringDays={clearCacheForRecurringDays}
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
              t={t}
            />
          </ScrollView>
        </Modal>
      )}

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
        />
      )}

      <DeletionConfirmation
        isVisible={showDeletionConfirmation}
        onClose={() => {
          setShowDeletionConfirmation(false);
          setActivityToDelete(null);
        }}
        onConfirm={handleDeleteActivity}
      />
    </>
  );
}
