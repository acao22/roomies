import React from "react";
import { View, Text, TextInput } from "react-native";

import { loginUser } from "../firebase/authFunctions";

const handleLogin = async () => {
  try {
    await loginUser(email, password);
    Alert.alert("Login successful");
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};


const SignUpScreen = () => {
  return (
    <View className="flex-1">
      <View className="justify-start items-start flex-col pl-[43px] pt-[174px]">
        <Text className="text-5xl font-bold text-custom-pink-200 font-spaceGrotesk">hey, roomie!</Text>
        <Text className="text-base text-custom-blue-200 font-spaceGrotesk mt-[6px]">sign up to start creating your room</Text>
      </View>

      <View className="justify-center items-center flex-col pt-[45px]">
      <TextInput
          placeholder="username"
          placeholderTextColor="#788ABF"  // Matching placeholder color
          className="w-5/6 h-[56px] bg-custom-gray text-large text-custom-blue-200 py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
        />
      </View>

      <View className="justify-center items-center flex-col pt-[16px]">
      <TextInput
          placeholder="password"
          placeholderTextColor="#788ABF"  // Matching placeholder color
          className="w-5/6 h-[56px] bg-custom-gray text-large text-custom-blue-200 py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
        />
      </View>

      <View className="justify-center items-center flex-col pt-[16px]">
      <TextInput
          placeholder="create account"
          placeholderTextColor="#000000"  // Matching placeholder color
          className="w-5/6 h-[56px] bg-custom-teal text-black py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
          style={{ textAlign: "center", textAlignVertical: "center", fontWeight: "bold" }}
        />
      </View>
    </View>
  );
};

export default LoginScreen;
