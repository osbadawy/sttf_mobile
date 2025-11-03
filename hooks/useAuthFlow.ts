import { useAuth } from "@/contexts/AuthContext";
import { Access, useUserProfile } from "@/hooks/useUserProfile";
import Constants from "expo-constants";
import { RelativePathString, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export interface AuthFlowData {
  display_name: string;
  avatar_url: string;
  access: "player" | "coach";
  whoop_user: boolean;
}

export function useAuthFlow() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setUserName, setProfilePicture, setAccess } = useUserProfile();
  const [data, setData] = useState<AuthFlowData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthData = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/auth`;
      // Force token refresh to ensure it's valid
      const token = await user.getIdToken(true);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response body:", errorText);
        throw new Error(
          `${response.status} ${response.statusText}: ${errorText}`,
        );
      }

      const responseData = await response.json();
      setData(responseData);

      // Automatically set user profile data
      setUserName(responseData.display_name || responseData.access);
      setProfilePicture(responseData.avatar_url || "");
      setAccess(responseData.access as Access);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch auth data";
      console.error("❌ Error getting user auth data:", err);
      console.error("🔍 Error details:", {
        name: err instanceof Error ? err.name : "Unknown",
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        url: `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/auth`,
        backendUrl: Constants.expoConfig?.extra?.BACKEND_URL,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, setUserName, setProfilePicture, setAccess]);

  // Handle routing based on authentication state and data
  useEffect(() => {
    // If no user, don't proceed (auth guard in _layout.tsx handles redirect)
    if (!user) {
      return;
    }

    // Wait for loading to complete
    if (loading || !data) {
      return;
    }

    // If there's an error, don't do any routing (just return error state)
    if (error) {
      console.error("❌ Error from useAuthFlow:", error);
      return;
    }

    console.log({ access: data.access, whoop_user: data.whoop_user });

    // Handle routing based on user access level
    if (data.access === "coach") {
      router.push("coach/dashboard" as RelativePathString);
      return;
    }

    if (data.access === "player" && data.whoop_user) {
      router.push("player/" as RelativePathString);
    } else {
      router.push("whoop-login" as RelativePathString);
    }
  }, [user, data, loading, error, router]);

  useEffect(() => {
    fetchAuthData();
  }, [fetchAuthData]);

  return {
    data,
    loading,
    error,
    refetch: fetchAuthData,
    logout,
  };
}
