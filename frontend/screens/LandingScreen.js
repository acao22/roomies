import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-200">
      <View className="flex-row">
        <Text className="font-bold text-blueText text-6xl">room</Text>
        <Text className="font-bold text-orangeText text-6xl">i</Text>
        <Text className="font-bold text-redText text-6xl">es!</Text>
      </View>
      <Text className="text-xl">Put the"i" in roomies</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default HomeScreen;
