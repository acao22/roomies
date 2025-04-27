import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { addTask } from "../api/tasks.api.js";
import face1 from "../assets/face1.png";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";

import { getUserGroup, fetchAvatar } from "../api/users.api.js";

import TrashIcon from "../images/trash-icon.png";
import DishesIcon from "../images/dishes-icon.png";
import VacuumIcon from "../images/vacuum-icon.png";
import CleanIcon from "../images/clean-icon.png";
import ToiletIcon from "../images/toilet-paper-icon.png";
import SoapIcon from "../images/soap-icon.png";

const taskIcons = [
  { id: 1, name: "trash", icon: TrashIcon },
  { id: 2, name: "dishes", icon: DishesIcon },
  { id: 3, name: "vacuum", icon: VacuumIcon },
  { id: 4, name: "clean", icon: CleanIcon },
  { id: 5, name: "restock", icon: ToiletIcon },
  { id: 6, name: "soap", icon: SoapIcon },
];

const recurrenceOptions = ["Does not repeat", "Weekly", "Bi-weekly", "Monthly"];

const pointOptions = [1, 5, 10, 15, 20];

const AddTaskScreen = ({ setActiveTab, user }) => {
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeAnchor, setTimeAnchor] = useState({ x: 0, y: 0, height: 0 });
  const timeBtnRef = useRef(null);

  const [time, setTime] = useState(new Date());
  const [members, setMembers] = useState([]);
  const [recurrence, setRecurrence] = useState(recurrenceOptions[0]);
  const [showRecurrenceDropdown, setShowRecurrenceDropdown] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedPoints, setSelectedPoints] = useState(1);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, height: 0 });
  const dateBtnRef = useRef(null);


  function openCalendar() {
    if (!dateBtnRef.current) return
    dateBtnRef.current.measureInWindow((x, y, height) => {
      setAnchor({ x, y, height })
      setShowCalendar(true)
    })
  }

  function openTimePicker() {
    if (!timeBtnRef.current) return;
    timeBtnRef.current.measureInWindow((x, y, height) => {
      setTimeAnchor({ x, y, height });
      setShowTimePicker(true);
    });
  }
  

  
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const future = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const modalBaseStyle = {
    position: "absolute",
    width: 316,
    backgroundColor: "#FEF9E5",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 9999,
    borderWidth: 2,
    borderColor: "#788ABF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    overflow: "visible",
  };

  useFocusEffect(
    React.useCallback(() => {
      const now = new Date();
      setDate(now);
      setTime(now);
      setSelectedDate(now.toISOString().split("T")[0]);

      const fetchGroupAndAvatars = async () => {
        try {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          setSelectedDate(`${year}-${month}-${day}`);
          const groupData = await getUserGroup();
          if (groupData && groupData.members) {
            const membersWithAvatars = await Promise.all(
              groupData.members.map(async (member) => {
                try {
                  const avatarData = await fetchAvatar(member.uid);
                  return {
                    ...member,
                    name: member.firstName || member.username || "unknown",
                    avatar: avatarData.uri,
                    selected: false,
                  };
                } catch (err) {
                  console.error(
                    `Error fetching avatar for ${member.uid}:`,
                    err
                  );
                  return { ...member, avatar: null };
                }
              })
            );
            setMembers(membersWithAvatars);
          }
        } catch (err) {
          console.error("Failed to fetch group data", err);
        }
      };

      fetchGroupAndAvatars();
    }, [])
  );

  const getAvatarSource = (member) =>
    member.avatar ? { uri: member.avatar } : face1;

  const toggleMemberSelection = (id) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.uid === id ? { ...member, selected: !member.selected } : member
      )
    );
  };

  const handleAddTask = async () => {
    try {
      const groupData = await getUserGroup();
      console.log(groupData);
      const groupId = groupData.id;
      /*
      user && Array.isArray(user.roomieGroup) && user.roomieGroup.length > 0
        ? `/roomiesGroup/${user.roomieGroup[0]}`  // adjust collection name as needed
        : null; */
      console.log(groupId);
      await addTask(
        title,
        selectedIcon,
        date.toISOString().split("T")[0],
        time.toISOString().split("T")[1].substring(0, 8),
        members.filter((m) => m.selected).map((m) => m.uid),
        recurrence,
        description,
        // assignedTo,
        groupId,
        selectedPoints
      ); // need to add assignedTo
      setActiveTab("tasks");
    } catch (error) {
      console.error(error);
    }
  };

  const renderPointOption = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedPoints(item)}
      style={{
        marginHorizontal: 4,
        padding: 8,
        borderRadius: 8,
        backgroundColor: selectedPoints === item ? "#788ABF" : "#F5A58C",
        width: 50,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text className="font-spaceGrotesk text-lg text-white">{`+${item}`}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      // flatlist requires data, so just using single empty object
      // scrollview makes it start tweaking :(
      data={[{}]}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={() => (
        <View className="flex-1 bg-custom-tan mb-20">
          {/* BACK BUTTON */}
          <TouchableOpacity
            // switch back to tasks tab
            onPress={() => setActiveTab("tasks")}
            className="mb-4 flex-row"
          >
            <Ionicons name="arrow-back" size={28} color="#495BA2" />

            <Text className="text-xl text-custom-blue-200 font-bold font-spaceGrotesk ml-5">
              add task
            </Text>
          </TouchableOpacity>

          <View className="border-custom-blue-100 border-8 rounded-3xl p-4">
            {/* TASK TITLE */}
            <TextInput
              className="border-b border-gray-400 text-xl py-2 mb-4 font-bold font-spaceGrotesk "
              placeholder="title"
              value={title}
              onChangeText={setTitle}
            />

            {/* PRESET TASK ICONS */}
            <Text className="text-custom-blue-200 font-spaceGrotesk">
              or choose from below:
            </Text>
            <FlatList
              data={taskIcons}
              horizontal={false}
              numColumns={3}
              nestedScrollEnabled={true}
              keyExtractor={(item) => item.id.toString()}
              className="max-h-[200px] my-4"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedIcon(item.id);
                    setTitle(item.name);
                    const now = new Date();
                    const future = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate() + 1,
                      now.getHours(),
                      now.getMinutes(),
                      now.getSeconds()
                    );
                    setDate(future);
                    setTime(future);
                    const year = future.getFullYear();
                    const month = String(future.getMonth() + 1).padStart(
                      2,
                      "0"
                    );
                    const day = String(future.getDate()).padStart(2, "0");
                    setSelectedDate(`${year}-${month}-${day}`);
                    setRecurrence("Does not repeat");
                    setSelectedPoints(5);
                    setMembers((prev) =>
                      prev.map((member) => ({
                        ...member,
                        selected: member.uid.trim() === user.uid.trim(),
                      }))
                    );
                  }}
                  className={`m-1 p-4 rounded-full ${
                    selectedIcon === item.id
                      ? "border-2 border-blue-500"
                      : "border-[#F5D2C8]"
                  } bg-[#F5D2C8] bg-opacity-50 w-24 h-24 flex items-center justify-center`}
                >
                  <Image
                    source={item.icon}
                    style={{
                      width:
                        item.name === "vacuum" || item.name === "soap"
                          ? 56
                          : 63,
                      height:
                        item.name === "vacuum" || item.name === "soap"
                          ? 35
                          : 39,
                      resizeMode: "contain",
                    }}
                  />
                  <Text className="text-center text-sm text-custom-blue-200 mt-1 font-spaceGrotesk">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* DATE & TIME PICKERS */}
            <View className="flex-row items-center space-x-2 mt-2">
              {/* Clock Icon */}
              <Ionicons
                name="time-outline"
                size={30}
                color="black"
                className="ml-2"
              />

              <View className="relative mx-6 z-50">
                {/* Date Button */}
                <TouchableOpacity
                  ref={dateBtnRef}
                  onPress={() => {
                    openCalendar();
                    setShowTimePicker(false);
                  }}
                  className="px-4 py-3 rounded-xl bg-[#D9D9D9]"
                >
                  <Text className="text-[#495BA2] text-base font-spaceGrotesk">
                    {(() => {
                      const [year, month, day] = selectedDate
                        .split("-")
                        .map(Number);
                      const localDate = new Date(year, month - 1, day); // month is 0-indexed
                      return localDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    })()}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Calendar Dropdown */}
              {showCalendar && (
                <Modal
                visible={showCalendar}
                transparent
                animationType="fade"
              >
                <TouchableOpacity
                  style={{ flex:1, backgroundColor:"rgba(0,0,0,0.3)" }}
                  activeOpacity={1}
                  onPress={() => setShowCalendar(false)}
                >
                <View style={[modalBaseStyle, {top: anchor.y + 50,
                  left: anchor.x - 67
                }, ]}>
                  <Calendar
                    onDayPress={(day) => {

                        setSelectedDate(day.dateString);
                        const [y,m,d] = day.dateString.split("-").map(Number);
                        setDate(new Date(y, m-1, d));
                        setShowCalendar(false);

                    
                    }}
                    markedDates={{
                      [selectedDate]: {
                        selected: true,
                        selectedColor: "#AABBEF",
                      },
                    }}
                    theme={{
                      backgroundColor: "#FEF9E5",
                      calendarBackground: "#FEF9E5",
                      dayTextColor: "#495BA2",
                      monthTextColor: "#495BA2",
                      arrowColor: "#788ABF",
                      todayTextColor: "#F5A58C",
                      selectedDayBackgroundColor: "#AABBEF",
                      selectedDayTextColor: "#fff",
                      textDisabledColor: "#ccc",
                    }}
                    style={{
                      width: 300,
                      paddingHorizontal: 0,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCalendar(false)}
                    style={{
                      marginTop: 12,
                      backgroundColor: "#788ABF",
                      paddingVertical: 10,
                      borderRadius: 10,
                      width: 50,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontFamily: "SpaceGrotesk",
                      }}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                </TouchableOpacity>
                </Modal>
              )}

              {/* Time Button */}
              <View className="">
                <TouchableOpacity
                  ref={timeBtnRef}
                  onPress={() => {
                    openTimePicker();
                    setShowCalendar(false);
                  }}
                  className="bg-[#D9D9D9] px-4 py-3 rounded-xl"
                >
                  <Text className="text-[#495BA2] text-base font-spaceGrotesk">
                    {time.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>

              {showTimePicker && Platform.OS === "ios" && (
              <Modal visible={showTimePicker} transparent animationType="fade">
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
                  activeOpacity={1}
                  onPress={() => setShowTimePicker(false)}
                />

                <View style={[modalBaseStyle, {top: timeAnchor.y + 50, left: timeAnchor.x - 200}]}>
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedTime) => {
                      if (selectedTime) setTime(selectedTime);
                    }}
                    style={{ width: "100%" }}
                    textColor="#495BA2" // soft blue text
                  />
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(false)}
                    style={{
                      marginTop: 12,
                      backgroundColor: "#788ABF", // same blue as elsewhere
                      paddingVertical: 10,
                      borderRadius: 10,
                      width: 50,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontFamily: "SpaceGrotesk",
                      }}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                </Modal>
              )}
            </View>

            <Text className="text-xl mt-4 font-bold my-2 font-spaceGrotesk">
              Who:
            </Text>

            {/* need to add this wrapper for flatlist & fading edges */}
            <View className="relative w-full">
              {/* WHO SECTION */}
              <FlatList
                data={members}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.uid.toString()}
                renderItem={({ item }) => (
                  <Animatable.View
                    animation={item.selected ? "pulse" : "zoomIn"}
                    duration={300}
                    className="items-center mx-2"
                  >
                    <TouchableOpacity
                      onPress={() => toggleMemberSelection(item.uid)}
                      className={`rounded-full border-2 ${
                        item.selected
                          ? "bg-red-200 border-red-600"
                          : "bg-gray-100 border-gray-200"
                      }`}
                    >
                      <View
                        style={{
                          backgroundColor: "rgba(254, 249, 229, 0.52)",
                          borderRadius: 9999,
                          overflow: "hidden",
                          height: 64,
                          width: 64,
                        }}
                      >
                        <Image
                          source={getAvatarSource(item)}
                          className="h-full w-full"
                          resizeMode="cover"
                        />
                      </View>
                    </TouchableOpacity>
                    <Text
                      className="text-xs text-center mt-1 font-spaceGrotesk text-custom-blue-200"
                      style={{ maxWidth: 70 }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </Animatable.View>
                )}
              />

              {/* left fading edge */}
              <View className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none">
                <LinearGradient
                  colors={["#FEF9E5", "rgba(254, 249, 229, 0)"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 0.75, y: 0.5 }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>

              {/* right fading edge */}
              <View className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none">
                <LinearGradient
                  colors={["rgba(254, 249, 229, 0)", "#FEF9E5"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 0.75, y: 0.5 }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </View>

            {/* RECURRENCE DROPDOWN */}
            <Animatable.View animation={"pulse"} duration={500}>
              <TouchableOpacity
                onPress={() =>
                  setShowRecurrenceDropdown(!showRecurrenceDropdown)
                }
                className="p-4 rounded-xl bg-gray-200 my-2 shadow-sm"
              >
                <Text className="text-lg font-spaceGrotesk text-custom-blue-200 font-semibold">
                  {recurrence}
                </Text>
              </TouchableOpacity>
            </Animatable.View>

            {/* dropdown menu */}
            {showRecurrenceDropdown && (
              <Animatable.View
                animation={showRecurrenceDropdown ? "pulse" : "zoomOut"}
                duration={300}
                className="bg-gray-200 p-2 rounded-xl shadow-md z-10"
              >
                {recurrenceOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => {
                      setRecurrence(option);
                      setShowRecurrenceDropdown(false);
                    }}
                    className="py-2 px-4"
                  >
                    <Text className="font-spaceGrotesk text-custom-blue-200">
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Animatable.View>
            )}

            {/* add points*/}
            <Text className="font-bold font-spaceGrotesk text-xl mt-4">
              add points: {selectedPoints} pts
            </Text>

            <View style={{ alignItems: "center", marginTop: 10, overflow: "visible" }}>
              <FlatList
                data={pointOptions}
                horizontal
                keyExtractor={(item) => item.toString()}
                renderItem={renderPointOption}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  justifyContent: "center",
                }}
              />
            </View>

            {/* TASK DESCRIPTION */}
            <Text className="text-xl font-bold my-2 font-spaceGrotesk">
              description
            </Text>
            <TextInput
              className="border-b border-gray-400 text-lg py-2 mb-4 font-spaceGrotesk"
              placeholder="Start typing to add details..."
              value={description}
              onChangeText={setDescription}
            />

            {/* DONE BUTTON */}
            <TouchableOpacity
              onPress={handleAddTask}
              className="self-center w-36 bg-custom-pink-200 py-4 rounded-lg mt-4 shadow-sm"
            >
              <Text className="text-center text-white text-xl font-bold font-spaceGrotesk">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

export default AddTaskScreen;
