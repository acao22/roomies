import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";

const screenWidth = Dimensions.get("window").width;

const AvatarCreation = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedHair, setSelectedHair] = useState(null);
  const [selectedFace, setSelectedFace] = useState(null);
  const imagesPerPage = 6;
  const navigation = useNavigation();
  const viewShotRef = useRef(null);

  const saveAvatar = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current.capture();
        const fileName = "my-avatar.png";
        const newUri = FileSystem.documentDirectory + fileName;

        await FileSystem.copyAsync({
          from: uri,
          to: newUri,
        });

        console.log("Avatar saved at:", newUri);
        return newUri;
      } catch (error) {
        console.error("Error saving avatar:", error);
      }
    }
  };

  const dark_hair = [
    { id: "1", name: "female #1", image: require("../../frontend/assets/dark_hair/hair-f1-dark.png") },
    { id: "2", name: "female #2", image: require("../../frontend/assets/dark_hair/hair-f2-dark.png") },
    { id: "3", name: "female #3", image: require("../../frontend/assets/dark_hair/hair-f3-dark.png") },
    { id: "4", name: "female #4", image: require("../../frontend/assets/dark_hair/hair-f4-dark.png") },
    { id: "5", name: "female #5", image: require("../../frontend/assets/dark_hair/hair-f5-dark.png") },
    { id: "6", name: "female #6", image: require("../../frontend/assets/dark_hair/hair-f6-dark.png") },
    { id: "7", name: "female #7", image: require("../../frontend/assets/dark_hair/hair-f7-dark.png") },
    { id: "8", name: "female #8", image: require("../../frontend/assets/dark_hair/hair-f8-dark.png") },
    { id: "9", name: "female #9", image: require("../../frontend/assets/dark_hair/hair-f9-dark.png") },
    { id: "10", name: "male #1", image: require("../../frontend/assets/dark_hair/hair-m1-dark.png") },
    { id: "11", name: "male #2", image: require("../../frontend/assets/dark_hair/hair-m2-dark.png") },
    { id: "12", name: "male #3", image: require("../../frontend/assets/dark_hair/hair-m3-dark.png") },
    { id: "13", name: "male #4", image: require("../../frontend/assets/dark_hair/hair-m4-dark.png") },
    { id: "14", name: "male #5", image: require("../../frontend/assets/dark_hair/hair-m5-dark.png") },
  ];

  const light_hair = [
    { id: "1", name: "female #1", image: require("../../frontend/assets/light_hair/hair-f1-light.png") },
    { id: "2", name: "female #2", image: require("../../frontend/assets/light_hair/hair-f2-light.png") },
    { id: "3", name: "female #3", image: require("../../frontend/assets/light_hair/hair-f3-light.png") },
    { id: "4", name: "female #4", image: require("../../frontend/assets/light_hair/hair-f4-light.png") },
    { id: "5", name: "female #5", image: require("../../frontend/assets/light_hair/hair-f5-light.png") },
    { id: "6", name: "female #6", image: require("../../frontend/assets/light_hair/hair-f6-light.png") },
    { id: "7", name: "female #7", image: require("../../frontend/assets/light_hair/hair-f7-light.png") },
    { id: "8", name: "female #8", image: require("../../frontend/assets/light_hair/hair-f8-light.png") },
    { id: "9", name: "female #9", image: require("../../frontend/assets/light_hair/hair-f9-light.png") },
    { id: "10", name: "male #1", image: require("../../frontend/assets/light_hair/hair-m1-light.png") },
    { id: "11", name: "male #2", image: require("../../frontend/assets/light_hair/hair-m2-light.png") },
    { id: "12", name: "male #3", image: require("../../frontend/assets/light_hair/hair-m3-light.png") },
    { id: "13", name: "male #4", image: require("../../frontend/assets/light_hair/hair-m4-light.png") },
    { id: "14", name: "male #5", image: require("../../frontend/assets/light_hair/hair-m5-light.png") },
  ];

  const faces = [
    { id: "1", name: "face #1", image: require("../../frontend/assets/faces/face-1.png") },
    { id: "2", name: "face #2", image: require("../../frontend/assets/faces/face-2.png") },
    { id: "3", name: "face #3", image: require("../../frontend/assets/faces/face-3.png") },
    { id: "4", name: "face #4", image: require("../../frontend/assets/faces/face-4.png") },
    { id: "5", name: "face #5", image: require("../../frontend/assets/faces/face-5.png") },
    { id: "6", name: "face #6", image: require("../../frontend/assets/faces/face-6.png") },
    { id: "7", name: "face #7", image: require("../../frontend/assets/faces/face-7.png") },
    { id: "8", name: "face #8", image: require("../../frontend/assets/faces/face-8.png") },
    { id: "9", name: "face #9", image: require("../../frontend/assets/faces/face-9.png") },
    { id: "10", name: "face #10", image: require("../../frontend/assets/faces/face-10.png") },
    { id: "11", name: "face #11", image: require("../../frontend/assets/faces/face-11.png") },
    { id: "12", name: "face #12", image: require("../../frontend/assets/faces/face-12.png") },
    { id: "13", name: "face #13", image: require("../../frontend/assets/faces/face-13.png") },
    { id: "14", name: "face #14", image: require("../../frontend/assets/faces/face-14.png") },
    { id: "15", name: "face #15", image: require("../../frontend/assets/faces/face-15.png") },
  ];

  const displayedImages = currentPage === 0
    ? isToggled ? light_hair : dark_hair
    : faces;

  const handleSelect = (item) => {
    if (currentPage === 0) {
      setSelectedHair(item);
    } else {
      setSelectedFace(item);
    }
  };

  const renderRow = ({ item }) => {
    const isSelected =
      (currentPage === 0 && selectedHair?.id === item.id) ||
      (currentPage === 1 && selectedFace?.id === item.id);
    return (
      <Pressable onPress={() => handleSelect(item)} className="m-3">
        <View
          className={`items-center justify-center ${isSelected ? "bg-[#FEF9E5] h-32 w-32 rounded-xl" : ""}`}
        >
          <Image source={item.image} style={{ width: 130, height: 130 }} />
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-[#788ABF]">
      <View className="flex-1 items-center justify-center pt-8">
        <Text className="m-10 text-white text-4xl font-bold font-spaceGrotesk">my avatar</Text>

        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
          <View className="w-72 h-72 mb-6 bg-[#FFD49B] rounded-full items-center justify-center overflow-hidden relative">
            <Image source={require("../../frontend/assets/head/base-head.png")} className="h-96 w-96" resizeMode="contain" />
            {selectedFace && <Image source={selectedFace.image} className="h-96 w-96 absolute" resizeMode="contain" />}
            {selectedHair && <Image source={selectedHair.image} className="h-96 w-96 absolute" resizeMode="contain" />}
          </View>
        </ViewShot>

        {/* Toggle & Done */}
        <View className="flex-row w-full justify-between px-6 mb-4">
          <Pressable
            onPress={() => setIsToggled(!isToggled)}
            className="w-28 h-12 rounded-full bg-white flex-row items-center justify-between relative"
          >
            <View
              className="w-12 h-12 bg-[#FFB95C] rounded-full"
              style={{
                position: "absolute",
                left: isToggled ? "74%" : "-17%",
                transform: [{ translateX: isToggled ? -16 : 16 }],
              }}
            />
            <Image
              source={require("../../frontend/assets/dark_hair/hair-m4-dark.png")}
              className="w-20 h-20 absolute left-0 -ml-[17%]"
              resizeMode="contain"
            />
            <Image
              source={require("../../frontend/assets/light_hair/hair-m4-light.png")}
              className="w-20 h-20 absolute right-0 -mr-[17%]"
              resizeMode="contain"
            />
          </Pressable>

          <TouchableOpacity
            onPress={async () => {
              const avatarUri = await saveAvatar();
              navigation.navigate("Home", { avatarUri });
            }}
            className="bg-[#FFD49B] px-5 py-2 rounded-full"
          >
            <Text className="text-[#3B3B3B] text-xl font-semibold">done</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Face/Hair Options */}
      <View className="bg-[#F5A58C] flex-1 px-4">
        <FlatList
          data={displayedImages}
          renderItem={renderRow}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
        <View className="flex-row justify-center space-x-4 mt-2">
          <TouchableOpacity
            onPress={() => setCurrentPage(0)}
            className={`px-4 py-2 rounded-full ${currentPage === 0 ? "bg-[#FFD49B]" : "bg-[#FEF9E5]"}`}
          >
            <Text>Hair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentPage(1)}
            className={`px-4 py-2 rounded-full ${currentPage === 1 ? "bg-[#FFD49B]" : "bg-[#FEF9E5]"}`}
          >
            <Text>Face</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AvatarCreation;
