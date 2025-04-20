import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Animated,
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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

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
          <Ionicons name="arrow-back" size={28} color="#495BA2" />
        </TouchableOpacity>

        <Animated.View style={{ opacity: fadeAnim }}>
          <View className="justify-start items-start flex-col pl-[43px] pt-[174px]">
            <Text className="text-5xl font-bold text-custom-blue-200 font-spaceGrotesk">
              hey, roomie!
            </Text>
            <Text className="text-base text-custom-blue-100 font-spaceGrotesk mt-[6px]">
              sign up to start creating your room
            </Text>
          </View>

          <View className="justify-center items-center flex-col pt-[45px]">
            <TextInput
              placeholder="first name"
              placeholderTextColor="#788ABF"
              onChangeText={setFirstName}
              className="w-5/6 h-[40px] border-b-2 border-custom-blue-100 font-spaceGrotesk text-2xl"
            />
          </View>

          <View className="justify-center items-center flex-col pt-[24px]">
            <TextInput
              placeholder="last name"
              placeholderTextColor="#788ABF"
              className="w-5/6 h-[40px] border-b-2 border-custom-blue-100 font-spaceGrotesk text-2xl"
              onChangeText={setLastName}
            />
          </View>

          <View className="justify-center items-center flex-col pt-[24px]">
            <TextInput
              placeholder="email"
              placeholderTextColor="#788ABF"
              className="w-5/6 h-[40px] border-b-2 border-custom-blue-100 font-spaceGrotesk text-2xl"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="justify-center items-center flex-col pt-[24px]">
            <TextInput
              placeholder="password"
              placeholderTextColor="#788ABF"
              className="w-5/6 h-[40px] border-b-2 border-custom-blue-100 font-spaceGrotesk text-2xl"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View className="justify-center items-center flex-col pt-[16px]">
            <TouchableOpacity
              onPress={handleRegister}
              className="w-2/6 h-[56px] bg-custom-blue-200 justify-center items-center rounded-full shadow-sm"
            >
              <Text className="text-white font-spaceGrotesk text-2xl font-bold">
                sign up
              </Text>
            </TouchableOpacity>

            <Text className="text-xl font-spaceGrotesk text-custom-blue-200 mt-6">
              already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login", { origin: "Signup" })}>
              <Text className="underline text-xl text-custom-blue-200">login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default SignUpScreen;