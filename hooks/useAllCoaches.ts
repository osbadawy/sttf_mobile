import Coach from "@/schemas/Coach";
import { useFetchUsers } from "./useFetchUsers";

interface UseAllCoachesReturn {
  coaches: Coach[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook that fetches all coaches
 * @param enabled - Whether to enable fetching (defaults to true)
 * @returns Object containing coaches array, loading state, error state, and refetch function
 */
export const useAllCoaches = (enabled: boolean = true): UseAllCoachesReturn => {
  const { data, loading, error, refetch } = useFetchUsers<Coach>(
    "/user/coaches",
    "coaches",
    enabled,
  );

  return {
    coaches: data,
    loading,
    error,
    refetch,
  };
};
