import React, { useState } from "react";
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
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";

//layout animation for android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default function CalendarScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState("");

  const [eventsByDate, setEventsByDate] = useState({
    "2025-02-21": [{ id: "1", title: "skibidi Party" }],
    "2025-02-22": [
      { id: "2", title: "heerroooo" },
      { id: "3", title: "meow" },
    ],
    "2025-02-25": [{ id: "4", title: "im bored" }],
  });

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
      {/* hamburger menu */}
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

      {/* calendar */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor: "#00B8B6",
          arrowColor: "#00B8B6",
        }}
        style={{ margin: 10, borderRadius: 10, elevation: 2 }}
      />

      {/* events */}
      <View className="flex-1 px-4 pt-2">
        <Text className="text-lg font-bold text-gray-800 mb-2">
          Events on {selectedDate || "..."}
        </Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {eventsForSelectedDate.length === 0 ? (
            <Text className="italic text-gray-500">No events for this day</Text>
          ) : (
            eventsForSelectedDate.map((event) => (
              <View key={event.id} className="my-1">
                <Text className="text-base text-gray-800">• {event.title}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
