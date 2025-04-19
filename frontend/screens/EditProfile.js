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
  Platform,
  Pressable,
} from "react-native";

export default function EditProfile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 items-center justify-center bg-[#FFE7C0]"
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
            <View className="w-28 h-28 rounded-full bg-[#FFE7C0] overflow-hidden items-center justify-center">
            <Image
                source={require("../assets/face1.png")}
                className="w-28 h-28"
                resizeMode="contain"
            />
            </View>
            <Text className="text-3xl font-semibold text-[#FEF9E5]">edit avatar</Text>
        </View>
        </Pressable>

        {/* Password Section */}
        <View className="w-96 h-128 rounded-3xl bg-[#495BA2] items-start justify-center px-6 mb-12 gap-4">
          <Text className="ml-32 mt-8 text-3xl font-semibold text-[#FEF9E5]">edit password</Text>

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
            <Pressable onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
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
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
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
          <View className="m-8 ml-56 w-28 h-10 rounded-3xl bg-[#FFB95C] items-center justify-center">
            <Text className="text-2xl font-semibold text-[#FEF9E5]">save</Text>
          </View>
        </View>

        {/* Leave Room Section */}
        <View className="w-48 h-12 rounded-3xl bg-[#FF3D00] items-center justify-center">
          <Text className="text-2xl font-semibold text-[#FEF9E5]">leave my room</Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}