import { HeaderColor } from "@/components/Header";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

function seperateDataByDay(data: any) {
  const date_seperated_data: any[][] = []
  let last_date = new Date()

  for (const item of data) {
    const date = new Date(item.started_at);
    date.setHours(0, 0, 0, 0);
    if (date < last_date) {
      last_date = date;
      date_seperated_data.push([]);
    }
    date_seperated_data[date_seperated_data.length - 1].push(item);
  }
  return date_seperated_data;

}

function formatDate(_date: Date, _locale: string = "en-US") {
  const date = new Date(_date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day_of_week = date.toLocaleDateString(_locale, { weekday: "short" });
  return `${day_of_week}, ${day}.${month}`;
}

interface ActivitiesPageProps {
  user_id?: string;
}

export default function ActivitiesPage({ user_id }: ActivitiesPageProps) {
  const { user } = useAuth();
  const { currentLanguage } = useLocalization();

  const useDateState = useState(new Date());
  const [date, setDate] = useDateState;
  const [data, setData] = useState<any[][]>([]);

  const props = {
    name: "User",
    color: HeaderColor.BG,
    showDateSelector: true,
    useDateState: useDateState,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // 14 days ago
          const startDate = new Date(date);
          startDate.setHours(0, 0, 0, 0);
          startDate.setDate(startDate.getDate() - 30);

          const params = new URLSearchParams({
            firebase_id: user_id || user.uid,
            start_date: startDate.toISOString(),
            end_date: date.toISOString(),
          });
          const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/player-activity?${params}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });
          const data = await response.json();
          setData(seperateDataByDay(data));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [date, user]);

  return (
    <ParallaxScrollView headerProps={props}>
      {data.map((day, index) => (
        <View key={index}>
          <Text>{formatDate(day[0].started_at, currentLanguage)}</Text>
          {day.map((item, index) => (
            <View key={index}>
              <Text>{item.started_at}</Text>
            </View>
          ))}
        </View>
      ))}
    </ParallaxScrollView>
  );
}
