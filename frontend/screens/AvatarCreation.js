import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const AvatarCreation = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <View className="flex-1 bg-[#788ABF]">
      {/* Avatar Title */}
      <View className="flex-1 items-center justify-center pt-8">
        <Text className="m-10 text-white text-4xl font-bold font-spaceGrotesk">
          my avatar
        </Text>

        {/* Avatar Circle */}
        <View className="w-72 h-72 bg-[#FFD49B] rounded-full items-center justify-center overflow-hidden"></View>

        <View className="pt-6 w-full flex flex-row justify-between px-8">
          
          {/* Toggle Button */}
          <Pressable
            onPress={() => {
              console.log(`toggle ${isToggled}`);
              setIsToggled(!isToggled);
            }}
            className="w-28 h-12 rounded-full bg-white flex-row items-center justify-between relative"
          >
            {/* Toggle Circle */}
            <View
              className="w-12 h-12 bg-[#FFB95C] rounded-full"
              style={{
                position: "absolute", // To allow left-right movement
                left: isToggled ? "74%" : "-17%", // Conditional positioning
                transform: [{ translateX: isToggled ? -16 : 16 }], // Center the circle when toggled
                transition: "all 0.3s ease",
              }}
            />
            {/* Dark Hair Image */}
            <Image
              source={require("../../frontend/assets/dark hair/hair-m4-dark.png")}
              className="w-20 h-20 absolute left-0 -ml-[17%]"
              resizeMode="contain"
            />

            {/* Light Hair Image */}
            <Image
              source={require("../../frontend/assets/light hair/hair-m4-light.png")}
              className="w-20 h-20 absolute right-0 -mr-[15%]"
              resizeMode="contain"
            />
            
          </Pressable>

          {/* Done Button */}
          <TouchableOpacity
            onPress={() => {
              console.log("save and go back");
            }}
            className="w-28 h-12 rounded-full bg-[#FFB95C] items-center justify-center"
          >
            <Text className="text-white text-2xl font-bold font-spaceGrotesk">done</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Section - Avatar Options */}
      <View className="w-full h-[45%] bg-[#F5A58C] flex justify-center">
        <View className="absolute top-0 w-full bg-[#f6b59d] p-5 flex-row justify-between items-center">
          <TouchableOpacity onPress={() => console.log("go left")}>
            <Text className="text-white text-4xl font-bold font-spaceGrotesk">{"<"}</Text>
          </TouchableOpacity>

          <Text className="text-[#FEF9E5] text-4xl font-bold font-spaceGrotesk">eyes</Text>

          <TouchableOpacity onPress={() => console.log("go right")}>
            <Text className="text-white text-4xl font-bold font-spaceGrotesk">{">"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AvatarCreation;
