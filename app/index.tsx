import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user } = useAuth();
  const { access } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // Redirect based on auth state
    if (user) {
      router.replace(`/whoop-login` as any);
    } else {
      router.replace("/login");
    }
  }, [user, access]);

  // Show loading while redirecting
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
