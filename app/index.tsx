import CustomButton, { ButtonColor } from "@/components/Button";
import { BigLogo } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLocalization("error");
  const [disabled, setDisabled] = useState<boolean>(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  // Hook handles all authentication, profile setting, and routing logic
  const { loading, error, logout } = useAuthFlow();

  const handleLogout = async () => {
    try {
      setDisabled(true);
      await logout();
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
      console.error("Error logging out:", error);
    }
  };

  // Show loading while checking auth state
  if (user === undefined) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BigLogo />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If no user, show nothing (will redirect to login)
  if (!user) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        padding: 16,
      }}
    >
      <BigLogo />
      {loading && <ActivityIndicator size="large" />}
      {error && (
        <>
          <Text style={{ color: "red" }}>{t("unauthorizedMessage")}</Text>

          <CustomButton
            title={t("logout")}
            onPress={handleLogout}
            color={ButtonColor.red}
            disabled={disabled}
          />
        </>
      )}
    </View>
  );
}
