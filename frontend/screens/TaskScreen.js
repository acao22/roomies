import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CalendarScreen from "./CalendarScreen";
import AddTaskScreen from "./AddTaskScreen";
import Animated from "react-native-reanimated";
import * as Animatable from "react-native-animatable";
import CustomModal from "./CustomModal";
import { getAllTasks, updateTask } from "../api/tasks.api.js";
import { verifyUserSession } from "../api/users.api.js";
import { collection, query, onSnapshot, doc, where } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import PointsModal from "./PointsModal";
import { getUserGroup, getUserInfo, addPointsToUser } from "../api/users.api";

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
  const [taskPoints, setTaskPoints] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [sortOption, setSortOption] = useState("upcoming");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userMap, setUserMap] = useState({});

  // Subscribe to user doc for live updates of totalPoints
  useEffect(() => {
    if (!user || !user.uid) return;
    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTotalPoints(data.totalPoints || 0);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // 2) Subscribe to tasks
  useEffect(() => {
    let unsubscribe; // To hold the unsubscribe function for cleanup

    // Async function to fetch the user group, then subscribe to tasks
    async function fetchUserTasks() {
      try {
        // Fetch the user group data; assumes getUserGroup returns an object with an id property
        const groupData = await getUserGroup();
        const groupId = groupData.id;

        // Create a query that fetches tasks only for this specific groupId
        const q = query(
          collection(db, "task"),
          where("groupId", "==", groupId)
        );

        // Subscribe to real-time updates from Firestore using onSnapshot
        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const tasksArray = querySnapshot.docs.map((doc) => {
              const data = doc.data();

              // Process the assignedTo field here if needed, e.g., when it's an array of DocumentReferences.
              // Currently, it assumes they have been processed to strings or are already in the desired format.

              return {
                id: doc.id,
                ...data,
                completedAt: data.completedAt
                  ? data.completedAt.toDate().toISOString()
                  : null,
              };
            });
            // Update the component state with the fetched tasks
            setTasks(tasksArray);
          },
          (error) => {
            console.error("Error fetching tasks with onSnapshot:", error);
          }
        );
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    }

    // Initiate fetching of tasks by the user's group
    fetchUserTasks();

    // Cleanup: Unsubscribe from the snapshot listener when the component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  //getting user info
  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const map = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          map[doc.id] = data.firstName || "Unnamed"; // fallback if no name
        });
        setUserMap(map);
      });
      return () => unsubscribe();
    };

    fetchUsers();
  }, []);

  // Toggle task completion status and open modal if marking as completed
  const toggleTaskCompletion = async (taskId) => {
    const { uid, email, message } = await verifyUserSession();
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newStatus = task.status === "completed" ? "open" : "completed";
        const updatedTask = {
          ...task,
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date() : null,
          completedBy: newStatus === "completed" ? uid : null,
          updatedAt: new Date(),
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
        updatedAt: taskToUpdate.updatedAt,
        completedBy: taskToUpdate.completedBy,
      });
    } catch (error) {
      console.error("Error updating task in firebase:", error);
    }

    // Open modal if marking as completed
    if (taskToUpdate.status === "completed") {
      const points = taskToUpdate.selectedPoints || 0;
      console.log(
        "Task selectedPoints:",
        taskToUpdate.selectedPoints,
        "Converted to number:",
        points
      );

      setTaskPoints(points);
      setSelectedTaskId(taskId);
      setCompletedTaskName(taskToUpdate.title);
      setModalVisible(true);

      try {
        await addPointsToUser(user.uid, points);
      } catch (err) {
        console.error("Failed to add points to user:", err);
      }

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

  //sort tasks by user
  const filteredTasks =
    sortOption === "myTasks"
      ? tasks.filter((t) =>
          Array.isArray(t.assignedTo)
            ? t.assignedTo.includes(user.name)
            : t.assignedTo === user.name
        )
      : tasks;

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
    const backgroundColor = isCompleted ? "bg-[#fdddb3]" : "bg-custom-yellow";
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

          {/* IF WE ARE DOING JUST NAMES IN BACKEND*/}
          <Text className={`text-s font-spaceGrotesk ${textColor}`}>
            <Text className="font-semibold">assigned to:</Text>{" "}
            {Array.isArray(item.v)
              ? item.assignedTo
                  .map((u) => (typeof u === "object" ? u.name : u))
                  .join(" & ")
              : item.members}
          </Text>

          {/* IF WE ARE DOING USERID SOM1 LMK PLS
          {item.members && (
  <Text className={`text-s font-spaceGrotesk ${textColor}`}>
    assigned to: {item.members
      .map((uid) => userMap[uid] || "Unknown")
      .join(" & ")}
  </Text>
)} */}

          {isCompleted && item.completedAt && (
            <Text className="text-xs text-custom-blue-200">
              Completed: {formatTimestamp(item.completedAt)}
            </Text>
          )}
        </View>

        {/* Avatars */}
        <View className="flex-row justify-between z-10">
          {(item.assignedTo || []).map(
            (
              user,
              i // need to make assignedTo correctly
            ) => (
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
            )
          )}
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
            {/* don't need custom that adss tasks for now */}
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
              taskPoints={taskPoints}
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
                      <View className="mb-4">
                        {/* Header title */}
                        <Text className="text-4xl font-bold font-spaceGrotesk text-custom-blue-200 mb-1">
                          {sortOption === "upcoming" ? "upcoming" : "my tasks"}
                        </Text>

                        {/* sort by row */}
                        <View className="flex-row items-center">
                          <TouchableOpacity
                            onPress={() => setDropdownVisible(!dropdownVisible)}
                            className="flex-row items-center"
                          >
                            <Text className="text-md text-[#788ABF] mr-1">
                              sort by
                            </Text>
                            <Ionicons
                              name="filter-outline"
                              size={16}
                              color="#788ABF"
                            />
                          </TouchableOpacity>
                        </View>

                        {/* sort by dropdown menu */}
                        {dropdownVisible && (
                          <Animatable.View
                            animation={"pulse"}
                            duration={500}
                            className="absolute top-14 left-0 border-4 border-[#FFD49B] bg-[#FFE9C7] p-3 rounded-xl shadow-lg z-50 w-36"
                          >
                            <TouchableOpacity
                              className="py-1"
                              onPress={() => {
                                setSortOption("upcoming");
                                setDropdownVisible(false);
                              }}
                            >
                              <Text className="text-xl font-bold text-custom-blue-200">
                                upcoming
                              </Text>
                            </TouchableOpacity>
                            <View className="my-1 border-t-4 border-[#FFD49B]" />
                            <TouchableOpacity
                              className="py-1"
                              onPress={() => {
                                setSortOption("myTasks");
                                setDropdownVisible(false);
                              }}
                            >
                              <Text className="text-xl font-bold text-custom-blue-200">
                                my tasks
                              </Text>
                            </TouchableOpacity>
                          </Animatable.View>
                        )}
                      </View>
                      {/* 
                      <TouchableOpacity onPress={() => setActiveTab("addTask")}>
                        <Ionicons
                          name="add-circle-outline"
                          size={30}
                          color="#788ABF"
                        />
                      </TouchableOpacity> */}
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
              <AddTaskScreen setActiveTab={setActiveTab} user={user} />
            )}

            {activeTab === "tasks" && (
              <TouchableOpacity
                onPress={() => setActiveTab("addTask")}
                className="absolute bottom-24 right-6 bg-custom-blue-200 rounded-full p-4 shadow-lg z-50"
                style={{ elevation: 10 }} // for android
              >
                <Ionicons name="add" size={32} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
