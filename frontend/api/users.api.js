import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "@env";

const API_USER_BASE_URL = `${API_BASE_URL}/users`;


// checking if a user is still logged in
export const verifyUserSession = async () => {
    const customToken = await AsyncStorage.getItem("customToken");
    if (!customToken) return null; // no session found
  
    try {
      const response = await axios.post(`${API_USER_BASE_URL}/verify-token`, {
        customToken,
      });
      return response.data; // { uid, email, message }
    } catch (error) {
      console.error("Session verification failed:", error.response?.data || error.message);
      return null;
    }
  };


// register a new user
export const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_USER_BASE_URL}/signup`, userData, {
        headers: { "Content-Type": "application/json" },
      });
  
      // storing tokens for sessions
      if (response.data.customToken) {
        await AsyncStorage.setItem("customToken", response.data.customToken);
      }
  
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error.message);
      throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_USER_BASE_URL}/login`, { email, password });
  
      // storing token for sessions
      if (response.data.customToken) {
        await AsyncStorage.setItem("customToken", response.data.customToken);
        return response.data;
      }
  
      return null;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
};
