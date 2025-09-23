export interface PerformanceDataPoint {
  date: string;
  value: number;
}

export interface MultiDayMetrics {
  performance: PerformanceDataPoint[];
  stress: number[];
  strain: number[];
  sleepScore: number[];
  sleepDurationMilli: number[];
  sleepNeededMilli: number[];
  restingHeartRate: number[];
  maxHeartRate: number[];
  dailyAvgHeartRate: number[];
  hrv: number[];
  workoutAverageHeartRate: PerformanceDataPoint[];
}

export interface SingleDayMetrics {
  performance: number;
  stress: number;
  strain: number;
  sleepScore: number;
  sleepDurationMilli: number;
  sleepNeededMilli: number;
  restingHeartRate: number;
  maxHeartRate: number;
  dailyAvgHeartRate: number;
  hrv: number;
  workoutAverageHeartRate: number;
}

/**
 * Extracts metrics from a single cycle (day) of Whoop data
 */
export function extractSingleDayMetrics(
  cycle: any,
  workouts: any[] = [],
): SingleDayMetrics {
  let performance = 0;
  let stress = 0;
  let strain = 0;
  let sleepScore = 0;
  let sleepDurationMilli = 0;
  let sleepNeededMilli = 0;
  let restingHeartRate = 0;
  let maxHeartRate = 0;
  let dailyAvgHeartRate = 0;
  let hrv = 0;
  let workoutAverageHeartRate = 0;

  if (cycle) {
    strain = cycle.score.strain / 21;
    dailyAvgHeartRate = cycle.score.average_heart_rate;
    maxHeartRate = cycle.score.max_heart_rate;

    if (cycle.recoveries.length > 0) {
      stress = (100 - cycle.recoveries[0].score.recovery_score) / 100;
      restingHeartRate = cycle.recoveries[0].score.resting_heart_rate;
      hrv = cycle.recoveries[0].score.hrv_rmssd_milli || 0;
    }

    if (cycle.sleeps.length > 0) {
      // Choose the sleep which lasts the longest (stop-start) and nap is false
      const longestSleep = cycle.sleeps
        .filter((sleep: any) => !sleep.nap) // Filter out naps
        .sort((a: any, b: any) => {
          const durationA =
            new Date(a.end).getTime() - new Date(a.start).getTime();
          const durationB =
            new Date(b.end).getTime() - new Date(b.start).getTime();
          return durationB - durationA; // Sort by duration descending
        })[0];

      if (longestSleep) {
        sleepScore = longestSleep.score.sleep_performance_percentage / 100;
        sleepDurationMilli =
          longestSleep.score.stage_summary.total_in_bed_time_;
        sleepNeededMilli = longestSleep.score.sleep_needed.baseline_milli;
      }
    }
  }

  // Extract workout average heart rate for this cycle
  if (workouts && workouts.length > 0) {
    const cycleStart = new Date(cycle.start);
    const cycleEnd = new Date(
      cycle.end || cycleStart.getTime() + 24 * 60 * 60 * 1000,
    ); // Add 24 hours if no end date

    const cycleWorkouts = workouts.filter((workout: any) => {
      const workoutStart = new Date(workout.start);
      return workoutStart >= cycleStart && workoutStart < cycleEnd;
    });

    if (cycleWorkouts.length > 0) {
      // Calculate average heart rate across all workouts in this cycle
      const totalHeartRate = cycleWorkouts.reduce(
        (sum: number, workout: any) => {
          return sum + (workout.score?.average_heart_rate || 0);
        },
        0,
      );
      workoutAverageHeartRate = totalHeartRate / cycleWorkouts.length;
    }
  }

  // Calculate performance metric
  if (stress && strain) {
    performance = 1 - (stress + strain) / 2;
  }

  return {
    performance,
    stress,
    strain,
    sleepScore,
    sleepDurationMilli,
    sleepNeededMilli,
    restingHeartRate,
    maxHeartRate,
    dailyAvgHeartRate,
    hrv,
    workoutAverageHeartRate,
  };
}

/**
 * Extracts multi-day metrics from all cycles in Whoop data
 * Returns metrics for multiple days with performance data points
 */
export function extractMultiDayMetricsFromData(data: any): MultiDayMetrics {
  console.log("Extracting metrics from data:");
  const cycles = data.whoop_user.cycles;
  const workouts = data.whoop_user.workouts;
  console.log("Number of cycles:", cycles?.length);
  console.log("Number of workouts:", workouts?.length);

  console.log("Workouts:", workouts);

  // Sort cycles by start date (newest first)
  const sortedCycles = cycles.sort(
    (a: any, b: any) =>
      new Date(b.start).getTime() - new Date(a.start).getTime(),
  );

  const performance: PerformanceDataPoint[] = [];
  const stress: number[] = [];
  const strain: number[] = [];
  const sleepScore: number[] = [];
  const sleepDurationMilli: number[] = [];
  const sleepNeededMilli: number[] = [];
  const restingHeartRate: number[] = [];
  const maxHeartRate: number[] = [];
  const dailyAvgHeartRate: number[] = [];
  const hrv: number[] = [];
  const workoutAverageHeartRate: PerformanceDataPoint[] = [];

  sortedCycles.forEach((cycle: any, index: number) => {
    const metrics = extractSingleDayMetrics(cycle, workouts);

    performance.push({
      date: new Date(cycle.start).toLocaleDateString("en-US", {
        day: "2-digit",
      }),
      value: metrics.performance,
    });
    stress.push(metrics.stress);
    strain.push(metrics.strain);
    sleepScore.push(metrics.sleepScore);
    sleepDurationMilli.push(metrics.sleepDurationMilli);
    sleepNeededMilli.push(metrics.sleepNeededMilli);
    restingHeartRate.push(metrics.restingHeartRate);
    maxHeartRate.push(metrics.maxHeartRate);
    dailyAvgHeartRate.push(metrics.dailyAvgHeartRate);
    hrv.push(metrics.hrv);
    workoutAverageHeartRate.push({
      date: new Date(cycle.start).toISOString(),
      value: metrics.workoutAverageHeartRate,
    });
  });

  const result = {
    performance,
    stress,
    strain,
    sleepScore,
    sleepDurationMilli,
    sleepNeededMilli,
    restingHeartRate,
    maxHeartRate,
    dailyAvgHeartRate,
    hrv,
    workoutAverageHeartRate,
  };

  return result;
}

/**
 * Extracts metrics for a single day from Whoop data
 * Returns the most recent cycle's metrics
 */
export function extractSingleDayMetricsFromData(data: any): SingleDayMetrics {
  const cycles = data.whoop_user.cycles;
  const workouts = data.whoop_user.workouts;
  const newestCycle = cycles.sort(
    (a: any, b: any) =>
      new Date(b.start).getTime() - new Date(a.start).getTime(),
  )[0];

  return extractSingleDayMetrics(newestCycle, workouts);
}
