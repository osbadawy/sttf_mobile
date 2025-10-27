import ParallaxScrollView from "@/components/ParallaxScrollView";
import ManageDoneButton from "@/components/coach/DoneButton";
import EditPlanPicker from "@/components/coach/EditPlanPicker";
import EmptyCoachDashboard from "@/components/coach/EmptyCoachDashboard";
import FilterSortModal from "@/components/coach/FilterSortModal";
import ManageButton from "@/components/coach/ManageButton";
import { CoachDashboardPlayer } from "@/components/coach/PlayerCard";
import PlayerSection from "@/components/coach/PlayerSection";
import FilterIconLines from "@/components/icons/FilterIcon-lines";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useCategorizedPlayers } from "@/hooks/useCategorizedPlayers";
import { usePlayerSort } from "@/hooks/usePlayerSort";
import { useUserProfile } from "@/hooks/useUserProfile";
import { router, type RelativePathString } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Dashboard() {
  const { t } = useLocalization("components.coach.coachDashboard");
  const { userName, profilePicture } = useUserProfile();
  const [modalOpen, setModalOpen] = useState(false);
  const [managing, setManaging] = useState(false);
  const insets = useSafeAreaInsets();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // sort/comparator
  const { sortBy, order, setSortBy, setOrder, comparator, reset } =
    usePlayerSort();

  // categorized groups (unsorted slices; each section sorts with comparator)
  const { players, noPlan, noMeal, noWorkout, completed, loading, error } =
    useCategorizedPlayers();
  const isEmpty = players.length === 0;

  // leave space in scroll content so it doesn't hide behind the floating bar
  const bottomPad = useMemo(
    () => (managing ? insets.bottom + 110 : 24),
    [managing, insets.bottom],
  );

  // Existing redirect (normal mode)
  const redirectToPlayer = (player: CoachDashboardPlayer) => {
    const firebase_id = player.id!;
    const display_name = player.display_name;
    const profile_picture = player.photo_url;

    const path = "/player/dashboard";
    const params = {
      player: JSON.stringify({ firebase_id, display_name, profile_picture }),
    };
    router.push({ pathname: path as RelativePathString, params });
  };

  // Unified press handler for cards
  const handleCardPress = (player: CoachDashboardPlayer) => {
    const id = player.id!;

    if (managing) {
      // toggle selection (no redirect)
      setSelectedIds((prev) =>
        prev.includes(id!) ? prev.filter((x) => x !== id!) : [...prev, id!],
      );
      return;
    }

    // normal behavior → redirect
    redirectToPlayer(player);
  };

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerProps={{
          name: userName || "Coach",
          profilePicture: profilePicture || "",
          showDateSelector: false,
          showCalendarIcon: false,
        }}
        showNav={false}
        error={!!error}
      >
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {/* Filter Modal */}
        <FilterSortModal
          visible={modalOpen}
          onClose={() => setModalOpen(false)}
          initialSortBy={sortBy}
          initialOrder={order}
          onReset={reset}
          onApply={(sb, ord) => {
            setSortBy(sb);
            setOrder(ord);
          }}
        />

        {isEmpty ? (
          <EmptyCoachDashboard />
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingBottom: bottomPad }}
            className="px-4 pt-2"
          >
            {/* Title Row */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold">{t("your players")}</Text>
              <View className="flex-row gap-2">
                {/* Filter */}
                <TouchableOpacity
                  className="flex-row items-center rounded-xl bg-white px-3 py-2 shadow-sm"
                  onPress={() => setModalOpen(true)}
                >
                  <FilterIconLines />
                </TouchableOpacity>

                {/* Manage / Done toggle */}
                {!managing ? (
                  <ManageButton setManaging={setManaging} />
                ) : (
                  <ManageDoneButton setManaging={setManaging} />
                )}
              </View>
            </View>

            {/* Sections — now pass select state + press handler */}
            <PlayerSection
              key={`noPlan-${sortBy}-${order}`}
              title="No Plan Assigned"
              colorClass="text-rose-600"
              players={noPlan}
              comparator={comparator}
              onPlayerPress={handleCardPress}
              selectMode={managing}
              selectedIds={selectedIds}
            />
            <PlayerSection
              key={`noMeal-${sortBy}-${order}`}
              title="No Meal Plan"
              colorClass="text-amber-700"
              players={noMeal}
              comparator={comparator}
              onPlayerPress={handleCardPress}
              selectMode={managing}
              selectedIds={selectedIds}
            />
            <PlayerSection
              key={`noWorkout-${sortBy}-${order}`}
              title="No Workout Plan"
              colorClass="text-emerald-700"
              players={noWorkout}
              comparator={comparator}
              onPlayerPress={handleCardPress}
              selectMode={managing}
              selectedIds={selectedIds}
            />
            <PlayerSection
              key={`completed-${sortBy}-${order}`}
              title="Completed"
              colorClass="text-emerald-600"
              players={completed}
              comparator={comparator}
              onPlayerPress={handleCardPress}
              selectMode={managing}
              selectedIds={selectedIds}
            />
          </ScrollView>
        )}
      </ParallaxScrollView>

      {/* Screen-fixed EditPlanPicker (like a bottom nav bar) */}
      {managing && (
        <EditPlanPicker
          playerIds={selectedIds}
          insetBottom={insets.bottom}
          title={
            selectedIds.length
              ? `Edit Plan • ${selectedIds.length} selected`
              : "Edit Plan"
          }
        />
      )}
    </View>
  );
}
