import CustomButton, { ButtonColor } from "@/components/Button";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAllPlayers } from "@/hooks/useAllPlayers";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function Dashboard() {
  const { userName, profilePicture } = useUserProfile();
  const { players, loading, error } = useAllPlayers();
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerProps={{
        name: userName || "Coach",
        profilePicture: profilePicture || "",
        showDateSelector: false,
        showCalendarIcon: false,
      }}
    >
      {loading && (
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
        })}
    </ParallaxScrollView>
  );
}
