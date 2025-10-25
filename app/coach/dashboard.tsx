import ParallaxScrollView from "@/components/ParallaxScrollView";
import ManageDoneButton from "@/components/coach/DoneButton";
import EditPlanPicker from "@/components/coach/EditPlanPicker";
import EmptyCoachDashboard from "@/components/coach/EmptyCoachDashboard";
import FilterSortModal from "@/components/coach/FilterSortModal";
import ManageButton from "@/components/coach/ManageButton";
import { Player } from "@/components/coach/PlayerCard";
import PlayerSection from "@/components/coach/PlayerSection";
import FilterIconLines from "@/components/icons/FilterIcon-lines";
import { useCategorizedPlayers } from "@/hooks/useCategorizedPlayers";
import { usePlayerSort } from "@/hooks/usePlayerSort";
import { useUserProfile } from "@/hooks/useUserProfile";
import { router, type RelativePathString } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FALLBACK_PLAYERS: Player[] = [
  { id: "p1", firstName: "Joseph", lastName: "Kaspari", age: 23, readiness: 42, meal: false, workout: false, nationality: "SA", photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg" },
  { id: "p2", firstName: "Samuel", lastName: "Maédoc", age: 22, readiness: 71, meal: true, workout: true, nationality: "SA", photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg" },
  { id: "p3", firstName: "Chung ", lastName: "Burnett", age: 33, readiness: 90, meal: false, workout: true, nationality: "SA", photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg" },
  { id: "p4", firstName: "Lionel", lastName: "Scott", age: 27, readiness: 20, meal: true, workout: false, nationality: "SE", photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg" },
  { id: "p5", firstName: "Jamaal", lastName: "Miller", age: 33, readiness: 90, meal: true, workout: true, nationality: "QA", photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg" },
  { id: "p6", firstName: "Carroll", lastName: "Small", age: 27, readiness: 20, meal: false, workout: true, nationality: "EG", photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg" },
];

export default function Dashboard() {
  const { userName, profilePicture } = useUserProfile();
  const [modalOpen, setModalOpen] = useState(false);
  const [managing, setManaging] = useState(false); 
  const insets = useSafeAreaInsets();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // sort/comparator
  const { sortBy, order, setSortBy, setOrder, comparator, reset } = usePlayerSort();

  // categorized groups (unsorted slices; each section sorts with comparator)
  const { noPlan, noMeal, noWorkout, completed } = useCategorizedPlayers(FALLBACK_PLAYERS);
  const isEmpty = FALLBACK_PLAYERS.length === 0;

  // leave space in scroll content so it doesn't hide behind the floating bar
  const bottomPad = useMemo(
    () => (managing ? insets.bottom + 110 : 24),
    [managing, insets.bottom]
  );

    const handlePlayerPress = (player: Player) => {
    // Normalize fields according to your mapping (#3)
    const firebase_id = (player as any).firebase_id ?? player.id;
    const display_name =
      (player as any).display_name ??
      [player.firstName, player.lastName].filter(Boolean).join(" ");
    const profile_picture =
      (player as any).display_picture ??
      (player as any).profile_picture ??
      player.photoUrl ??
      "";

    const path = "/player/dashboard";
    const params = {
      player: JSON.stringify({ firebase_id, display_name, profile_picture }),
    };

    router.push({ pathname: path as RelativePathString, params });
  };

  // Existing redirect (normal mode)
  const redirectToPlayer = (player: Player) => {
    const firebase_id = (player as any).firebase_id ?? player.id;
    const display_name =
      (player as any).display_name ??
      [player.firstName, player.lastName].filter(Boolean).join(" ");
    const profile_picture =
      (player as any).display_picture ??
      (player as any).profile_picture ??
      player.photoUrl ??
      "";

    const path = "/player/dashboard";
    const params = { player: JSON.stringify({ firebase_id, display_name, profile_picture }) };
    router.push({ pathname: path as RelativePathString, params });
  };

  // Unified press handler for cards
  const handleCardPress = (player: Player) => {
    const id = (player as any).firebase_id ?? player.id;

    if (managing) {
      // toggle selection (no redirect)
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
        error={false}
      >
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
              <Text className="text-xl font-bold">Your Players</Text>
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
          playerIds={selectedIds}              // <-- NEW: live selection
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




// --- IGNORE ---

      {/* {loading && (
        <View>
          <Text>Loading players...</Text>
        </View>
      )}
      {error && (
        <View>
          <Text>Error: {error}</Text>
        </View>
      )} 
      {players &&
        players.map((player) => {
          return (
            <View key={player.firebase_id}>
              <CustomButton
                title={player.display_name}
                onPress={() => {
                  const path = "/player/dashboard";
                  const params = {
                    player: JSON.stringify({
                      firebase_id: player.firebase_id,
                      display_name: player.display_name,
                      profile_picture: player.profile_picture,
                    }),
                  };
                  router.push({
                    pathname: path,
                    params: params,
                  });
                }}
                color={ButtonColor.primary}
              />
            </View>
          );
        })} */}