import Button, { ButtonColor } from "@/components/Button";
import { WhoopIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useEffect, useState } from "react";
import { ImageBackground, Text, View } from "react-native";

export default function WhoopLoginPage() {
  const { user } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { t } = useLocalization("login");

  useEffect(() => {
    const getAccessToken = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAccessToken(token);
          console.log("Firebase Access Token:", token);
        } catch (error) {
          console.error("Error getting access token:", error);
        }
      }
    };

    getAccessToken();
  }, [user]);

  return (
    <ImageBackground
    source={require("@/assets/images/logInImage.png")}
    className="flex-1 resize-cover"
    >
      <View className="flex h-full items-center justify-between py-16">
        <Text className="text-white text-3xl effra-semibold">{t("whoopTitle")}</Text>
        <View className="w-full items-center justify-center" style={{ gap: 32 }}>
          <WhoopIcon />
          <Button title={t("Connect")} onPress={() => {}} color={ButtonColor.primary} />
        </View>
        <View/>
      </View>
    </ImageBackground>
  );
}