import ParallaxScrollView from "@/components/ParallaxScrollView";
import PlayerCard, { Player } from "@/components/coach/PlayerCard";
import FilterIcon from "@/components/icons/FilterIcon";
import { useAllPlayers } from "@/hooks/useAllPlayers";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
}: {
  title: string;
  colorClass: string;
  players: Player[];
}) {
  return (
    <View className="mb-6">
      {/* Title + underline */}
      <View className="mb-3 px-1">
        <Text className={`font-semibold ${colorClass}`}>{title}</Text>
        <View className="mt-1 h-[1px] w-full bg-neutral-200" />
      </View>

      {/* Cards grid */}
      <View className="flex-row flex-wrap justify-between">
        {players.map((p) => (
          <PlayerCard key={p.id} p={p} />
        ))}
        {players.length === 0 && (
          <View className="w-full rounded-xl border border-dashed border-neutral-300 p-4 bg-white">
            <Text className="text-neutral-500">No players in this category.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function Dashboard() {
  const { userName, profilePicture } = useUserProfile();
  const { players: fetchedPlayers, error } = useAllPlayers();
  const router = useRouter();

  const sourcePlayers: Player[] =
    Array.isArray(fetchedPlayers) && fetchedPlayers.length > 0
      ? (fetchedPlayers as unknown as Player[])
      : FALLBACK_PLAYERS;

  const { noPlan, noMeal, noWorkout, completed } = categorize(sourcePlayers);

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
      {isEmpty ? (
        // --- EMPTY STATE ---
        <View className="flex-1 justify-center items-center px-6">
          <Image
            source={require("../../assets/images/EmptyCoachSelector.png")}
            style={{ width: 160, height: 160, resizeMode: "contain", marginBottom: 16 }}
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
        // --- NORMAL STATE ---
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          className="px-4 pt-2"
        >
          {/* Title row */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold">Your Players</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity className="flex-row items-center rounded-xl bg-white px-3 py-2 shadow-sm">
                <FilterIcon/>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-xl bg-white px-3 py-2 shadow-sm"
                onPress={() => router.push("/coach/manage" as any)}
              >
                <Text className="font-medium">Manage</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sections */}
          <Section title="No Plan Assigned" colorClass="text-rose-600" players={noPlan} />
          <Section title="No Meal Plan" colorClass="text-amber-700" players={noMeal} />
          <Section title="No Workout Plan" colorClass="text-emerald-700" players={noWorkout} />
          <Section title="Completed" colorClass="text-emerald-600" players={completed} />
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