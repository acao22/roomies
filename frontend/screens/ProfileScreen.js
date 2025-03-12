import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();

  // hardcoded data for now
  const roomies = [
    { id: "1", name: "roomie #1", Image: "bg-[#FF8C83]" },
    { id: "2", name: "roomie #2", bgClass: "bg-[#FFB95C]" },
    { id: "3", name: "roomie #3", bgClass: "bg-[#6CD8D5]" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* hamburger menu */}
      <View className="flex-row justify-start px-4 mt-2">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Calendar")}
        ></TouchableOpacity>
      </View>

      {/* pfp + name + rating */}
      <View className="items-center mt-4">
        {/* avatar circle */}
        <View className="relative">
          <View className="w-32 h-32 rounded-full bg-[#C8F2F1] items-center justify-center">
            <Ionicons name="person" size={60} color="#00B8B6" />
          </View>

          {/* pencil edit icon w/ absolute overlate */}
          <TouchableOpacity
            onPress={() => {
              console.log("edit profile picture / go to AvatarCreation");
              navigation.navigate("AvatarCreation")
            }}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#6CD8D5] items-center justify-center"
          >
            <Ionicons name="pencil" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* user name */}
        <Text className="text-lg font-bold text-[#00B8B6] mt-3">
          first last
        </Text>
        {/* rating + star */}
        <View className="flex-row items-center mt-1">
          <Text className="text-base text-[#BFBFBF] mr-1">201,885</Text>
          <Ionicons name="star" size={16} color="#FBBF24" />
        </View>
      </View>

      {/* roomies list */}
      <View className="mt-6 px-4">
        <Text className="p-4 text-2xl font-semibold text-[#6D6D6D] mb-2">
          your roomies
        </Text>
        <ScrollView className="bg-gray-100 rounded-xl">
          {roomies.map((roomie) => (
            <View
              key={roomie.id}
              className="flex-row items-center px-4 py-3 border-b border-gray-200"
            >
              {/* colored circle for each roomie */}
              <View
                className={`w-12 h-12 rounded-full mr-3 items-center justify-center ${roomie.bgClass}`}
              >
                <Ionicons name="person" size={24} color="white" />
              </View>
              <Text className="text-xl text-gray-800">{roomie.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* leave btn */}
        <View className="items-end mt-2">
          <TouchableOpacity
            onPress={() => console.log("leave pressed")}
            className="px-4 py-2 bg-gray-200 rounded-full"
          >
            <Text className="text-sm text-gray-700">leave</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
