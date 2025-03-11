import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const AvatarCreation = () => {
  return (
    <View className="flex-1 bg-[#788ABF]">
        {/* Avatar Title */}
        <View className="flex-1 items-center justify-center pt-8">
            <Text className="m-10 text-white text-4xl font-bold font-spaceGrotesk">
            my avatar
            </Text>

            {/* Circle */}
            <View className="w-72 h-72 bg-[#FFD49B] rounded-full" />

            <View className="pt-6 w-full flex flex-row flex-wrap justify-between">

                {/* change to toggle */}
                <TouchableOpacity
                    onPress={() => {
                        console.log("save and go back");
                    }}
                    className="w-28 h-12 rounded-full bg-white items-left ml-4"
                    >
                </TouchableOpacity>

                {/* done button */}
                <TouchableOpacity
                    onPress={() => {
                        console.log("save and go back");
                    }}
                    className="w-28 pt-1 h-10 rounded-full bg-[#FFB95C] items-center mr-4"
                    >
                <Text className="text-white text-2xl font-bold font-spaceGrotesk">done</Text>
                </TouchableOpacity>
                
            </View>
        </View>

      {/*Bottom Section - Avatar Options (orange boxes) */}
      <View className="justify-end flex w-full h-[45%] justify-center bg-[#F5A58C] ">
        <View className="absolute top-0 justify-start w-full bg-[#f6b59d] p-5 items-center">
          <Text className="text-[#FEF9E5] text-4xl font-bold font-spaceGrotesk">
            eyes
          </Text>
        </View>
        <View className="w-full opacity-0% p-4 items-center justify-top"></View>
      </View>

    </View>
  );
};

export default AvatarCreation;
