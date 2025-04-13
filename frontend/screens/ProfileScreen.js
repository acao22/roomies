import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-[#FEF9E5] z-0 px-6 py-12 items-center">
      {/* Avatar + edit */}
      <View className="mt-10 w-40 h-40 z-0 relative rounded-full bg-[#FFE7C0] items-center justify-center mb-4">
        <Image
          source={require("../assets/face1.png")}
          className="w-36 h-36 rounded-full"
          resizeMode="cover"
        />
         <TouchableOpacity
            onPress={() => navigation.navigate("AvatarCreation")}
            className="absolute bottom-2 z-10 right-2 w-8 h-8 rounded-full bg-[#FFB95C] items-center justify-center"
          >
            <Ionicons name="pencil" size={16} color="#FFFFFF" />
          </TouchableOpacity>

      </View>
      
      <Text className="text-3xl font-semibold text-[#495BA2]">*insert name*</Text>
      <Pressable onPress={() => navigation.navigate("EditProfile")}>
        <Text className="self-center text-2xl mb-12 text-[#495BA2] underline">
          edit profile
        </Text>

      <View className="w-96 h-56 rounded-3xl bg-[#FFD49B] items-center justify-center mb-8">
        <View className="flex-row">
          <Text className="text-3xl font-semibold text-[#495BA2]">roomies </Text>
        </View>

      </View>
      <View className="w-96 h-56 rounded-3xl bg-[#A9AFC7] items-center justify-center mb-24 opacity-25%">
        <View className="flex-row">
          <Text className="text-3xl font-semibold text-[#495BA2]">[room view] {"\n"} In Progress </Text>
        </View>

      </View>

    </Pressable>
    </View>
  );
};

export default ProfileScreen;
