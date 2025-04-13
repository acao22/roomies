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

const AddTaskScreen = ({ setActiveTab, currentUser }) => {
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [members, setMembers] = useState(groupMembers);
  const [recurrence, setRecurrence] = useState(recurrenceOptions[0]);
  const [showRecurrenceDropdown, setShowRecurrenceDropdown] = useState(false);
  const [description, setDescription] = useState("");

  const toggleMemberSelection = (id) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, selected: !member.selected } : member
      )
    );
  };

  const handleIconPress = (item) => {
    setSelectedIcon(item.id);
    setTitle(item.name);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow);
    setTime(new Date());

    setMembers(
      groupMembers.map((member) =>
        member.name === currentUser
          ? { ...member, selected: true }
          : { ...member, selected: false }
      )
    );

    setRecurrence("Does not repeat");
    setDescription("");
  };

  return (
    <FlatList
      data={[{}]}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={() => (
        <View className="flex-1 bg-custom-tan p-5">
          {/* BACK BUTTON */}
          <TouchableOpacity onPress={() => setActiveTab("tasks")} className="mb-4">
            <Text className="text-xl text-custom-blue-200 font-bold underline font-spaceGrotesk">
              ← back
            </Text>
          </TouchableOpacity>

          {/* TASK TITLE */}
          <Text className="text-2xl font-bold font-spaceGrotesk">Add title</Text>
          <TextInput
            className="border-b border-gray-400 text-lg py-2 mb-4 font-spaceGrotesk"
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
          />

          {/* PRESET TASK ICONS */}
          <Text className="text-gray-600 font-spaceGrotesk">
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
                onPress={() => handleIconPress(item)}
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

          {/* WHO SECTION */}
          <Text className="text-xl font-bold my-2 font-spaceGrotesk">Who:</Text>
          <View className="relative w-full">
            <FlatList
              data={members}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Animatable.View
                  animation={item.selected ? "pulse" : "zoomIn"}
                  duration={300}
                >
                  <TouchableOpacity
                    onPress={() => toggleMemberSelection(item.id)}
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
                        source={
                          userAvatars[item.name] || userAvatars["Default"]
                        }
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableOpacity>
                </Animatable.View>
              )}
            />
            {/* Fading Edges */}
            <View className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none">
              <LinearGradient
                colors={["#FEF9E5", "rgba(254, 249, 229, 0)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
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

          {showRecurrenceDropdown && (
            <Animatable.View
              animation="pulse"
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

          {/* DESCRIPTION */}
          <Text className="text-xl font-bold my-2 font-spaceGrotesk">
            Add description
          </Text>
          <TextInput
            className="border-b border-gray-400 text-lg py-2 mb-4 font-spaceGrotesk"
            placeholder="Start typing to add details..."
            value={description}
            onChangeText={setDescription}
          />

          {/* DONE BUTTON */}
          <TouchableOpacity className="self-center w-36 bg-custom-pink-200 py-4 rounded-lg mt-4 shadow-sm">
            <Text className="text-center text-white text-xl font-bold font-spaceGrotesk">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default AddTaskScreen;
