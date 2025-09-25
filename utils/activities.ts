export function seperateDataByDay(data: any) {
  const date_seperated_data: any[][] = [];
  let last_date = new Date();

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

export function formatDate(_date: Date, _locale: string = "en-US") {
  const date = new Date(_date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day_of_week = date.toLocaleDateString(_locale, { weekday: "short" });
  return `${day_of_week}, ${day}.${month}`;
}

export function formatDuration(started_at: string, ended_at: string): string {
  const totalSeconds = Math.floor(
    (new Date(ended_at).getTime() - new Date(started_at).getTime()) / 1000,
  );
  return [
    Math.floor(totalSeconds / 3600),
    Math.floor((totalSeconds % 3600) / 60),
    totalSeconds % 60,
  ]
    .map((n) => n.toString().padStart(2, "0"))
    .join(":");
}

export function getUniqueActivityTypes(data: any[][]) {
  const activityTypes = new Set<string>();
  for (const day of data) {
    for (const activity of day) {
      activityTypes.add(activity.activity_type);
    }
  }
  return Array.from(activityTypes);
}
