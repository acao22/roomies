import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const avatars = [
  require("../images/avatar1.png"),
  require("../images/avatar2.png"),
  require("../images/avatar3.png"),
  require("../images/avatar4.png"),
];

const feedItems = [
  {
    id: "1",
    userName: "Angie",
    taskName: "trash",
    timeAgo: "7 min ago",
    message: "yay! i just took out the trash.",
    image: require("../images/task1.png"),
  },
  {
    id: "2",
    userName: "Luna",
    taskName: "recycling",
    timeAgo: "34 min ago",
    message: "skibidi",
    image: require("../images/task2.png"),
  },
  {
    id: "3",
    userName: "Katherine",
    taskName: "poop",
    timeAgo: "24 years ago",
    message: "i just pooped",
    image: require("../images/task1.png"),
  },
];

export default function GroupFeedScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-[#FEF9E5]">
      <ScrollView>
        <View className="bg-[#F5A58C] w-full h-48 absolute top-0 z-0" />

        {/* temp button for landing page for testing */}
        <TouchableOpacity
          className="bg-[#9CABD8]  p-3 rounded-full mx-4 mt-14 absolute z-10"
          onPress={() => navigation.replace("Landing")}
        >
          <Text className="text-white font-bold text-lg">Landing Page</Text>
        </TouchableOpacity>

        {/* avatars row, need to fix this spacing later */}
        <View className="flex-row justify-between px-24 mt-40">
          {avatars.map((avatar, index) => (
            <View
              key={index}
              className="rounded-full overflow-hidden h-16 w-16 bg-[#FEF9E5] shadow-md"
            >
              <Image source={avatar} className="h-16 w-16" resizeMode="cover" />
            </View>
          ))}
        </View>
        {/* group name section */}
        <View className="mt-4 items-center">
          <Text className="text-4xl font-bold text-[#788ABF]">group name</Text>
          <TouchableOpacity>
            <Text className="text-sm text-[#9CABD8]">edit group</Text>
          </TouchableOpacity>
        </View>
        {/* feed list */}
        <View className="mt-6 px-4">
          {feedItems.map((item) => (
            <View
              key={item.id}
              className="bg-[#9CABD8] rounded-2xl p-4 mb-6 shadow-sm"
            >
              {/* user & task info */}
              <Text className="text-[#FEF9E5] font-bold text-lg">
                {item.userName} completed “{item.taskName}”!
              </Text>

              {/* image if input */}
              <View className="mt-3 rounded-xl overflow-hidden">
                <Image
                  source={item.image}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              </View>

              {/* msg & time */}
              <View className="flex-row items-center space-x-2 mt-3">
                <Image
                  source={avatars[0]}
                  className="h-10 w-10 rounded-full bg-gray-300"
                />
                <Text className="mx-2 text-[#FEF9E5] text-lg">
                  {item.message}
                </Text>
              </View>

              <Text className="text-[#FEF9E5] font-bold text-xs mt-1">
                {item.timeAgo}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
