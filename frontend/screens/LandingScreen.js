import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import face1 from '../assets/face1.png';
import face2 from '../assets/face2.png';
import face3 from '../assets/face3.png';
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";



const gridImage = require('../assets/grid.png');

const LandingScreen = ({ }) => {
  // hooks must be called within component
  const navigation = useNavigation();
  const [refreshKey, setRefreshKey] = useState(0);

    // Listen for navigation focus
    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        setRefreshKey((prevKey) => prevKey + 1); // Change state to force re-render
      });
  
      return unsubscribe; // Cleanup on unmount
    }, [navigation]);


  return (
    <ImageBackground key={refreshKey} source={gridImage} className="bg-custom-tan flex-1 bg-bg">
      <View className="absolute right-20 top-52">
        <Image source={face1} className="w-52 h-52 -ml-12 -mb-8" />
        <Image source={face2} className="w-52 h-52 -mt-20 -mb-20 -ml-36" />
        <Image source={face3} className="w-44 h-44 -mt-7" />
      </View>
      <View className="flex-1 justify-end pb-40 items-center bg-transparent">
        <View className="flex-row">
          <Text className="font-bold text-custom-blue-200 text-7xl font-spaceGrotesk" style={{ width: "100%", textAlign: "center" }} >roomies</Text>
        </View>
        <TouchableOpacity
          className="bg-custom-red items-center p-3 rounded-full mt-10 w-44"
          onPress={() => navigation.replace('Signup')}
          >
            <Text className=" text-white font-bold font-spaceGrotesk text-2xl" style={{ width: "100%", textAlign: "center" }} >sign up</Text>

          </TouchableOpacity>
        <Text className="text-2xl mt-4 font-spaceGrotesk" style={{ width: "100%", textAlign: "center" }} >already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text className="underline text-2xl">log in</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
};

export default LandingScreen;
