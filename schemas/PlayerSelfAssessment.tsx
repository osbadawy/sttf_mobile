export type SelfAssessmentType = "tiredness" | "readiness";
export const SelfAssessmentTypes = ["tiredness", "readiness"] as const;

export interface PlayerSelfAssessment {
  id: string; // UUID primary key
  player_stats_id: string; // UUID foreign key
  score?: number; // optional float
  assessment_type?: SelfAssessmentType; // 'tiredness' | 'readiness'
  points_assigned: number; // integer

  // Sequelize timestamps (from timestamps: true)
  createdAt: Date;
  updatedAt: Date;
}
