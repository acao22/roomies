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
} from "react-native";
import { db } from "../firebaseConfig.js";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { getUserGroup} from "../api/users.api";

export default function CalendarScreen({}) {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState("");
  const [eventsByDate, setEventsByDate] = useState({});
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
        //console.log(data);
        const dueDate = data.date;
        
        if (dueDate) {
          if (!tasksByDate[dueDate]) {
            tasksByDate[dueDate] = [];
          }
          tasksByDate[dueDate].push({ id: doc.id, title: data.title, status: data.status });
        }
      });
      setEventsByDate(tasksByDate);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

fetchTasks();

  const markedDates = {};
  Object.keys(eventsByDate).forEach((date) => {
    markedDates[date] = {
      marked: true,
      dotColor: "#00B8B6",
      selected: date === selectedDate,
      selectedColor: "#00B8B6",
    };
  });

  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: "#00B8B6",
    };
  }

  const eventsForSelectedDate = eventsByDate[selectedDate] || [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-start px-4 mt-2">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center">
        <Text className="text-2xl font-bold" style={{ color: "#00B8B6" }}>
          Calendar
        </Text>
      </View>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{ todayTextColor: "#00B8B6", arrowColor: "#00B8B6" }}
        style={{ margin: 10, borderRadius: 10, elevation: 2 }}
      />
      <View className="flex-1 px-4 pt-2">
        <Text className="text-lg font-bold text-gray-800 mb-2">
          Tasks on {selectedDate || "..."}
        </Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {eventsForSelectedDate.length === 0 ? (
          <Text className="italic text-gray-500">No tasks for this day</Text>
        ) : (
          eventsForSelectedDate.map((task) => (
            <View key={task.id} className="my-1">
              <Text 
                className={`text-base ${task.status === "completed" ? "text-green-600" : "text-gray-800"}`}
              >
                • {task.title} {task.status === "completed" ? "✓ (done)" : "(incomplete)"}
              </Text>
            </View>
          ))
        )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
