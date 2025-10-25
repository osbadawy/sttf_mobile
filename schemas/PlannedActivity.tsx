export interface PlannedActivityPerformance {
  id: string;
  assignment_id: string;
  self_assessment_score: number;
  points_assigned: number;
  created_at: Date;
  updated_at: Date;
}

export interface PlannedActivityPlayer {
  id: string;
  firebase_id: string;
  display_name?: string;
  avatar_url?: string;
}

export interface PlannedActivityAssignment {
  id: string;
  activity_id: string;
  assigned_to: string;
  assigned_at: Date;
  removed_at?: Date;
  created_at: Date;
  updated_at: Date;
  assigned_to_user: PlannedActivityPlayer;
  performance?: PlannedActivityPerformance;
}

export interface PlannedActivityRecurrence {
  id: string;
  planned_activity_id: string;
  start: Date;
  end: Date;
  sun?: boolean;
  mon?: boolean;
  tue?: boolean;
  wed?: boolean;
  thu?: boolean;
  fri?: boolean;
  sat?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PlannedActivity {
  id: string;
  assigned_by: string;
  category: "technical" | "strength" | "recovery";
  activity_type: string;
  is_custom: boolean;
  notes?: string;
  start: Date;
  created_at: Date;
  updated_at: Date;
  players_assigned: PlannedActivityAssignment[];
  recurrence_patterns: PlannedActivityRecurrence[];
}
