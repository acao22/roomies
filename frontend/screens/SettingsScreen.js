import React from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
    {/* hamburger menu */}
    <View className="flex-row justify-start px-4 mt-2">
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={30} color="gray" />
      </TouchableOpacity>
    </View>

     <View className="flex-1 justify-center items-center">
                <Text className="text-xl font-bold">setting</Text>
            </View>

    </SafeAreaView>
  );
};

export default SettingsScreen;
