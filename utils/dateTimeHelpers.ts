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

interface FormatTimeOptions {
  date: Date | string | number;
  includeHours?: boolean;
  includeMinutes?: boolean;
  includeSeconds?: boolean;
}
export function formatTime({
  date,
  includeHours = true,
  includeMinutes = true,
  includeSeconds = true,
}: FormatTimeOptions): string {
  const _date = new Date(date);
  const timeParts = [];
  if (includeHours) {
    timeParts.push(_date.getHours().toString().padStart(2, "0"));
  }
  if (includeMinutes) {
    timeParts.push(_date.getMinutes().toString().padStart(2, "0"));
  }
  if (includeSeconds) {
    timeParts.push(_date.getSeconds().toString().padStart(2, "0"));
  }

  return timeParts.join(":");
}

export function getSecondsInDay(date: Date): number {
  const _date = new Date(date);
  return (
    _date.getUTCHours() * 3600 +
    _date.getUTCMinutes() * 60 +
    _date.getUTCSeconds()
  );
}
