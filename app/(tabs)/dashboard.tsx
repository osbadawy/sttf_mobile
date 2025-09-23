import {
  HeartSection,
  SleepSection,
  WellbeingSection,
} from "@/components/dashboard";
import { HeaderColor } from "@/components/Header";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/contexts/AuthContext";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

interface DashboardProps {
  user_id?: string;
}

export default function Dashboard({ user_id }: DashboardProps) {
  const { user } = useAuth();

  const useDateState = useState(new Date());
  const [date, setDate] = useDateState;

  const [name, setName] = useState("User");
  // TODO: Handle Default Profile Picture properly
  const [profilePicture, setProfilePicture] = useState<string>("");

  const [stress, setStress] = useState(0);
  const [strain, setStrain] = useState(0);
  const [performance, setPerformance] = useState(0);

  const [sleepScore, setSleepScore] = useState(0);
  const [sleepDurationMilli, setSleepDurationMilli] = useState(0);
  const [sleepNeededMilli, setSleepNeededMilli] = useState(0);

  const [restingHeartRate, setRestingHeartRate] = useState(0);
  const [maxHeartRate, setMaxHeartRate] = useState(0);
  const [dailyAvgHeartRate, setDailyAvgHeartRate] = useState(0);

  function extractFromData(data: any) {
    const cycles = data.whoop_user.cycles;
    const newestCycle = cycles.sort(
      (a: any, b: any) =>
        new Date(b.start).getTime() - new Date(a.start).getTime(),
    )[0];

    let _performance = 0;
    let _stress = 0;
    let _strain = 0;
    let _sleepScore = 0;
    let _sleepDurationMilli = 0;
    let _sleepNeededMilli = 0;
    let _restingHeartRate = 0;
    let _maxHeartRate = 0;
    let _dailyAvgHeartRate = 0;

    if (newestCycle) {
      _strain = newestCycle.score.strain / 21;
      _dailyAvgHeartRate = newestCycle.score.average_heart_rate;
      _maxHeartRate = newestCycle.score.max_heart_rate;

      if (newestCycle.recoveries.length > 0) {
        _stress = (100 - newestCycle.recoveries[0].score.recovery_score) / 100;
        _restingHeartRate = newestCycle.recoveries[0].score.resting_heart_rate;
      }

      if (newestCycle.sleeps.length > 0) {
        // Choose the sleep which lasts the longest (stop-start) and nap is false
        const longestSleep = newestCycle.sleeps
          .filter((sleep: any) => !sleep.nap) // Filter out naps
          .sort((a: any, b: any) => {
            const durationA =
              new Date(a.end).getTime() - new Date(a.start).getTime();
            const durationB =
              new Date(b.end).getTime() - new Date(b.start).getTime();
            return durationB - durationA; // Sort by duration descending
          })[0];

        _sleepScore = longestSleep.score.sleep_performance_percentage / 100;
        _sleepDurationMilli =
          longestSleep.score.stage_summary.total_in_bed_time_;
        _sleepNeededMilli = longestSleep.score.sleep_needed.baseline_milli;
      }
    }

    //TODO: Better performance metric
    if (_stress && _strain) {
      _performance = 1 - (_stress + _strain) / 2;
    }

    setPerformance(_performance);
    setStress(_stress);
    setStrain(_strain);
    setSleepScore(_sleepScore);
    setSleepDurationMilli(_sleepDurationMilli);
    setSleepNeededMilli(_sleepNeededMilli);
    setRestingHeartRate(_restingHeartRate);
    setMaxHeartRate(_maxHeartRate);
    setDailyAvgHeartRate(_dailyAvgHeartRate);
  }

  const props = {
    name: name,
    profilePicture: profilePicture,
    color: HeaderColor.BG,
    showDateSelector: true,
    useDateState: useDateState,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const params = new URLSearchParams({
            firebase_id: user_id || user.uid,
            day: date.toISOString(),
          });
          const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/app/day?${params}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });
          const data = await response.json();
          extractFromData(data);

          if (
            data.whoop_user &&
            data.whoop_user.first_name &&
            data.whoop_user.last_name
          ) {
            setName(
              `${data.whoop_user.first_name} ${data.whoop_user.last_name}`,
            );
          }
          if (data.avatar_url) {
            setProfilePicture(data.avatar_url);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [date, user]);

  return (
    <ParallaxScrollView headerProps={props}>
      <WellbeingSection
        performance={performance}
        strain={strain}
        stress={stress}
        animationDuration={1000}
      />
      <SleepSection
        sleepScore={sleepScore}
        sleepDurationMilli={sleepDurationMilli}
        sleepNeededMilli={sleepNeededMilli}
      />
      <HeartSection
        dailyAvg={dailyAvgHeartRate}
        max={maxHeartRate}
        resting={restingHeartRate}
      />
    </ParallaxScrollView>
  );
}
