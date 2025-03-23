import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { createGroup, joinGroup, getUserGroup, verifyUserSession } from "../api/users.api.js";

const GroupScreen = ({ setUser }) => {
  const navigation = useNavigation();

  const [createRoomName, setCreateRoomName] = useState("");
  const [createPasscode, setCreatePasscode] = useState("");
  const [joinRoomName, setJoinRoomName] = useState("");
  const [joinPasscode, setJoinPasscode] = useState("");

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
                value={createRoomName}
                onChangeText={setCreateRoomName}
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
                value={createPasscode}
                onChangeText={setCreatePasscode}
                style={{
                    height: 40,
                    fontSize: 20,
                }}
                className="font-spaceGrotesk"
                />
            </View>
            <View className="items-end">
                <TouchableOpacity
                    
                    onPress={async () => {
                        try {
                            console.log("Create button pressed!");
                          const session = await verifyUserSession();
                          if (!session?.uid) return;
                      
                          await createGroup({
                            uid: session.uid,
                            groupName: createRoomName,
                            passcode: createPasscode,
                          });
                          console.log("Group created!");
                      
                          const updated = await getUserGroup();
                          setUser((prev) => ({ ...prev, roomieGroup: updated.groupName, members: updated.members }));
                          //navigation.replace("Main");
                        } catch (error) {
                          console.error("Create group failed", error);
                        }
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
                placeholder="room name"
                placeholderTextColor="white"
                value={joinRoomName}
                onChangeText={setJoinRoomName}
                style={{
                    height: 40,
                    fontSize: 20,
                }}
                className="font-spaceGrotesk"
                />
            </View>
            <View style={{ width: "90%", borderBottomWidth: 2, borderColor: "white", marginBottom: 24, marginTop: 20, }}>
                <TextInput
                placeholder="passcode"
                placeholderTextColor="white"
                value={joinPasscode}
                onChangeText={setJoinPasscode}
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
                    onPress={async () => {
                        try {
                        const session = await verifyUserSession();
                        if (!session?.uid) return;

                        await joinGroup({
                            uid: session.uid,
                            groupName: joinRoomName,
                            passcode: joinPasscode,
                        });

                        const updated = await getUserGroup();
                        setUser((prev) => ({
                            ...prev,
                            roomieGroup: updated.groupName,
                            members: updated.members,
                        }));
                        //navigation.replace("Main");
                        } catch (error) {
                        console.error("Join group failed", error);
                        }
                    }}
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
