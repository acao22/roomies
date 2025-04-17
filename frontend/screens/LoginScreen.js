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
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { addPointsToUser, shouldAddLoginPoint, updateLastLoginDate } from "../api/users.api.js";

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
      let groupData = null;
      try {
        groupData = await getUserGroup();
      } catch (err) {
        if (err?.response?.status !== 404) throw err;
      }

      if (groupData) {
        setUser({
          ...sessionData,
          roomieGroup: groupData.groupName,
          members: groupData.members,
        });
      
        // navigation.dispatch(
        //   CommonActions.reset({ index: 0, routes: [{ name: "Main" }] })
        // );
      } else {
        setUser({ ...sessionData, roomieGroup: null, members: [] });
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: "Group" }]})
        );
      }
    } catch (error) {
      Alert.alert("Login failed", error.message || "Unexpected error");
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
              log in
            </Text>
            <Text className="text-base text-custom-blue-200 font-spaceGrotesk mt-[6px]">
              welcome back!
            </Text>
          </View>

          <View className="justify-center items-center flex-col pt-[45px]">
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

          <View className="justify-center items-center flex-col pt-[16px]">
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
              onPress={handleLogin}
              className="w-2/6 h-[56px] bg-custom-blue-200 justify-center items-center rounded-full shadow-sm"
            >
              <Text className="text-white font-spaceGrotesk text-2xl font-bold">
                log in
              </Text>
            </TouchableOpacity>

            <View className="justify-center items-center mt-8">
              <Text className="text-xl font-spaceGrotesk text-custom-blue-200">
                don't have an account yet?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup", { origin: "Landing" })}>
                <Text className="underline text-xl text-custom-blue-200">sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;