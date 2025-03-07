import React, {useState} from "react";
import { View, Text, TextInput, ImageBackground } from "react-native";
const gridImage = require('../assets/grid.png');


import { registerUser } from "../firebase/authFunctions";

const SignUpScreen = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(email, password);
      Alert.alert("Registration successful");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ImageBackground source={gridImage} className="flex-1 bg-bg bg-custom-tan">
    
    <View className="flex-1">
      <View className="justify-start items-start flex-col pl-[43px] pt-[174px]">
        <Text className="text-5xl font-bold text-custom-pink-200 font-spaceGrotesk">hey, roomie!</Text>
        <Text className="text-base text-custom-blue-200 font-spaceGrotesk mt-[6px]">sign up to start creating your room</Text>
      </View>

      <View className="justify-center items-center flex-col pt-[45px]">
      <TextInput
          placeholder="first name"
          placeholderTextColor="#788ABF"  // Matching placeholder color
          className="w-5/6 h-[56px] bg-custom-gray text-large text-custom-blue-200 py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
        />
      </View>

      <View className="justify-center items-center flex-col pt-[16px]">
      <TextInput
          placeholder="last name"
          placeholderTextColor="#788ABF"  // Matching placeholder color
          className="w-5/6 h-[56px] bg-custom-gray text-large text-custom-blue-200 py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
        />
      </View>

      <View className="justify-center items-center flex-col pt-[16px]">
      <TextInput
          placeholder="email"
          placeholderTextColor="#FEF9E5"  // Matching placeholder color
          className="w-5/6 h-[56px] bg-custom-pink-100 text-custom-tan py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
        />
      </View>

      <View className="justify-center items-center flex-col pt-[16px]">
      <TextInput
          placeholder="password"
          placeholderTextColor="#FEF9E5"  // Matching placeholder color
          className="w-5/6 h-[56px] bg-custom-pink-100 text-custom-tan py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
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
    </ImageBackground>
  );
};

export default SignUpScreen;
