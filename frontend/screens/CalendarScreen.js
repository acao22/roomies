import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  PanResponder,
} from "react-native";
import { CalendarList } from "react-native-calendars";
import Ionicons from "@expo/vector-icons/Ionicons";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { updateTask } from "../api/tasks.api";
import { format } from "date-fns";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Animatable from "react-native-animatable";

const userAvatars = {
  Luna: require("../images/avatar1.png"),
  Andrew: require("../images/avatar2.png"),
  Angie: require("../images/avatar3.png"),
  Default: require("../images/avatar4.png"),
};

const computeDueDate = (task) => {
  if (task.date && task.time) {
    return new Date(`${task.date}T${task.time}`);
  }
  return new Date(task.dueDate);
};

const formatDueDate = (dateVal) => {
  let dateObj;
  if (dateVal && typeof dateVal === "object" && dateVal._seconds) {
    dateObj = new Date(dateVal._seconds * 1000);
  } else {
    dateObj = new Date(dateVal);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const options = { weekday: "short", month: "short", day: "numeric" };

  if (dateObj < today) {
    return `past due: ${dateObj.toLocaleDateString("en-US", options)}`;
  }

  if (
    dateObj.getFullYear() === tomorrow.getFullYear() &&
    dateObj.getMonth() === tomorrow.getMonth() &&
    dateObj.getDate() === tomorrow.getDate()
  ) {
    return "due tomorrow";
  }

  return dateObj.toLocaleDateString("en-US", options);
};

export default function CalendarScreen() {
  const [tasks, setTasks] = useState([]);
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [expanded, setExpanded] = useState(true);
  const calendarHeight = useSharedValue(370);
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const q = query(collection(db, "task"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const taskList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });
    return () => unsubscribe();
  }, []);

  const tasksByDate = {};
  tasks.forEach((task) => {
    const dateKey = computeDueDate(task).toISOString().split("T")[0];
    if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
    tasksByDate[dateKey].push(task);
  });

  const today = new Date();
  const weekRange = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 3 + i);
    return d.toISOString().split("T")[0];
  });

  const displayedDates = expanded ? Object.keys(tasksByDate).sort() : weekRange;

  const toggleCalendar = () => {
    setExpanded((prev) => {
      const next = !prev;
      calendarHeight.value = withTiming(next ? 370 : 100, { duration: 300 });
      return next;
    });
  };

  const toggleTaskCompletion = async (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newStatus = task.status === "completed" ? "open" : "completed";
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date() : null,
        };
      }
      return task;
    });
    setTasks(updatedTasks);

    const updatedTask = updatedTasks.find((t) => t.id === taskId);
    try {
      await updateTask(taskId, {
        status: updatedTask.status,
        completedAt: updatedTask.completedAt,
      });
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleMonthChange = (months) => {
    if (months && months.length > 0) {
      const newMonth = new Date(months[0].dateString);
      setVisibleMonth(newMonth);
    }
  };

  const scrollMonth = (direction) => {
    const newDate = new Date(visibleMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setVisibleMonth(newDate);
  };

  const formattedMonth = format(visibleMonth, "MMMM yyyy");

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -30) {
          // swipe up
          calendarHeight.value = withTiming(100, { duration: 300 });
          setExpanded(false);
        } else if (gestureState.dy > 30) {
          // swipe down
          calendarHeight.value = withTiming(370, { duration: 300 });
          setExpanded(true);
        }
      },
    })
  ).current;

  const calendarStyle = useAnimatedStyle(() => ({
    height: calendarHeight.value,
    padding: 8,
  }));

  return (
    <SafeAreaView className="flex-1 bg-custom-tan">
      {/* header */}
      <View className="flex-row justify-between items-center px-4 pt-4 pb-1">
        <TouchableOpacity onPress={() => scrollMonth(-1)}>
          <Ionicons name="chevron-back" size={28} color="#495BA2" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-custom-blue-200">
          {formattedMonth}
        </Text>
        <TouchableOpacity onPress={() => scrollMonth(1)}>
          <Ionicons name="chevron-forward" size={28} color="#495BA2" />
        </TouchableOpacity>
      </View>

      {/* calendar container */}
      <View
        className="bg-custom-yellow mt-1 rounded-3xl"
        {...panResponder.panHandlers}
      >
        <Animated.View style={calendarStyle}>
          <View
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "white" }}
          >
            <CalendarList
              current={visibleMonth.toISOString().split("T")[0]}
              onDayPress={(day) => setSelectedDate(day.dateString)}
              onVisibleMonthsChange={handleMonthChange}
              pastScrollRange={12}
              futureScrollRange={12}
              horizontal
              pagingEnabled
              scrollEnabled={false}
              hideExtraDays
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: "#495BA2",
                },
                [todayStr]: {
                  marked: true,
                  dotColor: "#495BA2",
                  todayTextColor: "#495BA2",
                },
              }}
              theme={{
                todayTextColor: "#495BA2",
                selectedDayBackgroundColor: "#495BA2",
                textMonthFontSize: 0,
                textDayFontWeight: "500",
              }}
              style={{ height: "100%" }}
            />
          </View>
        </Animated.View>
      </View>

      {/* collapse/expand toggle */}
      <View className="items-center mt-2">
        <TouchableOpacity onPress={toggleCalendar}>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#495BA2"
          />
        </TouchableOpacity>
      </View>

      {/* animated task timeline */}
      <ScrollView
        className="px-4 mt-3"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {displayedDates.map((date) => {
          const day = new Date(date);
          const dayNum = format(day, "d");
          const dayName = format(day, "EEE");
          const tasksForDate = tasksByDate[date] || [];

          return (
            <View key={date} className="mb-4 flex-row items-start">
              {/* left date */}
              <View style={{ width: 60, alignItems: "center" }}>
                <Text className="text-2xl font-bold text-custom-blue-200 leading-none">
                  {dayNum}
                </Text>
                <Text className="text-base text-custom-blue-200">
                  {dayName}
                </Text>
              </View>

              <View className="flex-1 pl-4">
                {tasksForDate.length === 0 ? (
                  <Text className="italic text-gray-400 mt-2">
                    no tasks for this date!
                  </Text>
                ) : (
                  tasksForDate.map((task, index) => {
                    const isCompleted = task.status === "completed";
                    const background = isCompleted
                      ? "bg-custom-blue-100"
                      : "bg-custom-yellow";

                    return (
                      <Animatable.View
                        key={task.id}
                        animation="fadeInUp"
                        delay={index * 120}
                        duration={500}
                        easing="ease-out"
                      >
                        <TouchableOpacity
                          onPress={() => toggleTaskCompletion(task.id)}
                          className={`flex-row items-center ${background} rounded-xl p-4 mb-3`}
                        >
                          <Ionicons
                            name={isCompleted ? "checkbox" : "square-outline"}
                            size={28}
                            color="#495BA2"
                            className="mr-3"
                          />

                          <View className="flex-1">
                            <Text className="text-xl font-bold text-custom-blue-200">
                              {task.title}
                            </Text>
                            <Text className="text-sm text-custom-blue-200">
                              due {formatDueDate(computeDueDate(task))}
                            </Text>
                            <Text className="text-sm text-custom-blue-200">
                              {Array.isArray(task.assignedTo)
                                ? task.assignedTo
                                    .map((u) =>
                                      typeof u === "object" ? u.name : u
                                    )
                                    .join(" & ")
                                : task.assignedTo}
                            </Text>
                          </View>

                          {/* avatars */}
                          <View className="flex-row">
                            {(task.assignedTo || []).map((user, i) => (
                              <View
                                key={i}
                                style={{
                                  backgroundColor: "rgba(254,249,229,0.52)",
                                  borderRadius: 9999,
                                  overflow: "hidden",
                                  height: 48,
                                  width: 48,
                                  marginLeft: i === 0 ? 0 : -24,
                                }}
                              >
                                <Image
                                  source={
                                    userAvatars[user] || userAvatars["Default"]
                                  }
                                  className="h-full w-full"
                                  resizeMode="cover"
                                />
                              </View>
                            ))}
                          </View>
                        </TouchableOpacity>
                      </Animatable.View>
                    );
                  })
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
