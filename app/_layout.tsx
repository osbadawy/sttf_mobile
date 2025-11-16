import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import "@/global.css";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import "@/i18n"; // Initialize i18n
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import { useEffect } from "react";

Sentry.init({
  dsn: Constants.expoConfig?.extra?.SENTRY_DSN,
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

function AppNavigator() {
  const { user } = useAuth();
  const { access } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect during initial auth check
    if (user === undefined) return;

    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is not logged in and trying to access protected routes
    if (!user && !isPublicRoute) {
      router.replace("/");
      return;
    }

    // Role-based access control: Only coaches can access /coach routes
    // Don't enforce role check if:
    // - access is undefined (still loading from storage)
    // - we're on index page (useAuthFlow handles routing based on role)
    if (
      user &&
      pathname.startsWith("/coach") &&
      pathname !== "/" &&
      access !== undefined &&
      access == "player"
    ) {
      router.replace("/");
    }
  }, [user, access, pathname, router]);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default Sentry.wrap(function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Effra: require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Rg.ttf"),
    "Effra-100": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Hair.ttf"),
    "Effra-100-italic": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_HairIt.ttf"),
    "Effra-200": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Th.ttf"),
    "Effra-200-italic": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_ThIt.ttf"),
    "Effra-300": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Lt.ttf"),
    "Effra-300-italic": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_LtIt.ttf"),
    "Effra-400": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Rg.ttf"),
    "Effra-400-italic": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_It.ttf"),
    "Effra-500": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Md.ttf"),
    "Effra-500-italic": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_MdIt.ttf"),
    "Effra-600": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_SBd.ttf"),
    "Effra-600-italic": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_SBdIt.ttf"),
    "Effra-700": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Bd.ttf"),
    "Effra-700-italic": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_BdIt.ttf"),
    "Effra-800": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_XBd.ttf"),
    "Effra-800-italic": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_XBdIt.ttf"),
    "Effra-900": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_Blk.ttf"),
    "Effra-900-italic": require("../assets/fonts/effra-trial-cufonfonts/Effra_Trial_BlkIt.ttf"),
    Inter: require("../assets/fonts/inter/Inter_18pt-Regular.ttf"),
    "Inter-100": require("../assets/fonts/inter/Inter_18pt-Thin.ttf"),
    "Inter-100-italic": require("../assets/fonts/inter/Inter_18pt-ThinItalic.ttf"),
    "Inter-200": require("../assets/fonts/inter/Inter_18pt-ExtraLight.ttf"),
    "Inter-200-italic": require("../assets/fonts/inter/Inter_18pt-ExtraLightItalic.ttf"),
    "Inter-300": require("../assets/fonts/inter/Inter_18pt-Light.ttf"),
    "Inter-300-italic": require("../assets/fonts/inter/Inter_18pt-LightItalic.ttf"),
    "Inter-400": require("../assets/fonts/inter/Inter_18pt-Regular.ttf"),
    "Inter-400-italic": require("../assets/fonts/inter/Inter_18pt-Italic.ttf"),
    "Inter-500": require("../assets/fonts/inter/Inter_18pt-Medium.ttf"),
    "Inter-500-italic": require("../assets/fonts/inter/Inter_18pt-MediumItalic.ttf"),
    "Inter-600": require("../assets/fonts/inter/Inter_18pt-SemiBold.ttf"),
    "Inter-600-italic": require("../assets/fonts/inter/Inter_18pt-SemiBoldItalic.ttf"),
    "Inter-700": require("../assets/fonts/inter/Inter_18pt-Bold.ttf"),
    "Inter-700-italic": require("../assets/fonts/inter/Inter_18pt-BoldItalic.ttf"),
    "Inter-800": require("../assets/fonts/inter/Inter_18pt-ExtraBold.ttf"),
    "Inter-800-italic": require("../assets/fonts/inter/Inter_18pt-ExtraBoldItalic.ttf"),
    "Inter-900": require("../assets/fonts/inter/Inter_18pt-Black.ttf"),
    "Inter-900-italic": require("../assets/fonts/inter/Inter_18pt-BlackItalic.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <LocalizationProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </LocalizationProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
});
