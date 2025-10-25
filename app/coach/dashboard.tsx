import ParallaxScrollView from "@/components/ParallaxScrollView";
import FilterSortModal from "@/components/coach/FilterSortModal";
import PlayerCard, { Player } from "@/components/coach/PlayerCard";
import FilterIconLines from "@/components/icons/FilterIcon-lines";
import { useAllPlayers } from "@/hooks/useAllPlayers";
import { useUserProfile } from "@/hooks/useUserProfile";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const FALLBACK_PLAYERS: Player[] = [ 
  { id: "p1", firstName: "Joseph", lastName:"Kaspari", age: 23, readiness: 42, meal: false, workout: false, nationality: "SA", photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg" },
  { id: "p2", firstName: "Samuel", lastName:"Maédoc", age: 22, readiness: 71, meal: true, workout: true, nationality: "SA" ,photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg"}, 
  { id: "p3", firstName: "Chung ", lastName:"Burnett", age: 33, readiness: 90, meal: false, workout: true, nationality: "SA",photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg" }, 
  { id: "p4", firstName: "Lionel", lastName:"Scott",age: 27, readiness: 20, meal: true, workout: false, nationality: "SE" ,photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg"}, 
  { id: "p5", firstName: "Jamaal", lastName:"Miller", age: 33, readiness: 90, meal: true, workout: true, nationality: "QA" ,photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg"}, 
  { id: "p6", firstName: "Carroll", lastName:"Small", age: 27, readiness: 20, meal: false, workout: true, nationality: "EG",photoUrl: "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg" }, 
];

function categorize(players: Player[]) {
  const noPlan: Player[] = [];
  const noMeal: Player[] = [];
  const noWorkout: Player[] = [];
  const completed: Player[] = [];

  players.forEach((p) => {
    if (!p.meal && !p.workout) noPlan.push(p);
    else if (!p.meal) noMeal.push(p);
    else if (!p.workout) noWorkout.push(p);
    else completed.push(p);
  });

  return { noPlan, noMeal, noWorkout, completed };
}

function Section({
  title,
  colorClass,
  players,
  comparator,
}: {
  title: string;
  colorClass: string;
  players: Player[];
  comparator: (a: Player, b: Player) => number;
}) {
  const sorted = React.useMemo(() => {
    // clone before sorting to avoid mutating parent arrays
    return [...players].sort(comparator);
  }, [players, comparator]);

  return (
    <View className="mb-6">
      {/* Title + underline */}
      <View className="mb-3 px-1">
        <Text className={`font-semibold ${colorClass}`}>{title}</Text>
        <View className="mt-1 h-[1px] w-full bg-neutral-200" />
      </View>

      {/* Cards grid */}
      <View className="flex-row flex-wrap justify-between">
        {sorted.map((p) => (
          <PlayerCard key={p.id} p={p} />
        ))}
        {sorted.length === 0 && (
          <View className="w-full rounded-xl border border-dashed border-neutral-300 p-4 bg-white">
            <Text className="text-neutral-500">No players in this category.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

type SortBy = "Alphabetical" | "Age" | "Readiness";
type Order = "Ascending" | "Descending";

function sortPlayers(list: Player[], sortBy: SortBy, order: Order): Player[] {
  const dir = order === "Ascending" ? 1 : -1;
  const clone = [...list];

  clone.sort((a, b) => {
    let cmp = 0;
    if (sortBy === "Alphabetical") {
      const an = `${a.firstName} ${a.lastName}`.toLowerCase();
      const bn = `${b.firstName} ${b.lastName}`.toLowerCase();
      cmp = an.localeCompare(bn);
    } else if (sortBy === "Age") {
      cmp = (a.age ?? 0) - (b.age ?? 0);
    } else if (sortBy === "Readiness") {
      cmp = (a.readiness ?? 0) - (b.readiness ?? 0);
    }
    return cmp * dir;
  });

  return clone;
}

export default function Dashboard() {
  const { userName, profilePicture } = useUserProfile();
  const { players: fetchedPlayers, error } = useAllPlayers();
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("Alphabetical");
  const [order, setOrder] = useState<Order>("Ascending");

  const sourcePlayers: Player[] =
    Array.isArray(fetchedPlayers) && fetchedPlayers.length > 0
      ? (fetchedPlayers as unknown as Player[])
      : FALLBACK_PLAYERS;

  // Make the comparator depend on sort state
  const comparator = useCallback(
    (a: Player, b: Player) => {
      const dir = order === "Ascending" ? 1 : -1;

      if (sortBy === "Alphabetical") {
        const an = `${a.firstName} ${a.lastName}`.trim().toLowerCase();
        const bn = `${b.firstName} ${b.lastName}`.trim().toLowerCase();
        return an.localeCompare(bn) * dir;
      }
      if (sortBy === "Age") {
        return ((a.age ?? 0) - (b.age ?? 0)) * dir;
      }
      // Readiness
      return ((a.readiness ?? 0) - (b.readiness ?? 0)) * dir;
    },
    [sortBy, order]
  );

  // Categorize once (unsorted); each Section will sort its slice
  const { noPlan, noMeal, noWorkout, completed } = useMemo(
    () => categorize(sourcePlayers),
    [sourcePlayers]
  );

  const isEmpty = sourcePlayers.length === 0;

  return (
    <ParallaxScrollView
      headerProps={{
        name: userName || "Coach",
        profilePicture: profilePicture || "",
        showDateSelector: false,
        showCalendarIcon: false,
      }}
      error={Boolean(error)}
    >
      {/* Modal */}
      <FilterSortModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        initialSortBy={sortBy}
        initialOrder={order}
        onReset={() => {
          setSortBy("Alphabetical");
          setOrder("Ascending");
        }}
        onApply={(sb, ord) => {
          setSortBy(sb);
          setOrder(ord);
        }}
      />

      {isEmpty ? (
        // ... your empty state unchanged
        <View />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} className="px-4 pt-2">
          {/* Title row */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold">Your Players</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-row items-center rounded-xl bg-white px-3 py-2 shadow-sm"
                onPress={() => setModalOpen(true)}
              >
                <FilterIconLines />
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-xl bg-white px-3 py-2 shadow-sm"
                onPress={() => router.push("/coach/manage" as any)}
              >
                <Text className="font-medium">Manage</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sections — give each a key that changes with sort to force remount/re-layout */}
          <Section
            key={`noPlan-${sortBy}-${order}`}
            title="No Plan Assigned"
            colorClass="text-rose-600"
            players={noPlan}
            comparator={comparator}
          />
          <Section
            key={`noMeal-${sortBy}-${order}`}
            title="No Meal Plan"
            colorClass="text-amber-700"
            players={noMeal}
            comparator={comparator}
          />
          <Section
            key={`noWorkout-${sortBy}-${order}`}
            title="No Workout Plan"
            colorClass="text-emerald-700"
            players={noWorkout}
            comparator={comparator}
          />
          <Section
            key={`completed-${sortBy}-${order}`}
            title="Completed"
            colorClass="text-emerald-600"
            players={completed}
            comparator={comparator}
          />
        </ScrollView>
      )}
    </ParallaxScrollView>
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