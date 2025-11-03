import CustomButton, { ButtonColor } from "@/components/Button";
import { BigLogo } from "@/components/icons";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  // Hook handles all authentication, profile setting, and routing logic
  const { loading, error, logout } = useAuthFlow();
  const { t } = useLocalization("error");
  const [disabled, setDisabled] = useState<boolean>(false);
  // Show loading while authentication and routing is in progress

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
