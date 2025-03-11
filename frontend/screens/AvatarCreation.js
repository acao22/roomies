import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const AvatarCreation = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#788ABF]">
        {/* Avatar Title */}
        <View className="flex-1 items-center justify-center">
            <Text className="text-white text-5xl font-bold font-spaceGrotesk">
            my avatar
            </Text>

            {/* Circle */}
            <View className="w-72 h-72 bg-[#FFD49B] rounded-full m-10" />
            {/* done button */}
            <TouchableOpacity
                onPress={() => {
                    console.log("save and go back");
                }}
                className="w-28 h-10 rounded-full bg-[#FFB95C] items-center justify-center"
                >
            <Text className="text-white text-2xl font-bold font-spaceGrotesk">done</Text>
            </TouchableOpacity>
        </View>

      {/* Bottom Section - Avatar Options */}
      <View className="justify-end flex max-w-full max-h-full justify-center bg-[#F5A58C]">
        <View className="w-full bg-[#f6b59d] p-8 items-center">
          <Text className="text-[#FEF9E5] text-4xl font-bold font-spaceGrotesk">
            eyes
          </Text>
        </View>
        <View className="w-full opacity-0% p-4 items-center h-64"></View>
      </View>
    </SafeAreaView>
  );
};

export default AvatarCreation;
