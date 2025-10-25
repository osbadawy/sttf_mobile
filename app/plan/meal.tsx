import { FilterIcon, ThinPlusIcon } from "@/components/icons";
import Modal from "@/components/Modal";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CreateMealModal from "@/components/plan/meal/CreateMealModal";
import DeletionConfirmation from "@/components/plan/meal/DeletionConfirmation";
import PlannedMealItem from "@/components/plan/meal/PlannedMealItem";
import PlayersSelection from "@/components/plan/meal/PlayersSelection";
import SelectionModal from "@/components/SelectionModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlannedMeals } from "@/hooks/meals/usePlannedMeals";
import { Player, useAllPlayers } from "@/hooks/useAllPlayers";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import Constants from "expo-constants";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MealPlan() {
  const { t } = useLocalization("components.plan.meal");
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
  const [showCreateMealModal, setShowCreateMealModal] = useState(false);
  const [showPlayersSelection, setShowPlayersSelection] = useState(false);
  const [editingMeal, setEditingMeal] = useState<GetMealsResponse | null>(null);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState(false);
  const [mealToDelete, setMealToDelete] = useState<GetMealsResponse | null>(
    null,
  );
  const { user } = useAuth();

  // Fetch planned meals for the committed players and date
  const { meals, loading, error, refetch, clearCache } = usePlannedMeals({
    users_assigned: committedPlayers,
    day: date,
  });

  // Handle meal creation success
  const handleMealCreated = () => {
    refetch(); // Refetch will clear the specific cache entry and fetch fresh data
  };
  // Handle meal deletion
  const handleDeleteMeal = async () => {
    if (!user || !mealToDelete) {
      Alert.alert("Error", "User or meal not found");
      return;
    }

    try {
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/meal`;
      const body = {
        users_assigned: committedPlayers, // Use original committed players
        id: mealToDelete.id,
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
        throw new Error(`Failed to delete meal: ${errorData.message}`);
      }

      // Close modal and refresh meals
      setShowDeletionConfirmation(false);
      setShowCreateMealModal(false);
      setMealToDelete(null);
      refetch(); // Refetch will clear the specific cache entry and fetch fresh data
    } catch (error) {
      console.error("Error deleting meal", error);
      Alert.alert("Error", "Failed to delete meal");
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
        {/* Display planned meals */}
        {loading && (
          <View className="py-4">
            <Text className="text-center text-gray-500">Loading meals...</Text>
          </View>
        )}

        {!loading && !error && meals.length > 0 && (
          <View>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="effra-regular text-base">
                  {categoryFilters.map((filter) => t(filter)).join(", ")}
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
            {meals.map((meal: GetMealsResponse) => {
              if (
                categoryFilters.length > 0 &&
                !categoryFilters.includes(meal.category)
              ) {
                return null;
              }

              return (
                <PlannedMealItem
                  key={meal.id}
                  meal={meal}
                  isSelected={selectedMealId === meal.id}
                  onPress={(meal: GetMealsResponse) => {
                    setSelectedMealId(meal.id);
                    setEditingMeal(meal);
                    setShowCreateMealModal(true);
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
          onPress={() => setShowCreateMealModal(true)}
        >
          <View style={{ transform: [{ scale: 1.5 }] }}>
            <ThinPlusIcon color="#45575E" />
          </View>

          <Text className="effra-semibold text-xl text-[#45575E]">
            {t("addMeal")}
          </Text>
        </TouchableOpacity>
      </ParallaxScrollView>

      {showCreateMealModal && (
        <CreateMealModal
          onClose={() => {
            setEditingMeal(null);
            setSelectedMealId(null);
            setShowCreateMealModal(false);
          }}
          allPlayers={players as Player[]}
          originalSelectedPlayers={committedPlayers}
          user={user}
          onMealCreated={handleMealCreated}
          date={date}
          editingMeal={editingMeal}
          onDeleteMeal={(meal: GetMealsResponse) => {
            setMealToDelete(meal);
            setShowDeletionConfirmation(true);
          }}
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

      {showFilterDropdown && (
        <SelectionModal
          title={t("filter")}
          uniqueItems={[
            {
              name: t("breakfast"),
              value: "breakfast",
              icon: null, // TODO: Add meal category icons
            },
            {
              name: t("lunch"),
              value: "lunch",
              icon: null,
            },
            {
              name: t("dinner"),
              value: "dinner",
              icon: null,
            },
            {
              name: t("snack"),
              value: "snack",
              icon: null,
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
          setMealToDelete(null);
        }}
        onConfirm={handleDeleteMeal}
      />
    </>
  );
}
