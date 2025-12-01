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
 * @returns Object containing coaches array, loading state, error state, and refetch function
 */
export const useAllCoaches = (): UseAllCoachesReturn => {
  const { data, loading, error, refetch } = useFetchUsers<Coach>(
    "/user/coaches",
    "coaches",
  );

  return {
    coaches: data,
    loading,
    error,
    refetch,
  };
};

