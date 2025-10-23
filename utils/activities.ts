export function seperateDataByDay(data: any): Record<number, any[]> {
  const date_seperated_data: Record<number, any[]> = {};

  for (const item of data) {
    const date = new Date(item.start);
    date.setHours(0, 0, 0, 0);
    const timestamp = date.getTime();
    if (date_seperated_data[timestamp] === undefined) {
      date_seperated_data[timestamp] = [];
    }
    date_seperated_data[timestamp].push(item);
  }
  return date_seperated_data;
}

export function formatDate(_date: Date, _locale: string = "en-US"): string {
  const date = new Date(_date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day_of_week = date.toLocaleDateString(_locale, { weekday: "short" });
  return `${day_of_week}, ${day}.${month}`;
}

export function formatDuration({
  started_at,
  ended_at,
  seconds,
}: {
  started_at?: string;
  ended_at?: string;
  seconds?: number;
}): string {
  if (seconds || (started_at && ended_at)) {
    const totalSeconds =
      seconds ||
      Math.floor(
        (new Date(ended_at || new Date()).getTime() -
          new Date(started_at || new Date()).getTime()) /
          1000,
      );
    return [
      Math.floor(totalSeconds / 3600),
      Math.floor((totalSeconds % 3600) / 60),
      totalSeconds % 60,
    ]
      .map((n) => n.toString().padStart(2, "0"))
      .join(":");
  }
  return "--:--:--";
}

export function getUniqueActivityTypes(data: Record<number, any[]>): string[] {
  const activityTypes = new Set<string>();
  for (const day of Object.values(data)) {
    for (const activity of day) {
      activityTypes.add(activity.sport_name);
    }
  }
  return Array.from(activityTypes);
}

export function getActivityTypesInCategory(category: string) {
  const strengthActivities = [
    "badminton",
    "basketball",
    "cycling",
    "elliptical",
    "functional-fitness",
    "hiking",
    "hiit",
    "jumping-rope",
    "pickleball",
    "pilates",
    "padel",
    "rowing",
    "running",
    "soccer",
    "squash",
    "swimming",
    "tennis",
    "volleyball",
    "weightlifting",
  ];
  const recoveryActivities = ["yoga"];

  if (category === "technical") {
    return [
      "warm-up",
      "serve",
      "recieve",
      "stroke-technique",
      "footwork",
      "pattern-play",
    ];
  } else if (category === "strength") {
    return [...strengthActivities, ...recoveryActivities];
  } else if (category === "recovery") {
    return [...recoveryActivities, ...strengthActivities];
  }
  return [];
}

export function getAllActivityTypes(): string[] {
  // Import the activity types JSON directly
  const activityTypes = require("@/locales/en/components/activities/ActivityTypes.json");
  return Object.keys(activityTypes)
    .filter((key) => key !== "categories")
    .sort();
}
