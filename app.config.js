import 'dotenv/config';

export default {
  expo: {
    name: "your-app-name",
    slug: "your-app-slug",
    version: "1.0.0",
    extra: {
      FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    },
  },
};
