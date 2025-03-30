import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import Ionicons from  "@expo/vector-icons/Ionicons";
import { registerUser } from "../api/users.api.js";
import { useNavigation, useRoute } from "@react-navigation/native";

const gridImage = require("../assets/grid.png");

const SignUpScreen = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const origin = route.params?.origin || "Landing";

  const handleRegister = async () => {
    try {
      const userCredential = await registerUser(email, password, firstName, lastName);
      if (userCredential) {
        setUser(userCredential);
        
        Alert.alert("Registration successful", "", [
          {
            text: "OK",
          },
        ]);
        navigation.replace("Group")
      } else {
        Alert.alert("Error", "Unexpected error occurred.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ImageBackground source={gridImage} className="flex-1 bg-bg bg-custom-tan">
      <View className="flex-1">
        {/* back button */}
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.replace(origin);
            } else {
              navigation.navigate("Landing");
            }
          }}
          className="absolute top-16 left-5 p-3 z-10"
        >
          <Ionicons name="arrow-back" size={28} color="#F4A261" />
        </TouchableOpacity>

        <View className="justify-start items-start flex-col pl-[43px] pt-[174px]">
          <Text className="text-5xl font-bold text-custom-pink-200 font-spaceGrotesk">
            hey, roomie!
          </Text>
          <Text className="text-base text-custom-blue-200 font-spaceGrotesk mt-[6px]">
            sign up to start creating your room
          </Text>
        </View>

        <View className="justify-center items-center flex-col pt-[45px]">
          <TextInput
            placeholder="first name"
            placeholderTextColor="#788ABF" // Matching placeholder color
            onChangeText={setFirstName}
            className="w-5/6 h-[56px] bg-custom-gray text-large text-custom-blue-200 py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
          />
        </View>

        <View className="justify-center items-center flex-col pt-[16px]">
          <TextInput
            placeholder="last name"
            placeholderTextColor="#788ABF" // Matching placeholder color
            className="w-5/6 h-[56px] bg-custom-gray text-large text-custom-blue-200 py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
            onChangeText={setLastName}
          />
        </View>

        <View className="justify-center items-center flex-col pt-[16px]">
          <TextInput
            placeholder="email"
            placeholderTextColor="#FEF9E5" // Matching placeholder color
            className="w-5/6 h-[56px] bg-custom-pink-100 text-custom-tan py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="justify-center items-center flex-col pt-[16px]">
          <TextInput
            placeholder="password"
            placeholderTextColor="#FEF9E5" // Matching placeholder color
            className="w-5/6 h-[56px] bg-custom-pink-100 text-custom-tan py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="justify-center items-center flex-col pt-[16px]">
          <TouchableOpacity
            onPress={handleRegister}
            className="w-5/6 h-[56px] bg-custom-teal justify-center items-center rounded-3xl"
          >
            <Text className="text-black font-spaceGrotesk text-2xl font-bold">
              Create Account
            </Text>
          </TouchableOpacity>

          <Text className="text-xl font-spaceGrotesk text-[#504E4D] mt-6">
            already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login", { origin: "Signup"} )}>
            <Text className="underline text-xl text-[#504E4D]">login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignUpScreen;
