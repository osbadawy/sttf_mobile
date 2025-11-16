import ParallaxScrollView from "@/components/ParallaxScrollView";
import CoachAssessmentModal from "@/components/coach/CoachAssessmentModal";
import ManageDoneButton from "@/components/coach/DoneButton";
import EditPlanPicker from "@/components/coach/EditPlanPicker";
import EmptyCoachDashboard from "@/components/coach/EmptyCoachDashboard";
import FilterSortModal from "@/components/coach/FilterSortModal";
import ManageButton from "@/components/coach/ManageButton";
import { CoachDashboardPlayer } from "@/components/coach/PlayerCard";
import PlayerSection from "@/components/coach/PlayerSection";
import FilterIconLines from "@/components/icons/FilterIcon-lines";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAllCoachAssessments } from "@/hooks/useAllCoachAssessments";
import { useCategorizedPlayers } from "@/hooks/useCategorizedPlayers";
import { usePlayerSort } from "@/hooks/usePlayerSort";
import { useUserProfile } from "@/hooks/useUserProfile";
import { redirectToPlayerPage } from "@/utils/coachNavigation";
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

  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [assessmentModalPlayer, setAssessmentModalPlayer] = useState<{
    id: string;
    profilePicture: string;
    display_name: string;
  } | null>(null);

  // sort/comparator
  const { sortBy, order, setSortBy, setOrder, comparator, reset } =
    usePlayerSort();

  // categorized groups (unsorted slices; each section sorts with comparator)
  const { players, noPlan, noMeal, noWorkout, completed, loading, error } =
    useCategorizedPlayers();
  const isEmpty = players.length === 0;

  const {
    coachAssessments,
    loading: assessmentsLoading,
    error: assessmentsError,
    refetch: refetchAssessments,
  } = useAllCoachAssessments();

  // leave space in scroll content so it doesn't hide behind the floating bar
  const bottomPad = useMemo(
    () => (managing ? insets.bottom + 110 : 24),
    [managing, insets.bottom],
  );

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

    // Assessment modal
    const assessmentAlreadyMade = coachAssessments.some(
      (a) => a.firebase_id === id,
    );
    if (!assessmentAlreadyMade) {
      setShowAssessmentModal(true);
      setAssessmentModalPlayer({
        id,
        profilePicture: player.photo_url || "",
        display_name: player.display_name || "",
      });
      return;
    }

    // normal behavior → redirect
    redirectToPlayerPage(id, player.display_name || "", player.photo_url || "");
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
        error={!!error || !!assessmentsError}
      >
        {(loading || assessmentsLoading) && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
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
              coachAssessments={coachAssessments}
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
              coachAssessments={coachAssessments}
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
              coachAssessments={coachAssessments}
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
              coachAssessments={coachAssessments}
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

      {showAssessmentModal && assessmentModalPlayer && (
        <CoachAssessmentModal
          id={assessmentModalPlayer.id}
          profilePicture={assessmentModalPlayer.profilePicture}
          display_name={assessmentModalPlayer.display_name}
          onClose={() => {
            setShowAssessmentModal(false);
            setAssessmentModalPlayer(null);
          }}
          refetch={refetchAssessments}
        />
      )}
    </View>
  );
}
