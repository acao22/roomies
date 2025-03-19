import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CalendarScreen from "./CalendarScreen";
import AddTaskScreen from "./AddTaskScreen";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import * as Animatable from "react-native-animatable";
import CustomModal from "./CustomModal";

// HARDCODED SHART FOR NOW

const userAvatars = {
  Luna: require("../images/avatar1.png"),
  Andrew: require("../images/avatar2.png"),
  Angie: require("../images/avatar3.png"),
  Default: require("../images/avatar4.png"),
};

const initialTasks = [
  {
    id: "1",
    title: "vacuum",
    assignedTo: ["Luna"],
    status: "open",
    dueDate: "2025-03-12",
  },
  {
    id: "2",
    title: "dishes",
    assignedTo: ["Andrew", "Luna", "Angie"],
    status: "open",
    dueDate: "2025-03-15",
  },
  {
    id: "3",
    title: "clean",
    assignedTo: ["Everyone"],
    status: "open",
    dueDate: "2025-03-12",
  },
  {
    id: "4",
    title: "hello",
    assignedTo: ["Andrew"],
    status: "completed",
    dueDate: "2025-03-10",
  },
  {
    id: "5",
    title: "bye",
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

// helper function for formatting due dates
const formatDueDate = (dateStr) => {
  const today = new Date();
  // normalizing time to compare only date
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // convert dueDate string -> Date object
  const [year, month, day] = dateStr.split("-").map(Number);
  const dueDate = new Date(year, month - 1, day);

  const options = { weekday: "short", month: "short", day: "numeric" };

  if (dueDate < today) {
    // past due: red color + alert icon
    return (
      <Text className="text-red-700 flex-row items-center">
        <Ionicons name="alert-circle-sharp" size={14} className="mr-1" />
        {` past due: ${dueDate.toLocaleDateString("en-US", options)}`}
      </Text>
    );
  }

  if (
    dueDate.getFullYear() === tomorrow.getFullYear() &&
    dueDate.getMonth() === tomorrow.getMonth() &&
    dueDate.getDate() === tomorrow.getDate()
  ) {
    // due tmr: some important color maybe
    return <Text>due tomorrow</Text>;
  }
  return <Text>{dueDate.toLocaleDateString("en-US", options)}</Text>;
};

export default function TaskScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("tasks");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);



  // helper function to toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "completed" ? "open" : "completed";
          // Open modal when marking task as completed
          if (newStatus === "completed") {
            setSelectedTaskId(taskId);
            setModalVisible(true);
          }
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  // handling cancel vs submit in modal
  const handleModalCancel = () => {
    // Revert the task status (toggle again)
    if (selectedTaskId) {
      toggleTaskCompletion(selectedTaskId); // toggles back to open
    }
    setModalVisible(false);
    setSelectedTaskId(null);
  };

  const handleModalSubmit = () => {
    // Leave the task as completed
    setModalVisible(false);
    setSelectedTaskId(null);
  };

  // helper function to sort upcoming tasks by due date
  const upcomingTasks = tasks
    .filter((t) => t.status === "open")
    .sort((a, b) => {
      // convert dueDate to Date object
      // idk i did this before to but soemtimes it tweaks out... can clean later
      const [yearA, monthA, dayA] = a.dueDate.split("-").map(Number);
      const [yearB, monthB, dayB] = b.dueDate.split("-").map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      // sorting in ASCNEDING order
      return dateA - dateB;
    });

  // completed tasks should be separate
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const renderTaskItem = ({ item, index, toggleTaskCompletion }) => {
    const isCompleted = item.status === "completed";

    // rendering alternating colors of tasks
    const backgroundColor = isCompleted
      ? "bg-custom-pink-100"
      : index % 2 === 0
      ? "bg-custom-yellow"
      : "bg-custom-blue-100";
    const textColor = isCompleted
      ? "text-custom-tan line-through"
      : index % 2 === 0
      ? "text-custom-blue-200"
      : "text-custom-tan";
    const iconColor = isCompleted
      ? "#FEF9E5"
      : index % 2 === 0
      ? "#788ABF"
      : "#FEF9E5";

    return (
      <Animatable.View
        animation={isCompleted ? "lightSpeedIn" : "slideInUp"}
        duration={isCompleted ? 500 : 300}
        delay={index * 100} // stagger animation a little for each item
        // easing={"cubic"}
        className={`flex-row items-center ${backgroundColor} rounded-xl p-4 mb-3 shadow-sm`}
      >
        {/* CHECKBOX */}
        <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
          <Ionicons
            name={isCompleted ? "checkbox" : "square-outline"}
            size={32}
            color={`${iconColor}`}
            className="mr-3"
          />
        </TouchableOpacity>

        {/* TASK DETAILS */}
        <View className="flex-1">
          <Text className={`text-2xl font-spaceGrotesk font-bold ${textColor}`}>
            {item.title}
          </Text>
          <Text className={`text-s font-spaceGrotesk ${textColor}`}>
            {formatDueDate(item.dueDate)}
          </Text>
          <Text className={`text-s font-spaceGrotesk ${textColor}`}>
            {item.assignedTo.join(" & ")}
          </Text>
        </View>

        {/* AVATAR(S) */}
        <View className="flex-row justify-between z-10">
          {item.assignedTo.map((user, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "rgba(254, 249, 229, 0.52)", // opacity lowered
                borderRadius: 9999, // full rounded just so it works lmao
                overflow: "hidden",
                height: 64,
                width: 64,
                marginLeft: i === 0 ? 0 : -36,
              }}
            >
              <Image
                source={userAvatars[user] || userAvatars["Default"]}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
          ))}
        </View>
      </Animatable.View>
    );
  };

  return (
    <View className="flex-1 bg-custom-tan">
      {/* TABS */}
      <View className="flex-row mt-16 ml-5">
        {/* tasks tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("tasks")}
          className={` ${
            activeTab === "tasks"
              ? "bg-custom-pink-200"
              : activeTab === "addTask"
              ? "bg-custom-blue-100"
              : "bg-custom-pink-200"
          } px-5 py-2 rounded-t-[20px] z-10`}
        >
          <Text className="text-2xl font-bold mb-2 text-custom-tan font-spaceGrotesk ">
            tasks
          </Text>
        </TouchableOpacity>

        {/* calendar tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("calendar")}
          className="px-5 py-2 rounded-t-[20px] z-10 bg-custom-yellow"
        >
          <Text className="text-2xl font-bold mb-2 text-custom-tan font-spaceGrotesk ">
            calendar
          </Text>
        </TouchableOpacity>
      </View>

      {/* CORAL border */}
      <Animated.View className="flex-1 items-center -mt-4 z-10">
        <View
          className={`w-[92%] flex-1 border-[20px] ${
            activeTab === "tasks"
              ? "border-custom-pink-200"
              : activeTab === "calendar"
              ? "border-custom-yellow"
              : "border-custom-blue-100"
          } rounded-t-3xl bg-custom-tan`}
        >
          <View className="flex-1 p-4">
          <CustomModal visible={modalVisible} onCancel={handleModalCancel} onSubmit={handleModalSubmit} />

            {activeTab === "tasks" ? (
              <FlatList
                data={[
                  "upcoming",
                  ...upcomingTasks,
                  "completed",
                  ...completedTasks,
                ]}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) =>
                  item === "upcoming" ? (
                    <View className="flex-row justify-between items-center my-4 mx-1">
                      <Text className="text-3xl font-bold font-spaceGrotesk text-custom-blue-200">
                        upcoming
                      </Text>
                      <TouchableOpacity onPress={() => setActiveTab("addTask")}>
                        <Ionicons
                          name="add-circle-outline"
                          size={30}
                          color="#788ABF"
                        />
                      </TouchableOpacity>
                    </View>
                  ) : item === "completed" ? (
                    <Text className="text-3xl font-spaceGrotesk font-bold text-custom-blue-200 my-4 mx-1">
                      completed
                    </Text>
                  ) : (
                    renderTaskItem({ item, index, toggleTaskCompletion })
                  )
                }
                keyExtractor={(item, index) =>
                  typeof item === "string" ? item : item.id
                }
                contentContainerStyle={{ paddingBottom: 15 }}
              />
            ) : activeTab === "calendar" ? (
              <CalendarScreen />
            ) : (
              <AddTaskScreen setActiveTab={setActiveTab} />
            )}
          </View>
          
        </View>
        
      </Animated.View>
      
    </View>
  );
}
