import CustomButton, { ButtonColor } from "@/components/Button";
import { WhoopIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ImageBackground, Text, View } from "react-native";

export default function WhoopLoginPage() {
  const { user } = useAuth();
  const { t } = useLocalization("login");

  const onPress = async () => {
    if (!user) {
      router.push("/");
      return;
    }
    const accessToken = await user.getIdToken();
    const redirectURL = Linking.createURL(`/`);
    const url = `${Constants.expoConfig?.extra?.API_URL}/whoop/auth/start?access_token=${accessToken}&redirect_url=${redirectURL}`;

    await WebBrowser.openAuthSessionAsync(url, redirectURL, {
      showInRecents: false,
      preferEphemeralSession: true,
    });
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
          <WhoopIcon />
          <CustomButton
            title={t("Connect")}
            onPress={onPress}
            color={ButtonColor.primary}
          />
        </View>
        <View />
      </View>
    </ImageBackground>
  );
}
