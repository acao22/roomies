import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "@env";
import { auth } from "../firebaseConfig"; // ✅ Import initialized auth
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const API_USER_BASE_URL = `${API_BASE_URL}/users`;

// get first name and last name from database
export const getUserInfo = async () => {
  const {uid, email, message} = await verifyUserSession();
  if (uid) {
    const response = await axios.post(`${API_USER_BASE_URL}/getInfo`, {
      uid
    });
    return response.data;
  }
}



// checking if a user is still logged in
export const verifyUserSession = async () => {
    const idToken = await AsyncStorage.getItem("idToken");
    if (!idToken) return null; // no session found

    try {
      const response = await axios.post(`${API_USER_BASE_URL}/verify`, {
        idToken, // this sends firebase ID token, not the custom token
      });
      return response.data; // { uid, email, message }
    } catch (error) {
      console.error("Session verification failed:", error.response?.data || error.message);
      return null;
    }
};


// register a new user
export const registerUser = async (email, password, firstName, lastName, displayName = "roomie") => {
    console.log(firstName, lastName, displayName);
    try {
      const response = await axios.post(
        `${API_USER_BASE_URL}/signup`,
        JSON.stringify({ email, password, displayName, firstName, lastName }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      console.log("Signup response:", response.data);

      // store firebase id token for session management
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // get firebase id token
      const idToken = await userCredential.user.getIdToken();
      await AsyncStorage.setItem("idToken", idToken);

      return response.data;
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error.message);
      throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // get firebase id token
      const idToken = await userCredential.user.getIdToken();

      // store firebase id token for session management
      await AsyncStorage.setItem("idToken", idToken);
  
      return { uid: userCredential.user.uid, idToken };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
};

export const logoutUser = async (setUser) => {
    try {
      console.log("Logging out...");
      await AsyncStorage.removeItem("idToken");
  
      const auth = getAuth();
      await signOut(auth);
  
      setUser(null);
  
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };