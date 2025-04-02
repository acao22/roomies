import React, { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { db } from "../firebaseConfig.js";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { getUserGroup } from "../api/users.api";
import { formatDueDate } from "./TaskScreen.js";

export default function CalendarScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState("");
  const [eventsByDate, setEventsByDate] = useState({});

  useEffect(() => {
    let unsubscribe;
    async function fetchTasks() {
      try {
        const groupData = await getUserGroup();
        const groupId = groupData.id;
        const q = query(collection(db, "task"), where("groupId", "==", groupId));

        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const tasksByDate = {};
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const dueDate = data.date;

            if (dueDate) {
              if (!tasksByDate[dueDate]) {
                tasksByDate[dueDate] = [];
              }
              tasksByDate[dueDate].push({ id: doc.id, ...data });
            }
          });
          setEventsByDate(tasksByDate);
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Highlight dates with tasks
  const markedDates = Object.keys(eventsByDate).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: "#00B8B6",
      selected: date === selectedDate,
      selectedColor: "#00B8B6",
    };
    return acc;
  }, {});

  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = { selected: true, selectedColor: "#00B8B6" };
  }

  const tasksForSelectedDate = eventsByDate[selectedDate] || [];

  const renderTaskItem = ({ item }) => (
    <View
      className={`flex-row items-center ${
        item.status === "completed" ? "bg-gray-300" : "bg-blue-100"
      } rounded-lg p-4 mb-2 shadow-sm`}
    >
      <Ionicons
        name={item.status === "completed" ? "checkbox" : "square-outline"}
        size={24}
        color={item.status === "completed" ? "gray" : "#00B8B6"}
        className="mr-3"
      />
      <View className="flex-1">
        <Text className="text-lg font-bold">{item.title}</Text>
        <Text>{"formatDueDate(item.date)"}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Navigation Menu Button */}
      <View className="flex-row justify-start px-4 mt-2">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Calendar Component */}
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: "#00B8B6",
          todayTextColor: "#00B8B6",
          arrowColor: "#00B8B6",
        }}
      />

      {/* Task List for Selected Date */}
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-2 text-gray-800">
          Tasks for {selectedDate || "Selected Date"}
        </Text>
        {tasksForSelectedDate.length === 0 ? (
          <Text className="text-gray-500">No tasks for this day.</Text>
        ) : (
          <FlatList
            data={tasksForSelectedDate}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
}