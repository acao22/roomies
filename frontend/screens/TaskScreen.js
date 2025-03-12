import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CalendarScreen from "./CalendarScreen";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// helper function for formatting due dates prettily
const formatDueDate = (dateStr) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dueDate = new Date(dateStr);
  const options = { weekday: "long", month: "short", day: "numeric" };

  if (
    dueDate.getFullYear() === tomorrow.getFullYear() &&
    dueDate.getMonth() === tomorrow.getMonth() &&
    dueDate.getDate() === tomorrow.getDate()
  ) {
    return "Due tomorrow";
  }

  return `Due ${dueDate.toLocaleDateString("en-US", options)}`;
};

const initialTasks = [
  {
    id: "1",
    title: "Vacuum",
    assignedTo: ["Luna"],
    status: "open",
    dueDate: "2025-03-14",
  },
  {
    id: "2",
    title: "Dishes",
    assignedTo: ["Andrew", "Luna"],
    status: "open",
    dueDate: "2025-03-12",
  },
  {
    id: "3",
    title: "Clean",
    assignedTo: ["Everyone"],
    status: "open",
    dueDate: "2025-03-12",
  },
  {
    id: "4",
    title: "Hello",
    assignedTo: ["Andrew"],
    status: "completed",
    dueDate: "2025-03-10",
  },
  {
    id: "5",
    title: "Bye",
    assignedTo: ["Andrew"],
    status: "completed",
    dueDate: "2025-03-09",
  },
  {
    id: "6",
    title: "Yeah",
    assignedTo: ["Andrew"],
    status: "completed",
    dueDate: "2025-03-08",
  },
];

export default function TaskScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("tasks");

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "open" : "completed",
            }
          : task
      )
    );
  };

  const renderTaskItem = ({ item, index }) => {
    const isCompleted = item.status === "completed";
    const backgroundColor = isCompleted
      ? "bg-custom-pink-200"
      : index % 2 === 0
      ? "bg-custom-yellow"
      : "bg-custom-blue-100";
    const textColor = isCompleted
      ? "text-custom-tan line-through"
      : "text-white";

    return (
      <View
        className={`flex-row items-center ${backgroundColor} rounded-xl p-4 mb-3`}
      >
        <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
          <Ionicons
            name={isCompleted ? "checkmark-circle" : "square-outline"}
            size={32}
            color={"#FEF9E5"}
            className="mr-3"
          />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className={`text-lg font-semibold ${textColor}`}>
            {item.title}
          </Text>
          <Text className="text-custom-tan">{formatDueDate(item.dueDate)}</Text>
          <Text className="text-custom-tan">{item.assignedTo.join(" & ")}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-custom-tan">
      {/* TABS */}
      <View className="flex-row mt-16 ml-5">
        {/* tasks tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("tasks")}
          className="px-5 py-2 rounded-t-[20px] z-10 bg-custom-pink-200"
        >
          <Text className="text-2xl font-bold mb-2 text-white">tasks</Text>
        </TouchableOpacity>

        {/* calendar tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("calendar")}
          className="px-5 py-2 rounded-t-[20px] z-10 bg-custom-yellow"
        >
          <Text className="text-2xl font-bold mb-2 text-white">calendar</Text>
        </TouchableOpacity>
      </View>

      {/* CORal border */}
      <Animated.View className="flex-1 items-center -mt-4 z-10">
        <View
          className={`w-[92%] flex-1 border-[20px] ${
            activeTab === "tasks"
              ? "border-custom-pink-200"
              : "border-custom-yellow"
          } rounded-t-3xl bg-custom-tan`}
        >
          <View className="flex-1 p-4">
            {activeTab === "tasks" ? (
              <FlatList
                data={[
                  "upcoming",
                  ...tasks.filter((t) => t.status === "open"),
                  "completed",
                  ...tasks.filter((t) => t.status === "completed"),
                ]}
                renderItem={({ item, index }) =>
                  item === "upcoming" ? (
                    <View className="flex-row justify-between items-center my-4 mx-1">
                      <Text className="text-2xl font-bold text-custom-blue-200">
                        upcoming
                      </Text>
                      <TouchableOpacity>
                        <Ionicons
                          name="add-circle-outline"
                          size={24}
                          color="#5E6AA6"
                        />
                      </TouchableOpacity>
                    </View>
                  ) : item === "completed" ? (
                    <Text className="text-2xl font-bold text-custom-blue-200 my-4 mx-1">
                      completed
                    </Text>
                  ) : (
                    renderTaskItem({ item, index })
                  )
                }
                keyExtractor={(item, index) =>
                  typeof item === "string" ? item : item.id
                }
                contentContainerStyle={{ paddingBottom: 15 }}
              />
            ) : (
              <CalendarScreen />
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
