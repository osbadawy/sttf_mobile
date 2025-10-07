import AverageHeartRateSection from "@/components/heart/AverageHeartRateSection";
import MaxAndRestingHeartRateSection from "@/components/heart/MaxAndRestingHeartRateSection";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlayerActivities } from "@/hooks/activities/usePlayerActivities";
import { MultiDayWhoopMetrics } from "@/schemas/whoop";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

function getAvgHrSectionData(
  activities: Record<number, any[]>,
  metrics: MultiDayWhoopMetrics,
) {
  //sort by key
  const sortedActivities = Object.entries(activities).sort(
    (a, b) => Number(a[0]) - Number(b[0]), // ascending order
  );

  const formattedActivities = [];

  for (const sortedActivity of sortedActivities) {
    if (
      sortedActivity[1] &&
      sortedActivity[1][0].workout &&
      sortedActivity[1][0].workout.score
    ) {
      const started_at = sortedActivity[1][0].started_at;
      const ended_at = sortedActivity[1][0].ended_at;
      const middle =
        new Date(started_at).getTime() +
        (new Date(ended_at).getTime() - new Date(started_at).getTime()) / 2;
      const date = new Date(middle);
      const hrv = getHrvForDay(metrics, date);

      formattedActivities.push({
        date: date,
        avg: sortedActivity[1][0].workout.score.average_heart_rate,
        hrv: hrv || 0,
      });
    }
  }

  return formattedActivities;
}

function getHrvForDay(metrics: MultiDayWhoopMetrics, day: Date) {
  // set day to 00:00:00
  const dateCopy = new Date(day);
  dateCopy.setUTCHours(0, 0, 0, 0);
  const dayString = dateCopy.toISOString();
  return metrics[dayString] ? metrics[dayString].hrv : 0;
}

export default function HeartPage() {
  const { t, isRTL } = useLocalization("components.dashboard.heartSection");
  const { user } = useAuth();

  const [metrics, setMetrics] = useState<MultiDayWhoopMetrics>({});

  const { data: activities14Days } = usePlayerActivities({
    initialDaysBack: 14,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const params = new URLSearchParams({
            firebase_id: user.uid,
            days: "14",
          });
          const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/app/days?${params}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });
          const data = await response.json();

          // Extract metrics from all cycles
          setMetrics(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user]);

  // // Create history data for MaxAndRestingHeartRateSection
  const sortedMetrics = Object.entries(metrics).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
  );
  const heartRateHistory = sortedMetrics.map((metric) => ({
    resting: Math.round(metric[1].restingHeartRate || 0),
    max: Math.round(metric[1].maxHeartRate || 0),
    day: metric[0],
  }));

  const avgHrSectionData = getAvgHrSectionData(activities14Days, metrics);

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("title"),
        showBackButton: true,
        showDateSelector: false,
        showBGImage: false,
        showCalendarIcon: false,
      }}
    >
      <AverageHeartRateSection data={avgHrSectionData} />
      <MaxAndRestingHeartRateSection history={heartRateHistory} />
    </ParallaxScrollView>
  );
}
