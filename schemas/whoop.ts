export interface SleepStageSummary {
  total_in_bed_time_milli: number;
  total_awake_time_milli: number;
  total_no_data_time_milli: number;
  total_light_sleep_time_milli: number;
  total_slow_wave_sleep_time_milli: number;
  total_rem_sleep_time_milli: number;
  sleep_cycle_count: number;
  disturbance_count: number;
}

export interface BasicWhoopMetrics {
  performance: number;
  stress: number;
  strain: number;
}

export interface Sleep {
  score: number;
  durationMilli: number;
  neededMilli: number;
  stage_summary: SleepStageSummary;
}

export interface Heart {
  resting: number;
  max: number;
  avg: number;
  hrv: number;
}

export interface WhoopMetrics {
  basic: BasicWhoopMetrics;
  sleep: Sleep;
  heart: Heart;
}

export interface MultiDayWhoopMetrics {
  [key: string]: WhoopMetrics;
}

export const exampleWhoopMetrics: WhoopMetrics = {
  basic: {
    performance: 0,
    stress: 0,
    strain: 0,
  },
  heart: {
    resting: 0,
    max: 0,
    avg: 0,
    hrv: 0,
  },
  sleep: {
    score: 0,
    durationMilli: 0,
    neededMilli: 0,
    stage_summary: {
      total_in_bed_time_milli: 0,
      total_awake_time_milli: 0,
      total_no_data_time_milli: 0,
      total_light_sleep_time_milli: 0,
      total_slow_wave_sleep_time_milli: 0,
      total_rem_sleep_time_milli: 0,
      sleep_cycle_count: 0,
      disturbance_count: 0,
    },
  },
};
