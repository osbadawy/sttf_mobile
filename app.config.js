import "dotenv/config";

export default {
  expo: {
    owner: "covelant-sttf",
    name: "STTF",
    slug: "sttf",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "sttfmobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "sa.gov.sttf.mobile",
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription:
          "Take photos of your meals to confirm them with your nutritionist and keep track of your eating habits.",
        NSPhotoLibraryUsageDescription:
          "The app uses your photo library access to allow you to choose a profile picture and to save or select photos of your meals for meal tracking and sharing with your nutritionist.",
      },
    },

    android: {
      package: "sa.gov.sttf.mobile", // 👈 ADD THIS (choose your final ID)
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      ["expo-web-browser", { experimentalLauncherActivity: true }],
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_Hair.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_HairIt.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_Th.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_ThIt.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_Lt.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_LtIt.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_Rg.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_It.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_Md.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_MdIt.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_SBd.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_SBdIt.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_Bd.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_BdIt.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_XBd.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_XBdIt.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_Blk.ttf",
            "./assets/fonts/effra-trial-cufonfonts/Effra_Trial_BlkIt.ttf",
            "./assets/fonts/effra-trial-cufonfonts/EffraVF_Trial_Wght.ttf",
            "./assets/fonts/effra-trial-cufonfonts/EffraVF_Trial_WghtItal.ttf",
            "./assets/fonts/inter/Inter_18pt-Regular.ttf",
            "./assets/fonts/inter/Inter_18pt-Italic.ttf",
            "./assets/fonts/inter/Inter_18pt-Thin.ttf",
            "./assets/fonts/inter/Inter_18pt-ThinItalic.ttf",
            "./assets/fonts/inter/Inter_18pt-ExtraLight.ttf",
            "./assets/fonts/inter/Inter_18pt-ExtraLightItalic.ttf",
            "./assets/fonts/inter/Inter_18pt-Light.ttf",
            "./assets/fonts/inter/Inter_18pt-LightItalic.ttf",
            "./assets/fonts/inter/Inter_18pt-Medium.ttf",
            "./assets/fonts/inter/Inter_18pt-MediumItalic.ttf",
            "./assets/fonts/inter/Inter_18pt-SemiBold.ttf",
            "./assets/fonts/inter/Inter_18pt-SemiBoldItalic.ttf",
            "./assets/fonts/inter/Inter_18pt-Bold.ttf",
            "./assets/fonts/inter/Inter_18pt-BoldItalic.ttf",
            "./assets/fonts/inter/Inter_18pt-ExtraBold.ttf",
            "./assets/fonts/inter/Inter_18pt-ExtraBoldItalic.ttf",
            "./assets/fonts/inter/Inter_18pt-Black.ttf",
            "./assets/fonts/inter/Inter_18pt-BlackItalic.ttf",
          ],
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#F8F9F2",
          dark: {
            backgroundColor: "#F8F9F2",
          },
          light: {
            backgroundColor: "#F8F9F2",
          },
        },
      ],
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "react-native",
          organization: "covelant",
        },
      ],
      [
        "expo-image-picker",
        {
          cameraPermission: "Take photos of your meals to confirm them with your nutritionist and keep track of your eating habits.",
          photosPermission:
            "The app uses your photo library access to allow you to choose a profile picture and to save or select photos of your meals for meal tracking and sharing with your nutritionist.",
        },
      ],
    ],
    experiments: { typedRoutes: true },
    extra: {
      eas: {
        projectId: "61951a4c-92d5-40b0-bdd4-73a1d43754ea",
      },

      FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
      API_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
      SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    },
  },
};
