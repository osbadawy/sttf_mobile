import ParallaxScrollView from "@/components/ParallaxScrollView";
import FilterSortModal from "@/components/coach/FilterSortModal";
import { Player } from "@/components/coach/PlayerCard";
import PlayerSection from "@/components/coach/PlayerSection";
import FilterIconLines from "@/components/icons/FilterIcon-lines";
import { useCategorizedPlayers } from "@/hooks/useCategorizedPlayers";
import { usePlayerSort } from "@/hooks/usePlayerSort";
import { useUserProfile } from "@/hooks/useUserProfile";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const FALLBACK_PLAYERS: Player[] = [
  {
    id: "p1",
    firstName: "Joseph",
    lastName: "Kaspari",
    age: 23,
    readiness: 42,
    meal: false,
    workout: false,
    nationality: "SA",
    photoUrl:
      "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg",
  },
  {
    id: "p2",
    firstName: "Samuel",
    lastName: "Maédoc",
    age: 22,
    readiness: 71,
    meal: true,
    workout: true,
    nationality: "SA",
    photoUrl:
      "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg",
  },
  {
    id: "p3",
    firstName: "Chung ",
    lastName: "Burnett",
    age: 33,
    readiness: 90,
    meal: false,
    workout: true,
    nationality: "SA",
    photoUrl:
      "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg",
  },
  {
    id: "p4",
    firstName: "Lionel",
    lastName: "Scott",
    age: 27,
    readiness: 20,
    meal: true,
    workout: false,
    nationality: "SE",
    photoUrl:
      "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg",
  },
  {
    id: "p5",
    firstName: "Jamaal",
    lastName: "Miller",
    age: 33,
    readiness: 90,
    meal: true,
    workout: true,
    nationality: "QA",
    photoUrl:
      "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg",
  },
  {
    id: "p6",
    firstName: "Carroll",
    lastName: "Small",
    age: 27,
    readiness: 20,
    meal: false,
    workout: true,
    nationality: "EG",
    photoUrl:
      "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg",
  },
];

export default function Dashboard() {
  const { userName, profilePicture } = useUserProfile();
  const [modalOpen, setModalOpen] = useState(false);

  // sort state + comparator logic (modular hook)
  const { sortBy, order, setSortBy, setOrder, comparator, reset } =
    usePlayerSort();

  // categorize players into 4 groups
  const { noPlan, noMeal, noWorkout, completed } =
    useCategorizedPlayers(FALLBACK_PLAYERS);

  const isEmpty = FALLBACK_PLAYERS.length === 0;

  return (
    <ParallaxScrollView
      headerProps={{
        name: userName || "Coach",
        profilePicture: profilePicture || "",
        showDateSelector: false,
        showCalendarIcon: false,
      }}
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
        // EMPTY STATE
        <View className="flex-1 justify-center items-center px-6">
          <Image
            source={require("../../assets/images/EmptyCoachSelector.png")}
            style={{
              width: 160,
              height: 160,
              resizeMode: "contain",
              marginBottom: 16,
            }}
          />
          <Text className="text-center text-neutral-500 text-2xl font-semibold mb-12">
            Seems like nobody is home
          </Text>
          <View className="absolute bottom-8 w-full">
            <Text className="text-center text-sm text-gray-900">
              Ask your players to join the app
            </Text>
          </View>
        </View>
      ) : (
        // NORMAL STATE
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          className="px-4 pt-2"
        >
          {/* Title Row */}
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

          {/* Categorized Player Sections */}
          <PlayerSection
            key={`noPlan-${sortBy}-${order}`}
            title="No Plan Assigned"
            colorClass="text-rose-600"
            players={noPlan}
            comparator={comparator}
          />
          <PlayerSection
            key={`noMeal-${sortBy}-${order}`}
            title="No Meal Plan"
            colorClass="text-amber-700"
            players={noMeal}
            comparator={comparator}
          />
          <PlayerSection
            key={`noWorkout-${sortBy}-${order}`}
            title="No Workout Plan"
            colorClass="text-emerald-700"
            players={noWorkout}
            comparator={comparator}
          />
          <PlayerSection
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