import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_DATABASE_URL, 
  FIREBASE_PROJECT_ID, 
  FIREBASE_STORAGE_BUCKET, 
  FIREBASE_MESSAGING_SENDER_ID, 
  FIREBASE_APP_ID, 
  FIREBASE_MEASUREMENT_ID 
} from "@env";

// ✅ Ensure Firebase is initialized only once
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase App if not already initialized
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Initialize Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };