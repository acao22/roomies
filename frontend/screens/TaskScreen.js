import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CalendarScreen from "./CalendarScreen";
import AddTaskScreen from "./AddTaskScreen";
import Animated from "react-native-reanimated";
import * as Animatable from "react-native-animatable";
import CustomModal from "./CustomModal";
import { getAllTasks, updateTask } from "../api/tasks.api.js";
import { getUserGroup, getUserInfo } from "../api/users.api";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import PointsModal from "./PointsModal";




// Hardcoded avatars
const userAvatars = {
  Luna: require("../images/avatar1.png"),
  Andrew: require("../images/avatar2.png"),
  Angie: require("../images/avatar3.png"),
  Default: require("../images/avatar4.png"),
};

const computeDueDate = (task) => {
  if (task.date && task.time) {
    // Combine ISO date and time (e.g., "2025-03-23" and "15:52:26")
    return new Date(`${task.date}T${task.time}`);
  }
  // Fallback: try to use task.dueDate
  return new Date(task.dueDate);
};

// Helper function to format a due date (from a string like "2025-03-12")
const formatDueDate = (dateVal) => {
  let dateObj;
  // If dateVal is an object with _seconds, assume it's a serialized Firestore Timestamp.
  if (dateVal && typeof dateVal === "object" && dateVal._seconds) {
    dateObj = new Date(dateVal._seconds * 1000);
  } else {
    dateObj = new Date(dateVal);
  }

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return <Text>Invalid Date</Text>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const options = { weekday: "short", month: "short", day: "numeric" };

  if (dateObj < today) {
    return (
      <Text className="text-red-700 flex-row items-center">
        <Ionicons name="alert-circle-sharp" size={14} className="mr-1" />
        {` past due: ${dateObj.toLocaleDateString("en-US", options)}`}
      </Text>
    );
  }

  if (
    dateObj.getFullYear() === tomorrow.getFullYear() &&
    dateObj.getMonth() === tomorrow.getMonth() &&
    dateObj.getDate() === tomorrow.getDate()
  ) {
    return <Text>due tomorrow</Text>;
  }
  
  return <Text>{dateObj.toLocaleDateString("en-US", options)}</Text>;
};



// Helper function to format a Firestore Timestamp (e.g. completedAt)
const formatTimestamp = (timestamp) => {
  let dateObj;
  if (timestamp && typeof timestamp === "object" && timestamp._seconds) {
    dateObj = new Date(timestamp._seconds * 1000);
  } else {
    dateObj = new Date(timestamp);
  }
  if (isNaN(dateObj.getTime())) return "Invalid Date";
  
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // months are zero-indexed
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  
  return `${month}/${day}/${year} ${hours}:${minutes}`;
};


export default function TaskScreen({ user }) {
  const [tasks, setTasks] = useState([]); // tasks will be set from API
  const [activeTab, setActiveTab] = useState("tasks");
  const [modalVisible, setModalVisible] = useState(false);
  const [completedTaskName, setCompletedTaskName] = useState("");
  const [totalPoints, setTotalPoints] = useState(0); // total points of user, need to adjust

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // const filteredTasks = tasks.filter(task =>
  //   task.groupId &&
  //   user.roomieGroup &&
  //   task.groupId.toString() === `/roomieGroups/${user.roomieGroup.id}`
  // );
  
  
  // update screen irl
  useEffect(() => {
    const q = query(collection(db, "task"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const tasksArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Process assignedTo if it's an array of DocumentReferences
          if (data.assignedTo && Array.isArray(data.assignedTo)) {
            // For now, we assume these references have been stored as strings or processed already.
            // If they're still DocumentReferences, you'll need additional logic.
            // Here, we assume they are strings.
          }
          return {
            id: doc.id,
            ...data,
            completedAt: data.completedAt
              ? data.completedAt.toDate().toISOString()
              : null,
          };
        });
        setTasks(tasksArray);
      },
      (error) => {
        console.error("Error fetching tasks with onSnapshot:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  

  // Toggle task completion status and open modal if marking as completed
  const toggleTaskCompletion = async (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newStatus = task.status === "completed" ? "open" : "completed";
        const updatedTask = {
          ...task,
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date() : null,
        };
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);

    // Find the updated task
    const taskToUpdate = updatedTasks.find((task) => task.id === taskId);
    try {
      // Update the task in firebase
      await updateTask(taskId, {
        status: taskToUpdate.status,
        completedAt: taskToUpdate.completedAt,
      });
    } catch (error) {
      console.error("Error updating task in firebase:", error);
    }

    // Open modal if marking as completed
    if (taskToUpdate.status === "completed") {
      setSelectedTaskId(taskId);
      setCompletedTaskName(taskToUpdate.title);
      setModalVisible(true);
      setTotalPoints(prev => prev + 5); // change to specific task's points once implemented function
      setTimeout(() => {
        setModalVisible(false);
        setSelectedTaskId(null);
      }, 3000);

    }
  };
  // Modal handlers
  const handleModalCancel = () => {
    if (selectedTaskId) {
      // Revert the change: toggling the task back to open
      toggleTaskCompletion(selectedTaskId);
    }
    setModalVisible(false);
    setSelectedTaskId(null);
  };

  const handleModalSubmit = () => {
    // Leave the task as completed
    setModalVisible(false);
    setSelectedTaskId(null);
  };

  // Sort upcoming tasks by dueDate
  const upcomingTasks = tasks
    .filter((t) => t.status === "open")
    .sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA - dateB;
    });

  // Get completed tasks
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const renderTaskItem = ({ item, index, toggleTaskCompletion }) => {
    const isCompleted = item.status === "completed";
    const backgroundColor = isCompleted
      ? "bg-[#fdddb3]"
      : "bg-custom-yellow";
    const textColor = isCompleted
      ? "text-custom-blue-100 line-through"
      : index % 2 === 0
      ? "text-custom-blue-200"
      : "text-custom-blue-200";
    const iconColor = isCompleted
      ? "#9CABD8"
      : index % 2 === 0
      ? "#495BA2"
      : "#495BA2";

    return (
      <Animatable.View
        animation={isCompleted ? "lightSpeedIn" : "slideInUp"}
        duration={isCompleted ? 500 : 300}
        delay={index * 100}
        className={`flex-row items-center ${backgroundColor} rounded-xl p-4 mb-3 shadow-sm`}
      >
        {/* Checkbox */}
        <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
          <Ionicons
            name={isCompleted ? "checkbox" : "square-outline"}
            size={32}
            color={iconColor}
            className="mr-3"
          />
        </TouchableOpacity>

        {/* Task details */}
        <View className="flex-1">
          <Text className={`text-2xl font-spaceGrotesk font-bold ${textColor}`}>
            {item.title}
          </Text>
          <Text className={`text-s font-spaceGrotesk ${textColor}`}>
            {formatDueDate(computeDueDate(item))}
          </Text>
          {isCompleted && item.completedAt && (
            <Text className="text-xs text-custom-blue-200">
              Completed: {formatTimestamp(item.completedAt)}
            </Text>
          )}
          <Text className={`text-s font-spaceGrotesk ${textColor}`}>
          {Array.isArray(item.assignedTo)
            ? item.assignedTo
                .map(u => typeof u === 'object' ? u.name : u)
                .join(" & ")
            : item.assignedTo}
          </Text>
        </View>

        {/* Avatars */}
        <View className="flex-row justify-between z-10">
          {(item.assignedTo || []).map((user, i) => ( // need to make assignedTo correctly
            <View
              key={i}
              style={{
                backgroundColor: "rgba(254,249,229,0.52)",
                borderRadius: 9999,
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
    <View className="flex-1 bg-custom-yellow">
      {/* TABS */}
      <View className="flex-row mt-16 ml-5">
        <TouchableOpacity
          onPress={() => setActiveTab("tasks")}
          className={`${
            activeTab === "tasks"
              ? "bg-custom-blue-200"
              : activeTab === "addTask"
              ? "bg-custom-blue-100" // code for birder of add tasks???
              : "bg-custom-blue-200"
          } px-5 py-2 rounded-t-[20px] z-10 ml-4`}
        >
          <Text className="text-4xl font-bold text-custom-tan font-spaceGrotesk">
            tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("calendar")}
          className="px-5 py-2 rounded-t-[20px] z-10 bg-custom-pink-200 ml-3"
        >
          <Text className="text-4xl font-bold text-custom-tan font-spaceGrotesk">
            calendar
          </Text>
        </TouchableOpacity>
      </View>

      {/* DARK BLUE border */}
      <Animated.View className="flex-1 items-center border-t-8 border-custom-blue-200 z-10 bg-custom-tan">
        <View
          className={`w-[92%] flex-1 top-5 ${
            activeTab === "tasks"
              ? "border-custom-blue-200"
              : activeTab === "calendar"
              ? "border-custom-blue-100"
              : "border-custom-blue-100"
          } rounded-t-3xl bg-custom-tan`}
        >
          <View className="flex-1 p-4">
            { /* don't need custom that adss tasks for now */}
            {/* <CustomModal
              visible={modalVisible}
              onCancel={handleModalCancel}
              onSubmit={handleModalSubmit}
            /> */}

            {/* popup that shows everytime someone finishes a task */}
            <PointsModal 
              visible={modalVisible}
              onCancel={() => setModalVisible(false)}
              taskName={completedTaskName}
              totalPoints={totalPoints}
            />
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
                    <View className="flex-row justify-between items-center mx-1">
                      <Text className="text-4xl mb-4 font-bold font-spaceGrotesk text-custom-blue-200">
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
                    <Text className="text-4xl font-spaceGrotesk font-bold text-custom-blue-200 my-4 mx-1">
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
              <AddTaskScreen setActiveTab={setActiveTab} user={user}/>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
