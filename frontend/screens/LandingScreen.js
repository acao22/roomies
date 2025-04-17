import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

import face1 from "../assets/faces/face-2.png";
import hair1 from "../assets/dark_hair/hair-f8-dark.png";
import face2 from "../assets/faces/face-1.png";
import hair2 from "../assets/dark_hair/hair-m3-dark.png";
import face3 from "../assets/faces/face-5.png";
import hair3 from "../assets/dark_hair/hair-f5-dark.png";



const gridImage = require("../assets/grid.png");

const LandingScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
      source={gridImage}
      className="bg-custom-tan flex-1 bg-bg"
    >
      {/* Group the overlapped face and hair into a relative container */}
      <View className="flex-row pt-72 ml-6">
        <View className="relative">
          {/* face image */}
          <Image source={face1} className="w-48 h-48" />
          {/* hair image  */}
          <Image
            source={hair1}
            className="absolute top-0 left-0 w-48 h-48"
          />
        </View>
        <View className="relative">
          {/* face image */}
          <Image source={face2} className="right-20  w-48 h-48" />
          {/* hair image  */}
          <Image
            source={hair2}
            className="absolute top-0 right-20 w-48 h-48"
          />
        </View>
        <View className="relative">
          {/* face image */}
          <Image source={face3} className="right-40 w-48 h-48" />
          {/* hair image  */}
          <Image
            source={hair3}
            className="absolute top-0 right-40 w-48 h-48"
          />
        </View>

      </View>

      <Animated.View
        className="flex-1 justify-end pb-36 items-center bg-transparent"
        style={{ opacity: fadeAnim }}
      >
        <View className="flex-row">
          <Text className="font-bold text-custom-blue-200 text-8xl font-spaceGrotesk">
            room
          </Text>
          <Text className="font-bold text-custom-pink-200 text-8xl font-spaceGrotesk">
            i
          </Text>
          <Text className="font-bold text-custom-blue-200 text-8xl font-spaceGrotesk">
            es
          </Text>
        </View>
        <View className="bg-custom-yellow">
          
        </View>

        <View className="relative mt-24 items-center justify-center">
          {/* Yellow box behind the sign-up button */}
            <View
              className="absolute top-12 h-80 w-full bg-custom-yellow rounded-lg"
              style={{ transform: [{ translateY: -20 }] }}
            />

          <TouchableOpacity
            className="relative z-10 bg-custom-blue-200 items-center p-3 rounded-full w-64"
            onPress={() => navigation.navigate("Signup", { origin: "Landing" })}
          >
            <Text
              className="text-white font-bold font-spaceGrotesk text-4xl"
              style={{ width: "100%", textAlign: "center" }}
            >
              sign up
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          className="text-3xl font-spaceGrotesk text-custom-blue-100 font-semibold pt-8"
          style={{ width: "100%", textAlign: "center" }}
        >
          already have an account?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login", { origin: "Landing" })}
        >
          <Text className="underline text-3xl font-spaceGrotesk text-custom-blue-100 font-semibold">
            log in
          </Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </Animated.View>
    </ImageBackground>
  );
};

export default LandingScreen;
