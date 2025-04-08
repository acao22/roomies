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
import { loginUser, verifyUserSession, getUserGroup } from "../api/users.api.js";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const LoginScreen = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const gridImage = require("../assets/grid.png");
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

  const handleLogin = async () => {
    try {
      const userCredential = await loginUser(email, password);
      const sessionData = await verifyUserSession();
      const groupData = await getUserGroup();

      const fullUser = {
        ...sessionData,
        roomieGroup: groupData,
        members: groupData.members,
      };

      if (fullUser) {
        setUser(fullUser);
        Alert.alert("Login successful", "", [{ text: "OK" }]);
      } else {
        Alert.alert("Missing group", "Please join or create a group.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred.");
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
          <Ionicons name="arrow-back" size={28} color="#F4A261" />
        </TouchableOpacity>

        <Animated.View style={{ opacity: fadeAnim }}>
          <View className="justify-start items-start flex-col pl-[43px] pt-[174px]">
            <Text className="text-5xl font-bold text-custom-pink-200 font-spaceGrotesk">
              log in
            </Text>
            <Text className="text-base text-custom-blue-200 font-spaceGrotesk mt-[6px]">
              welcome back!
            </Text>
          </View>

          <View className="justify-center items-center flex-col pt-[45px] shadow-sm">
            <TextInput
              placeholder="email"
              placeholderTextColor="#788ABF"
              className="w-5/6 h-[56px] bg-custom-gray text-large text-custom-blue-200 py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="justify-center items-center flex-col pt-[16px] shadow-sm">
            <TextInput
              placeholder="password"
              placeholderTextColor="#788ABF"
              className="w-5/6 h-[56px] bg-custom-gray text-large text-custom-blue-200 py-4 px-6 rounded-3xl font-spaceGrotesk text-2xl"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View className="justify-center items-center flex-col pt-[16px]">
            <TouchableOpacity
              onPress={handleLogin}
              className="w-5/6 h-[56px] bg-custom-teal justify-center items-center rounded-3xl shadow-sm"
            >
              <Text className="text-black font-spaceGrotesk text-2xl font-bold">
                Login
              </Text>
            </TouchableOpacity>

            <View className="justify-center items-center mt-8">
              <Text className="text-xl font-spaceGrotesk text-[#504E4D]">
                don't have an account yet?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup", { origin: "Landing" })}>
                <Text className="underline text-xl text-[#504E4D]">sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;