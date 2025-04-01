import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import face1 from '../assets/face1.png';
import home from '../assets/HomeSample.png';
import { Ionicons } from "@expo/vector-icons";
import history from '../assets/history.png';
import CustomModal from "./AddGroupModal";
import { getUserInfo, getUserGroup, fetchAvatar } from "../api/users.api.js";



import { logoutUser } from "../api/users.api";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ setUser }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {firstName, lastName} = await getUserInfo();
        setUserData({firstName: firstName, lastName: lastName});

        const {groupName, members} = await getUserGroup();
        setUserGroup({groupName: groupName, members: members});

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch the user's avatar URI from your API
    const loadAvatar = async () => {
      try {
        const uri = await fetchAvatar();
        console.log(uri.uri);
        setAvatarUri(uri.uri);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    loadAvatar();
  }, []);




  const handleLogout = async () => {
    try {
      await logoutUser(setUser);
      Alert.alert("Logged Out", "You have been successfully logged out.");

      const token = await AsyncStorage.getItem("idToken");
      console.log("Token after logout:", token);
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Failed to log out. Try again.");
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = () => {
    // Optionally, add logic to save profile changes here
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-custom-tan">
      <ScrollView>

      <View className="absolute top-0 left-0 right-0 bg-custom-yellow h-72 rounded-b-3xl z-0 items-center">
        
       <View className="items-center pt-10">
        <View className="relative">

        
          <View className="w-32 h-32 rounded-full bg-custom-tan items-center justify-center">
                <Image source={avatarUri && typeof avatarUri === "string" && avatarUri.trim().length > 0 ? { uri: avatarUri } : face1} className="w-32 h-32" />
          </View>

          {/* pencil edit icon w/ absolute overlate */}
          <TouchableOpacity
            onPress={() => {
              console.log("edit profile picture / go to AvatarCreation");
              navigation.navigate("AvatarCreation", { origin: "ProfileScreen"})
            }}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full items-center justify-center"
          >
            <Ionicons name="pencil" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          </View>
        </View>
        <Text className="font-spaceGrotesk text-white mt-6 text-4xl font-bold"> {userData ? `${userData.firstName} ${userData.lastName}` : "first last"}</Text>
        <Text className="font-spaceGrotesk text-custom-blue-100 ml-10">87 pts</Text>
      </View>

    

      {/* roomies list */}
      
      <View className="mt-4 pt-72 px-6">
        <Text className="p-4 text-l text-custom-blue-200 mb-2 font-spaceGrotesk ">
          Day 365 of rooming
        </Text>
        <View className="flex-row flex-1 justify-between items-center">
          
          <Text className="pl-4 text-2xl font-bold text-custom-blue-200 mb-2 font-spaceGrotesk ">
            My homes
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
          >
            <Text className="right-0 text-custom-blue-100 font-spaceGrotesk pr-4">
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        <View className="bg-custom-blue-100 rounded-xl p-6 w-full items-center justify-center">
          <Image source={home} className="w-50 h-50" />
          <Text className="font-bold font-spaceGrotesk text-custom-black text-xl mt-3">{userGroup ? `${userGroup.groupName}` : "you loner roomie"}</Text>
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
        <Text className="p-4 text-2xl font-bold text-custom-blue-200 mb-2 mt-10 font-spaceGrotesk">
          Settings
        </Text>
        <View className="mb-6">
          <TouchableOpacity className="bg-[#F5A58C] rounded-xl p-8 w-full justify-between mb-6 flex-row items-center">
            <Text className="text-white font-bold font-spaceGrotesk text-2xl">Notifications</Text>
            <Ionicons name="notifications" size={32} color="white" />

          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#F5A58C] rounded-xl p-8 w-full justify-between mb-6 flex-row items-center" 
            onPress={() => navigation.navigate("Password")}
          >
            <Text className="text-white font-bold font-spaceGrotesk text-2xl">Password</Text>
            <Ionicons name="pencil" size={32} color="white" />

          </TouchableOpacity>
          <TouchableOpacity className="bg-[#F5A58C] rounded-xl p-8 w-full justify-between mb-6 flex-row items-center">
            <Text className="text-white font-bold font-spaceGrotesk text-2xl">Display</Text>
            <Ionicons name="moon" size={32} color="white" />

          </TouchableOpacity>
          <TouchableOpacity className="bg-[#F5A58C] rounded-xl p-8 w-full justify-between mb-6 flex-row items-center">
            <Text className="text-white font-bold font-spaceGrotesk text-2xl">Archived</Text>
            <Image source={history} className="w-10 h-10" style={{tintColor: 'white'}} />

          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Text className="font-spaceGrotesk text-custom-blue-100 text-xl">Logout</Text>
          </TouchableOpacity>

        </View>

      </View>
      </ScrollView>
      <CustomModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;


 