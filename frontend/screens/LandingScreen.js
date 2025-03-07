import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import face1 from '../assets/face1.png';
import face2 from '../assets/face2.png';
import face3 from '../assets/face3.png';
import { useNavigation } from "@react-navigation/native";


const gridImage = require('../assets/grid.png');

const LandingScreen = ({ }) => {
  // hooks must be called within component
  const navigation = useNavigation();

  return (
    <ImageBackground source={gridImage} className="flex-1 bg-bg">
      <View className="absolute right-20 top-52">
        <Image source={face1} className="w-52 h-52 -ml-12 -mb-8" />
        <Image source={face2} className="w-52 h-52 -mt-20 -mb-20 -ml-36" />
        <Image source={face3} className="w-44 h-44 -mt-7" />
      </View>
      <View className="flex-1 justify-end pb-40 items-center bg-transparent">
        <View className="flex-row">
          <Text className="font-bold text-blueText text-7xl">roomies</Text>
        </View>
        <TouchableOpacity
          className="bg-red-500 items-center p-4 rounded-full mt-10 w-40"
          onPress={() => navigation.replace('Signup')}
          >
            <Text className=" text-white font-bold">Sign up</Text>

          </TouchableOpacity>
        <Text className="text-2xl mt-4">already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('Main')}>
          <Text className="underline text-2xl">log in</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
};

export default LandingScreen;
