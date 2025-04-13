import React from "react";
import { View, Text, Image } from "react-native";

export default function EditProfile() {
  return (
    <View className="flex-1 items-center justify-center bg-[#FFE7C0]">
        <Text className="ml-[-256] text-left text-2xl mb-12 font-bold text-[#495BA2]">&lt; profile</Text>


      {/* Avatar Section */}
      <View className="w-96 h-44 rounded-3xl bg-[#495BA2] items-center justify-center mb-12">
        <View className="flex-row items-center gap-12">
          <View className="w-28 h-28 rounded-full bg-[#FFE7C0] overflow-hidden items-center justify-center">
            <Image
              source={require("../assets/face1.png")}
              className="w-28 h-28"
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl font-semibold text-[#FEF9E5]">edit avatar</Text>
        </View>
      </View>

      {/* Second Card Section */}
      <View className="w-96 h-96 rounded-3xl bg-[#495BA2] items-center justify-center mb-12">
        {/* Add content here later */}
      </View>

      {/* leave my room Section */}
      <View className="w-48 h-12 rounded-3xl bg-[#FF3D00] items-center justify-center ">
        {/* Add content here later */}
      </View>
    </View>

  );
}
