import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const admin = require("firebase-admin");

let credentials;

// Prefer environment variable (Render, production)
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
} else {
  // Fallback to local file (for development)
  const path = require("path");
  const fs = require("fs");
  const serviceAccountPath = path.resolve("./serviceAccountKey.json");
  credentials = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
  console.log("Firebase Admin initialized successfully.");
}

// // Resolve path for Firebase service account
// const serviceAccountPath = path.resolve("./serviceAccountKey.json");
// const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// // Initialize Firebase Admin SDK
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
//   console.log("Firebase Admin initialized successfully.");
// }

// Firestore database reference
const db = admin.firestore();

// Firebase Auth reference (for creating/verifying users)
const auth = admin.auth();

export { admin, db, auth };
