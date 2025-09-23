import Button, { ButtonColor } from "@/components/Button";
import { WhoopIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { RelativePathString, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ImageBackground, Text, View } from "react-native";

export default function WhoopLoginPage() {
  const { user } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [whoopUserExists, setWhoopUserExists] = useState<boolean | null>(null);
  const { t } = useLocalization("login");

  useEffect(() => {
    const getAccessToken = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAccessToken(token);

          const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/auth`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const wu = (await response.json()).whoop_user;
          if (wu) {
            setWhoopUserExists(true);
            router.push("(tabs)/dashboard" as RelativePathString);
          } else {
            setWhoopUserExists(false);
          }
        } catch (error) {
          console.error("Error getting access token:", error);
        }
      }
    };

    getAccessToken();
  }, [user]);

  const onPress = async () => {
    try {
      if (!accessToken) {
        console.error("No access token available");
        return;
      }

      const redirectURL = Linking.createURL("(tabs)/dashboard");
      const url = `${Constants.expoConfig?.extra?.API_URL}/whoop/auth/start?access_token=${accessToken}&redirect_url=${redirectURL}`;

      const result = await WebBrowser.openAuthSessionAsync(url, redirectURL, {
        showInRecents: false,
        preferEphemeralSession: true,
      });

    } catch (error) {
      console.error("Error during Whoop authentication:", error);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/logInImage.png")}
      className="flex-1 resize-cover"
    >
      <View className="flex h-full items-center justify-between py-16">
        <Text className="text-white text-3xl effra-semibold">
          {t("whoopTitle")}
        </Text>
        <View
          className="w-full items-center justify-center"
          style={{ gap: 32 }}
        >
          {accessToken && whoopUserExists === false && (
            <>
              <WhoopIcon />
              <Button
                title={t("Connect")}
                onPress={onPress}
                color={ButtonColor.primary}
              />
            </>
          )}
        </View>
        <View />
      </View>
    </ImageBackground>
  );
}
