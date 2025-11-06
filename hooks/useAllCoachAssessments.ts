import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import { useCallback, useState } from "react";

export interface CoachAssessmentForPlayer {
  id: string;
  firebase_id: string;
  player_stats_id: string;
  fitness_score: number;
  readiness_score: number;
  points_assigned: number;
  assigned_by: string;
  day: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerWithCoachAssessment {
  id: string;
  firebase_id: string;
  email: string;
  display_name: string | null;
  birth_date: Date | null;
  phone: string | null;
  nationality: string | null;
  access: "player";
  avatar_url: string | null;
  timezone: string | null;
  player_stats: {
    id: string;
    dominant_hand: string | null;
    win_rate: number | null;
    matches_played: number | null;
    serve_win_percentage: number | null;
    third_ball_conversion_percentage: number | null;
    receive_win_percentage: number | null;
    height_cm: number | null;
    coach_assessments: CoachAssessmentForPlayer[];
  };
}

export type GetCoachAssessmentsForAllPlayersOnDayResponse =
  PlayerWithCoachAssessment[];

export function useAllCoachAssessments() {
  const [coachAssessments, setCoachAssessments] =
    useState<GetCoachAssessmentsForAllPlayersOnDayResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const day = new Date().toISOString();
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/coach-assessment/day/all?day=${encodeURIComponent(day)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch assessments: ${response.status}`);
      }

      const data = await response.json();
      setCoachAssessments(data.data || data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching assessments";
      console.error("Error fetching assessments:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const clear = useCallback(() => {
    setCoachAssessments([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    coachAssessments,
    loading,
    error,
    refetch: fetchData,
    clear,
  };
}
