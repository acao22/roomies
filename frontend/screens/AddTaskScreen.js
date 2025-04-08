import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { addTask } from "../api/tasks.api.js";
import face1 from "../assets/face1.png";

import { getUserGroup, fetchAvatar } from "../api/users.api.js";
// hardcoded stuff for now
const userAvatars = {
  Luna: require("../images/avatar1.png"),
  Andrew: require("../images/avatar2.png"),
  Angie: require("../images/avatar3.png"),
  Default: require("../images/avatar4.png"),
};

const taskIcons = [
  { id: 1, name: "trash", icon: "trash-outline" },
  { id: 2, name: "dishes", icon: "fast-food-outline" },
  { id: 3, name: "vacuum", icon: "home-outline" },
  { id: 4, name: "clean", icon: "water-outline" },
  { id: 5, name: "restock", icon: "cart-outline" },
];

const groupMembers = [
  { id: 1, name: "Andrew", selected: false },
  { id: 2, name: "Christian", selected: false },
  { id: 3, name: "Luna", selected: false },
  { id: 4, name: "Angie", selected: false },
  { id: 5, name: "Kat", selected: false },
  { id: 6, name: "Nat", selected: false },
  { id: 7, name: "Hemo", selected: false },
  { id: 8, name: "Meow", selected: false },
];

const recurrenceOptions = [
  "Does not repeat",
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "Custom",
];

const pointOptions = [1, 5, 10, 15, 20];

const AddTaskScreen = ({ setActiveTab, user }) => {
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [members, setMembers] = useState([]);
  const [recurrence, setRecurrence] = useState(recurrenceOptions[0]);
  const [showRecurrenceDropdown, setShowRecurrenceDropdown] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedPoints, setSelectedPoints] = useState(1);


  useFocusEffect(
    React.useCallback(() => {
      const fetchGroupAndAvatars = async () => {
        try {
          const groupData = await getUserGroup();
          if (groupData && groupData.members) {
            // For each member, fetch the avatar using their uid.
            const membersWithAvatars = await Promise.all(
              groupData.members.map(async (member) => {
                try {
                  // Pass the uid as an argument to fetchAvatar
                  const avatarData = await fetchAvatar(member.uid);
                  return { ...member, avatar: avatarData.uri };
                } catch (err) {
                  console.error(
                    `Error fetching avatar for ${member.uid}:`,
                    err
                  );
                  // Use a default avatar if fetching fails
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
        members.filter((m) => m.selected).map((m) => m.firstName),
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
        width: 52,
      }}
      >
        <Text className="font-spaceGrotesk text-xl text-white">{`+${item}`}</Text>
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
              className="max-h-[160px] my-4"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedIcon(item.id)}
                  className={`m-1 p-4 rounded-full ${
                    selectedIcon === item.id
                      ? "border-2 border-blue-500"
                      : "border-[#F5D2C8]"
                  } bg-[#F5D2C8] bg-opacity-50 w-24 h-24 flex items-center justify-center`}
                >
                  <Ionicons name={item.icon} size={30} color="#788ABF" />
                  <Text className="text-center text-sm text-custom-blue-200 mt-1 font-spaceGrotesk">
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* DATE & TIME PICKERS */}
            <Animatable.View
              animation={"slideInRight"}
              duration={300}
              className="flex-row items-center justify-between mt-12 my-4"
            >
              <Ionicons name="time-outline" size={30} color="#788ABF" />
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="p-3 rounded-xl bg-gray-200 m-2 shadow-sm"
              >
                <Text className="text-lg font-spaceGrotesk text-custom-blue-200 font-semibold">
                  {date.toDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="p-3 rounded-xl bg-gray-200 shadow-sm"
              >
                <Text className="text-lg font-spaceGrotesk text-custom-blue-200 font-semibold">
                  {time.getHours()}:
                  {time.getMinutes().toString().padStart(2, "0")} pm
                </Text>
              </TouchableOpacity>
            </Animatable.View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={(_, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setTime(selectedTime);
                }}
              />
            )}

            <Text className="text-xl font-bold my-2 font-spaceGrotesk">Who:</Text>

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
                    // pulse on select, zoom on enter
                    animation={item.selected ? "pulse" : "zoomIn"}
                    duration={300}
                  >
                    <TouchableOpacity
                      onPress={() => toggleMemberSelection(item.uid)}
                      className={`m-1 rounded-full border-2 ${
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
                  </Animatable.View>
                )}
              />

              {/* left fading edge */}
              <View className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none">
                <LinearGradient
                  colors={["#FEF9E5", "rgba(254, 249, 229, 0)"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>

              {/* right fading edge */}
              <View className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none">
                <LinearGradient
                  colors={["rgba(254, 249, 229, 0)", "#FEF9E5"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </View>

            {/* RECURRENCE DROPDOWN */}
            <Animatable.View animation={"pulse"} duration={500}>
              <TouchableOpacity
                onPress={() => setShowRecurrenceDropdown(!showRecurrenceDropdown)}
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
            <Text className="font-bold font-spaceGrotesk text-xl mt-4">add points: {selectedPoints} pts</Text>
            <FlatList
              data={pointOptions}
              horizontal
              keyExtractor={(item) => item.toString()}
              renderItem={renderPointOption}
              contentContainerStyle={{ paddingVertical: 10}}
            />

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

