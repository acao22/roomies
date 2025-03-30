import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";

const AvatarCreation = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [selectedHair, setSelectedHair] = useState(null);
  const [selectedFace, setSelectedFace] = useState(null);
  const [showFaces, setShowFaces] = useState(false);
  const navigation = useNavigation();
  const viewShotRef = useRef(null);

  const saveAvatar = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current.capture();
        const fileName = "my-avatar.png";
        const newUri = FileSystem.documentDirectory + fileName;
        await FileSystem.copyAsync({ from: uri, to: newUri });
        console.log("Avatar saved at:", newUri);
        return newUri;
      } catch (error) {
        console.error("Error saving avatar:", error);
      }
    }
  };

  const dark_hair = [
    { id: "1", image: require("../../frontend/assets/dark_hair/hair-f1-dark.png") },
    { id: "2", image: require("../../frontend/assets/dark_hair/hair-f2-dark.png") },
    { id: "3", image: require("../../frontend/assets/dark_hair/hair-f3-dark.png") },
    { id: "4", image: require("../../frontend/assets/dark_hair/hair-f4-dark.png") },
    { id: "5", image: require("../../frontend/assets/dark_hair/hair-f5-dark.png") },
    { id: "6", image: require("../../frontend/assets/dark_hair/hair-f6-dark.png") },
    { id: "7", image: require("../../frontend/assets/dark_hair/hair-f7-dark.png") },
    { id: "8", image: require("../../frontend/assets/dark_hair/hair-f8-dark.png") },
    { id: "9", image: require("../../frontend/assets/dark_hair/hair-f9-dark.png") },
    { id: "10", image: require("../../frontend/assets/dark_hair/hair-m1-dark.png") },
    { id: "11", image: require("../../frontend/assets/dark_hair/hair-m2-dark.png") },
    { id: "12", image: require("../../frontend/assets/dark_hair/hair-m3-dark.png") },
    { id: "13", image: require("../../frontend/assets/dark_hair/hair-m4-dark.png") },
    { id: "14", image: require("../../frontend/assets/dark_hair/hair-m5-dark.png") },
  ];

  const light_hair = [
    { id: "1", image: require("../../frontend/assets/light_hair/hair-f1-light.png") },
    { id: "2", image: require("../../frontend/assets/light_hair/hair-f2-light.png") },
    { id: "3", image: require("../../frontend/assets/light_hair/hair-f3-light.png") },
    { id: "4", image: require("../../frontend/assets/light_hair/hair-f4-light.png") },
    { id: "5", image: require("../../frontend/assets/light_hair/hair-f5-light.png") },
    { id: "6", image: require("../../frontend/assets/light_hair/hair-f6-light.png") },
    { id: "7", image: require("../../frontend/assets/light_hair/hair-f7-light.png") },
    { id: "8", image: require("../../frontend/assets/light_hair/hair-f8-light.png") },
    { id: "9", image: require("../../frontend/assets/light_hair/hair-f9-light.png") },
    { id: "10", image: require("../../frontend/assets/light_hair/hair-m1-light.png") },
    { id: "11", image: require("../../frontend/assets/light_hair/hair-m2-light.png") },
    { id: "12", image: require("../../frontend/assets/light_hair/hair-m3-light.png") },
    { id: "13", image: require("../../frontend/assets/light_hair/hair-m4-light.png") },
    { id: "14", image: require("../../frontend/assets/light_hair/hair-m5-light.png") },
  ];

  const faces = [
    { id: "1", image: require("../../frontend/assets/faces/face-1.png") },
    { id: "2", image: require("../../frontend/assets/faces/face-2.png") },
    { id: "3", image: require("../../frontend/assets/faces/face-3.png") },
    { id: "4", image: require("../../frontend/assets/faces/face-4.png") },
    { id: "5", image: require("../../frontend/assets/faces/face-5.png") },
    { id: "6", image: require("../../frontend/assets/faces/face-6.png") },
    { id: "7", image: require("../../frontend/assets/faces/face-7.png") },
    { id: "8", image: require("../../frontend/assets/faces/face-8.png") },
    { id: "9", image: require("../../frontend/assets/faces/face-9.png") },
    { id: "10", image: require("../../frontend/assets/faces/face-10.png") },
    { id: "11", image: require("../../frontend/assets/faces/face-11.png") },
    { id: "12", image: require("../../frontend/assets/faces/face-12.png") },
    { id: "13", image: require("../../frontend/assets/faces/face-13.png") },
    { id: "14", image: require("../../frontend/assets/faces/face-14.png") },
    { id: "15", image: require("../../frontend/assets/faces/face-15.png") },
  ];

  const displayedImages = showFaces ? faces : isToggled ? light_hair : dark_hair;

  const renderRow = ({ item }) => (
    <Pressable
      onPress={() =>
        showFaces ? setSelectedFace(item) : setSelectedHair(item)
      }
      style={{alignItems: "center" }}
    >
      <View
        style={{
          backgroundColor:
            (!showFaces && selectedHair && selectedHair.id === item.id) ||
            (showFaces && selectedFace && selectedFace.id === item.id)
              ? "#FEF9E5"
              : "transparent",
          borderRadius: 12,
          resizeMode: "contain",
          flex: 1
        }}
      >
        <Image source={item.image} style={{ width: 130, height: 130 }} />
      </View>
      
    </Pressable>
  );

  return (
    <View className="flex-1 bg-[#788ABF]">
      <View className="items-center pt-10">
        <Text className="text-white text-4xl font-bold font-spaceGrotesk">
          my avatar
        </Text>

        {/* Avatar Preview */}
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
          <View className="w-72 h-72 my-6 bg-[#FFD49B] rounded-full items-center justify-center overflow-hidden relative">
            <Image
              source={require("../../frontend/assets/head/base-head.png")}
              className="h-96 w-96"
              resizeMode="contain"
            />
            {selectedFace && (
              <Image
                source={selectedFace.image}
                className="h-96 w-96 absolute"
                resizeMode="contain"
              />
            )}
            {selectedHair && (
              <Image
                source={selectedHair.image}
                className="h-96 w-96 absolute"
                resizeMode="contain"
              />
            )}
          </View>
        </ViewShot>

        {/* Toggle & Done */}
        <View className="flex-row justify-between w-[85%] items-center mb-4">
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
              className="w-20 h-20 absolute right-0 -mr-[15%]"
              resizeMode="contain"
            />
          </Pressable>

          <TouchableOpacity
            onPress={() => {
              saveAvatar();
              navigation.navigate("ProfileScreen");
            }}
            className="w-28 h-12 rounded-full bg-[#FFB95C] items-center justify-center"
          >
            <Text className="text-white text-2xl font-bold font-spaceGrotesk">
              done
            </Text>
          </TouchableOpacity>
        </View>
        

         {/* < button */}
         <View className="w-full bg-[#f6b59d] flex-row justify-between items-center px-6 py-4">
          {/* < button */}
          <TouchableOpacity onPress={() => setShowFaces(false)}>
            <Text className={`text-white text-4xl font-bold font-spaceGrotesk ${!showFaces ? "opacity-50" : ""}`}>
              {"<"}
            </Text>
          </TouchableOpacity>

          <Text className={`text-white text-4xl font-bold font-spaceGrotesk`}>
            {showFaces ? "Faces" : "Hair"}
          </Text>

          {/* > button */}
          <TouchableOpacity onPress={() => setShowFaces(true)}>
            <Text className={`text-white text-4xl font-bold font-spaceGrotesk ${showFaces ? "opacity-50" : ""}`}>
              {">"}
            </Text>
          </TouchableOpacity>
        </View>
      </View> 

      <View className="flex-1 bg-white">
        <View className="flex-1 w-full bg-[#F5A58C]">
          <FlatList
            data={displayedImages}
            renderItem={renderRow}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={{
              alignItems: 'center',
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default AvatarCreation;
