export interface Player {
  firebase_id: string;
  email: string;
  avatar_url?: string | null;
  access?: string;
  birth_date?: Date | null;
  phone?: string | null;
  nationality?: string | null;
  display_name?: string | null;
  player_stats?: {
    dominant_hand?: "left" | "right" | null;
    win_rate?: string | null;
    matches_played?: number | null;
    serve_win_percentage?: string | null;
    third_ball_conversion_percentage?: string | null;
    receive_win_percentage?: string | null;
    height_cm?: number | null;
  } | null;
  whoop_user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
}
