import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from "react-native";

import { loginUser } from "../firebase/authFunctions";
import { useNavigation } from "@react-navigation/native";



const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const gridImage = require('../assets/grid.png');


  const handleLogin = async () => {
    try {
      const userCredential = await loginUser(email, password);
      if (userCredential) {
        Alert.alert("Login successful", "", [
          {
            text: "OK",
            onPress: () => navigation.replace('Main'),
          }
        ]);

      } else {
        Alert.alert("Error", "Unexpected error ocurred.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <ImageBackground source={gridImage} className="flex-1 bg-bg bg-custom-tan">
    
    <View className="flex-1">
      <View className="justify-start items-start flex-col pl-[43px] pt-[174px]">
        <Text className="text-5xl font-bold text-custom-pink-200 font-spaceGrotesk">log in</Text>
        <Text className="text-base text-custom-blue-200 font-spaceGrotesk mt-[6px]">welcome back!</Text>
      </View>

      <View className="justify-center items-center flex-col pt-[45px]">
      <TextInput
          placeholder="email"
          placeholderTextColor="#788ABF"  // Matching placeholder color
          className="w-5/6 h-[56px] bg-custom-gray text-large text-custom-blue-200 py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View className="justify-center items-center flex-col pt-[16px]">
      <TextInput
          placeholder="password"
          placeholderTextColor="#788ABF"  // Matching placeholder color
          className="w-5/6 h-[56px] bg-custom-gray text-large text-custom-blue-200 py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View className="justify-center items-center flex-col pt-[16px]">
          <TouchableOpacity
            onPress={handleLogin}
            className="w-5/6 h-[56px] bg-custom-teal justify-center items-center rounded-3xl"
          >
            <Text className="text-black font-spaceGrotesk text-2xl font-bold">
              Login
            </Text>
          </TouchableOpacity>
        </View>
    </View>
    </ImageBackground>
  );
};

export default LoginScreen;
