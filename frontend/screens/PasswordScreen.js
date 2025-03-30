import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { createGroup, joinGroup, getUserGroup, verifyUserSession } from "../api/users.api.js";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const PasswordScreen = ({ setUser }) => {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user || !user.email) {
    Alert.alert("Error", "Unable to get current user email.");
    return;
  }

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert("Missing Info", "Please fill in all fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        Alert.alert("Password Mismatch", "New passwords do not match.");
        return;
    }

    try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        Alert.alert("Success", "Password updated succesfully!");
        navigation.goBack();
    } catch (error) {
        console.error("Password change error:", error);
        if (error.code === "auth/wrong-password") {
            Alert.alert("Error", "Your current password is incorrect.");
        } else {
            Alert.alert("Error", error.message);
        }
    }
  };

  return (
    <View className="bg-custom-tan" style={{ flex: 1 }}>
    {/* Back button - simply navigate to Landing */}
    <TouchableOpacity
        onPress={() => navigation.navigate("ProfileDrawer")}
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
        <Text className="font-spaceGrotesk text-custom-blue-200 text-4xl font-bold">
        Change Password
        </Text>
    </View>

    {/* Form Section */}
    <View style={{ alignItems: "center", paddingTop: 45}}>
        <View className="bg-custom-pink-100 p-6 justify-items-start rounded-3xl w-96">
            <View style={{ width: "100%", borderBottomWidth: 2, borderColor: "#788ABF", marginBottom: 24, marginTop: 20, }}>
                <TextInput
                placeholder="Enter current password"
                placeholderTextColor="#788ABF"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                style={{
                    height: 40,
                    fontSize: 20,
                }}
                className="font-spaceGrotesk"
                />
            </View>
            <View style={{ width: "100%", borderBottomWidth: 2, borderColor: "#788ABF", marginBottom: 24, }}>
                <TextInput
                placeholder="Create new password"
                placeholderTextColor="#788ABF"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                style={{
                    height: 40,
                    fontSize: 20,
                }}
                className="font-spaceGrotesk"
                />
            </View>
            <View style={{ width: "100%", borderBottomWidth: 2, borderColor: "#788ABF", marginBottom: 24, }}>
                <TextInput
                placeholder="Confirm new password"
                placeholderTextColor="#788ABF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={{
                    height: 40,
                    fontSize: 20,
                }}
                className="font-spaceGrotesk"
                />
            </View>
            
        </View>
        <View className="items-end">
            <TouchableOpacity
                className="w-96 h-[52px] bg-custom-red justify-center items-center rounded-full mt-6"
                onPress={handlePasswordChange}
            >
                <Text className="text-white font-spaceGrotesk text-3xl font-bold">
                    submit
                </Text>
            </TouchableOpacity>

        </View>

        </View>
    </View>
  );
};

export default PasswordScreen;
