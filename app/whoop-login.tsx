import CustomButton, { ButtonColor } from "@/components/Button";
import { WhoopIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Access, useUserProfile } from "@/hooks/useUserProfile";
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
  const { setUserName, setProfilePicture, access, setAccess } =
    useUserProfile();

  useEffect(() => {
    const getAccessToken = async () => {
      if (user) {
        let token = null;
        try {
          token = await user.getIdToken();
          setAccessToken(token);
        } catch (error) {
          console.error("Error getting access token:", error);
        }

        if (token) {
          try {
            const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/auth`;
            console.log("🔍 Attempting to fetch whoop user from:", url);
            console.log(
              "🔑 Using access token (first 20 chars):",
              token.substring(0, 20) + "...",
            );

            const response = await fetch(url, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            console.log(
              "📡 Response status:",
              response.status,
              response.statusText,
            );

            if (response.status !== 200) {
              const errorText = await response.text();
              console.error("❌ Error response body:", errorText);
              throw new Error(
                `${response.status} ${response.statusText}: ${errorText}`,
              );
            }
            const data = await response.json();
            console.log("✅ Successfully fetched whoop user data");

            setUserName(data.display_name || data.access);
            setProfilePicture(data.avatar_url || "");
            setAccess(data.access as Access);

            if (data.access == "coach") {
              router.push("coach/dashboard" as RelativePathString);
              return;
            }

            if (data.access == "player" && data.whoop_user) {
              setWhoopUserExists(true);
              router.push("player/dashboard" as RelativePathString);
            } else {
              setWhoopUserExists(false);
            }
          } catch (error) {
            console.error("❌ Error getting whoop user:", error);
            console.error("🔍 Error details:", {
              name: error instanceof Error ? error.name : "Unknown",
              message: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
              url: `${Constants.expoConfig?.extra?.BACKEND_URL}/whoop/auth`,
              backendUrl: Constants.expoConfig?.extra?.BACKEND_URL,
            });
          }
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

      const redirectURL = Linking.createURL(`${access}/dashboard`);
      const url = `${Constants.expoConfig?.extra?.API_URL}/whoop/auth/start?access_token=${accessToken}&redirect_url=${redirectURL}`;

      await WebBrowser.openAuthSessionAsync(url, redirectURL, {
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
              <CustomButton
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
