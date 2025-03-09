import { auth } from "./firebaseConfig"; // Import initialized Firebase Auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// 🔹 Sign Up (Create User & Send to Backend)
export const registerUser = async (email, password, displayName) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Send user info to backend
    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });

    return await response.json();
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// 🔹 Login (Get Firebase ID Token & Send to Backend)
export const loginUser = async (email, password) => {
  try {
    // Sign in user in frontend (password verification must happen on frontend)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    // Send ID Token to backend for verification
    const response = await fetch("http://localhost:5000/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
