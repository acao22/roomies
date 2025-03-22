import React from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const GroupScreen = ({ setUser }) => {
  const navigation = useNavigation();

  return (
    <View className="bg-custom-yellow" style={{ flex: 1 }}>
    {/* Back button - simply navigate to Landing */}
    <TouchableOpacity
        onPress={() => navigation.navigate("Landing")}
        style={{
        position: "absolute",
        top: 50,
        left: 5,
        padding: 12,
        zIndex: 10,
        }}
    >
        <Ionicons name="arrow-back" size={28} color="#788ABF" />
    </TouchableOpacity>
    
    {/* Header Section */}
    <View style={{paddingTop: 130 }} className="items-center">
        <Text className="font-spaceGrotesk text-custom-blue-200 text-2xl">step 1:</Text>
        <Text className="font-spaceGrotesk text-custom-blue-200 text-4xl font-bold">
        join your roomies
        </Text>
    </View>

    {/* Form Section */}
    <View style={{ alignItems: "center", paddingTop: 45}}>
        <View className="bg-custom-pink-200 p-6 justify-items-start rounded-3xl w-96">
            <Text className="font-spaceGrotesk font-bold text-white text-3xl">create a new room</Text>
            <View style={{ width: "90%", borderBottomWidth: 2, borderColor: "white", marginBottom: 24, marginTop: 20, }}>
                <TextInput
                placeholder="room name"
                placeholderTextColor="white"
                style={{
                    height: 40,
                    fontSize: 20,
                }}
                className="font-spaceGrotesk"
                />
            </View>
            <View style={{ width: "90%", borderBottomWidth: 2, borderColor: "white", marginBottom: 24, }}>
                <TextInput
                placeholder="passcode"
                placeholderTextColor="white"
                style={{
                    height: 40,
                    fontSize: 20,
                }}
                className="font-spaceGrotesk"
                />
            </View>
            <View className="items-end">
                <TouchableOpacity
                    
                    onPress={() => {
                        setUser((prev) => ({ ...prev, roomieGroup: true }));
                    }}
                    className="w-36 h-[52px] bg-custom-blue-200 justify-center items-center rounded-full mt-6"
                    >
                    <Text className="text-white font-spaceGrotesk text-3xl font-bold">
                        create
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
        <View className="bg-custom-pink-200 p-6 justify-items-start rounded-3xl w-96 mt-12">
            <Text className="font-spaceGrotesk font-bold text-white text-3xl">join an existing room</Text>
            <View style={{ width: "90%", borderBottomWidth: 2, borderColor: "white", marginBottom: 24, marginTop: 20, }}>
                <TextInput
                placeholder="passcode"
                placeholderTextColor="white"
                style={{
                    height: 40,
                    fontSize: 20,
                }}
                className="font-spaceGrotesk"
                />
            </View>
            <View className="items-end">
                <TouchableOpacity
                    className="w-36 h-[52px] bg-custom-blue-200 justify-center items-center rounded-full mt-6"
                    >
                    <Text className="text-white font-spaceGrotesk text-3xl font-bold">
                        join
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    </View>
    </View>
  );
};

export default GroupScreen;
