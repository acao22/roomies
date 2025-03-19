import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Resolve path for Firebase service account
const serviceAccountPath = path.resolve("./serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully.");
}

// Firestore database reference
const db = admin.firestore();

// Firebase Auth reference (for creating/verifying users)
const auth = admin.auth();

export { admin, db, auth };