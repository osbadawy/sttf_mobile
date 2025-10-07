import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
// import { extractSingleDayMetricsFromData } from "@/utils/whoopMetrics";
import { Text } from "react-native";

export default function Dashboard() {
  const { userName, profilePicture } = useUserProfile();
  const [date, setDate] = useState(new Date());
  const { user } = useAuth();

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const params = new URLSearchParams({
            day: date.toISOString(),
          });
          const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/app/day/players?${params}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });
          const data = await response.json();
          console.log(data)
          setData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [date, user]);


  return (
    <ParallaxScrollView
      headerProps={{
        name: userName || "Coach",
        profilePicture: profilePicture || "",
        showDateSelector: false,
        showCalendarIcon: false,
      }}
    >
      {data && data.map((player) => {
        console.log(player.whoop_user);
        return (
        <Text>{player.display_name}</Text>
      )})}

      {/* <Text>Coach Dashboard!</Text> */}

    </ParallaxScrollView>
  );
}
