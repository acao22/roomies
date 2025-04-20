import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  Platform,
  Pressable,
} from "react-native";
import face1 from "../assets/face1.png";
import { fetchAvatar, verifyUserSession } from "../api/users.api";
import { useEffect } from "react";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

export default function EditProfile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const navigation = useNavigation();
  const [avatarUri, setAvatarUri] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !user.email) {
    Alert.alert("Error", "Unable to get current user email.");
    return;
  }

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
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
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

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const { uid } = await verifyUserSession();
        const uri = await fetchAvatar(uid);
        setAvatarUri(uri.uri);
      } catch (error) {
        console.error("Error fetching avatar in EditProfile:", error);
      }
    };

    loadAvatar();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 items-center justify-center bg-[#FEF9E5]"
      >
        <Pressable onPress={() => navigation.navigate("ProfileScreen")}>
          <Text className="ml-[-160] self-start text-2xl mb-12 font-bold text-[#495BA2]">
            &lt; profile
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("AvatarCreation")}
          className="w-96 h-44 rounded-3xl bg-[#495BA2] items-center justify-center mb-12"
        >
          <View className="flex-row items-center gap-12">
            <View className="w-28 h-28 rounded-full bg-[#FEF9E5] overflow-hidden items-center justify-center">
              <Image
                source={
                  avatarUri &&
                  typeof avatarUri === "string" &&
                  avatarUri.trim().length > 0
                    ? { uri: avatarUri }
                    : face1
                }
                className="w-32 h-32"
              />
            </View>
            <Text className="text-3xl font-semibold text-[#FEF9E5]">
              edit avatar
            </Text>
          </View>
        </Pressable>

        {/* Password Section */}
        <View className="w-96 h-128 rounded-3xl bg-[#495BA2] items-start justify-center px-6 mb-12 gap-4">
          <Text className="ml-32 mt-8 text-3xl font-semibold text-[#FEF9E5]">
            edit password
          </Text>

          {/* Current Password */}
          <View className="flex-row items-center mt-8 border-b border-[#FEF9E5] pb-1 w-full">
            <TextInput
              placeholder="current password"
              placeholderTextColor="#FEF9E5"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              className="flex-1 text-xl font-semibold text-[#FEF9E5]"
            />
            <Pressable
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Image
                source={
                  showCurrentPassword
                    ? require("../assets/icons/eyes-open.png")
                    : require("../assets/icons/eyes-closed.png")
                }
                className="w-8 h-8 ml-2"
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {/* New Password */}
          <View className="flex-row items-center mt-8 border-b border-[#FEF9E5] pb-1 w-full">
            <TextInput
              placeholder="new password"
              placeholderTextColor="#FEF9E5"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              className="flex-1 text-xl font-semibold text-[#FEF9E5]"
            />
            <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
              <Image
                source={
                  showNewPassword
                    ? require("../assets/icons/eyes-open.png")
                    : require("../assets/icons/eyes-closed.png")
                }
                className="w-8 h-8 ml-2"
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {/* Confirm New Password */}
          <View className="flex-row items-center mt-8 border-b border-[#FEF9E5] pb-1 w-full">
            <TextInput
              placeholder="confirm new password"
              placeholderTextColor="#FEF9E5"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              className="flex-1 text-xl font-semibold text-[#FEF9E5]"
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Image
                source={
                  showConfirmPassword
                    ? require("../assets/icons/eyes-open.png")
                    : require("../assets/icons/eyes-closed.png")
                }
                className="w-8 h-8 ml-2"
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handlePasswordChange}
            className="m-8 ml-56 w-28 h-10 rounded-3xl bg-[#FFB95C] items-center justify-center"
          >
            <Text className="text-2xl font-semibold text-[#FEF9E5]">save</Text>
          </TouchableOpacity>
        </View>

        {/* Leave Room Section */}
        <View className="w-48 h-12 rounded-3xl bg-[#FF3D00] items-center justify-center">
          <Text className="text-xl font-semibold text-[#FEF9E5]">
            leave my room
          </Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
