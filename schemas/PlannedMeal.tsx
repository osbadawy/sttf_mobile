export interface MealResultsResponse {
  id: string;
  assignment_id: string;
  img_url: string | null;
  points_assigned: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: string;
  firebase_id: string;
  display_name: string;
  avatar_url: string;
}

export interface MealAssignmentResponse {
  id: string;
  meal_id: string;
  assigned_to: string;
  assigned_at: Date;
  removed_at: Date | null;
  assigned_to_user: UserResponse;
  performance: MealResultsResponse | null;
}

export interface MealRecurrenceResponse {
  id: string;
  meal_id: string;
  start: Date;
  end: Date;
  sun: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface GetMealsResponse {
  id: string;
  assigned_by: string;
  category: string;
  name: string;
  kilojoule: number;
  amount_unit: string;
  amount: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  is_planned: boolean;
  start: Date;
  created_at: Date;
  updated_at: Date;
  players_assigned: MealAssignmentResponse[];
  recurrence_patterns: MealRecurrenceResponse[];
}
