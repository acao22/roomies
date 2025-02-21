import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const initialTasks = [
  {
    id: "1",
    title: "Take out trash",
    description: "take out the trash from the kitchen",
    status: "open",
    assignedTo: "angie",
    dueDate: "2025-02-20",
    pointValue: 10,
    recurring: "weekly",
    groupId: "group123",
  },
  {
    id: "2",
    title: "Wash dishes",
    description: "clean the dinner dishes!",
    status: "open",
    assignedTo: "luna",
    dueDate: "2025-02-25",
    pointValue: 5,
    recurring: "daily",
    groupId: "group123",
  },
  {
    id: "3",
    title: "Vacuum living room",
    description: "skibidi",
    status: "open",
    assignedTo: "kat",
    dueDate: "2025-02-19",
    pointValue: 15,
    recurring: "weekly",
    groupId: "group123",
  },
];

export default function TaskScreen() {
  const [tasks, setTasks] = useState(initialTasks);

  const isTaskPastDue = (dueDateStr) => {
    if (!dueDateStr) return false;
    const dueDate = new Date(dueDateStr);
    const now = new Date();
    return dueDate < now;
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === "completed" ? "open" : "completed",
        };
      }
      return task;
    });

    updatedTasks.sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (b.status === "completed" && a.status !== "completed") return -1;
      return 0;
    });

    setTasks(updatedTasks);
  };

  const renderTaskItem = ({ item }) => {
    const pastDue = isTaskPastDue(item.dueDate) && item.status !== "completed";
    const completed = item.status === "completed";

    return (
      <View
        className={`flex-row items-center ${
          completed ? "bg-[#C8F2F1]" : "bg-[#f2f2f2]"
        } rounded-xl mb-3 p-3`}
      >
        <TouchableOpacity
          className="mr-2.5"
          onPress={() => toggleTaskCompletion(item.id)}
        >
          <Ionicons
            name={completed ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={completed ? "#00B8B6" : "#999"}
          />
        </TouchableOpacity>
        <View className="flex-1">
          <Text
            className={`text-base font-semibold ${
              completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {item.title}
          </Text>
          <Text className="text-gray-600">{item.description}</Text>
          <Text className="mt-1 text-gray-500">
            Assigned to: {item.assignedTo} • {item.pointValue} points
          </Text>
          {pastDue ? (
            <Text className="mt-1 text-[#FF8C83] font-bold">past Due</Text>
          ) : (
            <Text className="mt-1 text-gray-600">Due: {item.dueDate}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white pt-12 px-4">
      <Text className="text-2xl font-bold mb-4 text-gray-800">Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
