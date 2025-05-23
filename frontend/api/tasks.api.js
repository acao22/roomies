import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "@env";
import { getAuth } from "firebase/auth";

const API_USER_BASE_URL = `${API_BASE_URL}/tasks`;

export const getAllTasks = async () => {
  try {
      const response = await axios.get(`${API_USER_BASE_URL}/getAllTasks`);
      console.log(response.data.documents);
      return response.data.documents;
  } catch (error) {
      console.error(error);
  }
};

// add assignedTo later
export const addTask = async (title, selectedIcon, date, time, members, recurrence, description, groupId, selectedPoints) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;
      await axios.post(`${API_USER_BASE_URL}/addTask`, 
        JSON.stringify({ 
          title, 
          selectedIcon, 
          date, 
          time, 
          members, 
          recurrence, 
          description, 
          createdAt: (new Date()).toISOString(), 
          createdBy: userId,
          updatedAt: (new Date()).toISOString(),
          groupId,
          selectedPoints
      }),
      {
        headers: { "Content-Type": "application/json" },
      });
      console.log(title, selectedIcon, date, time, members, recurrence, description, groupId);
  } catch (error) {
    console.error("SERVER-ERROR:", error.response?.data || error.message);
    throw error;
      
  }
};

export const updateTask = async (taskId, updatedData) => {
  try {
    const response = await axios.patch(
      `${API_USER_BASE_URL}/updateTask/${taskId}`,
      JSON.stringify(updatedData),
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_USER_BASE_URL}/deleteTask/${taskId}`);
    console.log("TASK DELETED:", response.data.message);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error.response?.data || error.message);
    throw error;
  }
};