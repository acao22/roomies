import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import face1 from '../assets/face1.png';
import home from '../assets/HomeSample.png';
import { Ionicons } from "@expo/vector-icons";
import history from '../assets/history.png';



const ProfileScreen = () => {
  const navigation = useNavigation();

  // hardcoded data for now
  const roomies = [
    { id: "1", name: "roomie #1", bgClass: "bg-[#FF8C83]" },
    { id: "2", name: "roomie #2", bgClass: "bg-[#FFB95C]" },
    { id: "3", name: "roomie #3", bgClass: "bg-[#6CD8D5]" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-custom-tan">
      <ScrollView>

      <View className="bg-custom-yellow w-full h-52 absolute top-0 z-0">
        <Text className="font-spaceGrotesk text-white mt-20 ml-10 text-2xl font-bold">Welcome back, [username]</Text>
        <Text className="font-spaceGrotesk text-custom-blue-100 ml-10">Day 365 of rooming</Text>
      </View>

      
      {/* pfp + name + rating */}
      <View className="items-center mt-36">
        {/* avatar circle */}
        <View className="relative">
          <View className="w-32 h-32 rounded-full bg-custom-tan items-center justify-center">
                <Image source={face1} className="w-32 h-32" />
          </View>

          {/* pencil edit icon w/ absolute overlate */}
          <TouchableOpacity
            onPress={() => console.log("edit profile picture")}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-ful items-center justify-center"
          >
            <Ionicons name="pencil" size={16} color="#788ABF" />
          </TouchableOpacity>
        </View>

        {/* user name */}
        <Text className="text-lg font-bold text-custom-black mt-3">
          first last
        </Text>
        {/* rating + star */}
        <View className="flex-row items-center mt-1">
          <Text className="text-base text-custom-black mr-1 font-spaceGrotesk">87 points</Text>
        </View>
      </View>

      {/* roomies list */}
      <View className="mt-6 px-6">
        <View className="flex-row flex-1 justify-between items-center">
          <Text className="p-4 text-2xl font-semibold text-custom-black mb-2">
            My homes
          </Text>
          <Text className="right-0 text-custom-blue-100">
            Edit
          </Text>
        </View>
        <View className="bg-custom-blue-100 rounded-xl p-6 w-full items-center justify-center">
          <Image source={home} className="w-50 h-50" />
          <Text className="font-bold font-spaceGrotesk text-custom-black text-xl mt-3">Group name</Text>
        </View>
        { /* might beed later so I just commented out 
        {/*
        <ScrollView className="bg-gray-100 rounded-xl">
          {roomies.map((roomie) => (
            <View
              key={roomie.id}
              className="flex-row items-center px-4 py-3 border-b border-gray-200"
            >
              {/* colored circle for each roomie 
              <View
                className={`w-12 h-12 rounded-full mr-3 items-center justify-center ${roomie.bgClass}`}
              >
                <Ionicons name="person" size={24} color="white" />
              </View>
              <Text className="text-xl text-gray-800">{roomie.name}</Text>
            </View>
          ))}
        </ScrollView>

        /*}

        {/* leave btn */}
        <Text className="p-4 text-2xl font-bold text-custom-black mb-2 mt-10 font-spaceGrotesk">
          Settings
        </Text>
        <View className="mb-6">
          <View className="bg-[#F5A58C] rounded-xl p-8 w-full justify-between mb-6 flex-row items-center">
            <Text className="text-white font-bold font-spaceGrotesk text-2xl">Notifications</Text>
            <Ionicons name="notifications" size={32} color="white" />

          </View>
          <View className="bg-[#F5A58C] rounded-xl p-8 w-full justify-between mb-6 flex-row items-center">
            <Text className="text-white font-bold font-spaceGrotesk text-2xl">Password</Text>
            <Ionicons name="pencil" size={32} color="white" />

          </View>
          <View className="bg-[#F5A58C] rounded-xl p-8 w-full justify-between mb-6 flex-row items-center">
            <Text className="text-white font-bold font-spaceGrotesk text-2xl">Display</Text>
            <Ionicons name="moon" size={32} color="white" />

          </View>
          <View className="bg-[#F5A58C] rounded-xl p-8 w-full justify-between mb-6 flex-row items-center">
            <Text className="text-white font-bold font-spaceGrotesk text-2xl">Archived</Text>
            <Image source={history} className="w-10 h-10" style={{tintColor: 'white'}} />

          </View>

        </View>
        <View className="items-end mt-2">
          <TouchableOpacity
            onPress={() => console.log("leave pressed")}
            className="px-4 py-2 bg-gray-200 rounded-full"
          >
            <Text className="text-sm text-gray-700">leave</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
