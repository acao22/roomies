import "dotenv/config";

export default () => ({
  expo: {
    name: "roomies",
    slug: "roomies",
    version: "1.0.0",
    owner: "nanyucao",
    ios: {
      bundleIdentifier: "com.nanyucao.roomies",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
    },
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseDatabaseUrl: process.env.FIREBASE_DATABASE_URL,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      eas: {
        projectId: "6f3998f8-ed0e-43ad-af01-0e4b8215d853",
      },
    },
  },
});
