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
import { useNavigation, useRoute } from "@react-navigation/native";
import { saveAvatar } from "../api/users.api";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import Ionicons from "@expo/vector-icons/Ionicons";


const dark_hair = [
  { id: "1", image: require("../../frontend/assets/dark_hair/hair-f1-dark-new.png") },
  { id: "2", image: require("../../frontend/assets/dark_hair/hair-f2-dark-new.png") },
  { id: "3", image: require("../../frontend/assets/dark_hair/hair-f3-dark-new.png") },
  { id: "4", image: require("../../frontend/assets/dark_hair/hair-f4-dark-new.png") },
  { id: "5", image: require("../../frontend/assets/dark_hair/hair-f5-dark-new.png") },
  { id: "6", image: require("../../frontend/assets/dark_hair/hair-f6-dark-new.png") },
  { id: "7", image: require("../../frontend/assets/dark_hair/hair-f7-dark-new.png") },
  { id: "8", image: require("../../frontend/assets/dark_hair/hair-f8-dark-new.png") },
  { id: "9", image: require("../../frontend/assets/dark_hair/hair-f9-dark-new.png") },
  { id: "10", image: require("../../frontend/assets/dark_hair/hair-m1-dark-new.png") },
  { id: "11", image: require("../../frontend/assets/dark_hair/hair-m2-dark-new.png") },
  { id: "12", image: require("../../frontend/assets/dark_hair/hair-m3-dark-new.png") },
  { id: "13", image: require("../../frontend/assets/dark_hair/hair-m4-dark-new.png") },
  { id: "14", image: require("../../frontend/assets/dark_hair/hair-m5-dark-new.png") },
];

const light_hair = [
  { id: "1", image: require("../../frontend/assets/light_hair/hair-f1-light-new.png") },
  { id: "2", image: require("../../frontend/assets/light_hair/hair-f2-light-new.png") },
  { id: "3", image: require("../../frontend/assets/light_hair/hair-f3-light-new.png") },
  { id: "4", image: require("../../frontend/assets/light_hair/hair-f4-light-new.png") },
  { id: "5", image: require("../../frontend/assets/light_hair/hair-f5-light-new.png") },
  { id: "6", image: require("../../frontend/assets/light_hair/hair-f6-light-new.png") },
  { id: "7", image: require("../../frontend/assets/light_hair/hair-f7-light-new.png") },
  { id: "8", image: require("../../frontend/assets/light_hair/hair-f8-light-new.png") },
  { id: "9", image: require("../../frontend/assets/light_hair/hair-f9-light-new.png") },
  { id: "10", image: require("../../frontend/assets/light_hair/hair-m1-light-new.png") },
  { id: "11", image: require("../../frontend/assets/light_hair/hair-m2-light-new.png") },
  { id: "12", image: require("../../frontend/assets/light_hair/hair-m3-light-new.png") },
  { id: "13", image: require("../../frontend/assets/light_hair/hair-m4-light-new.png") },
  { id: "14", image: require("../../frontend/assets/light_hair/hair-m5-light-new.png") },
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

const skin_color = [
  { id: "1", image: require("../../frontend/assets/skin_colors/skin-0.png") },
  { id: "2", image: require("../../frontend/assets/skin_colors/skin-1.png") },
  { id: "3", image: require("../../frontend/assets/skin_colors/skin-2.png") },
  { id: "4", image: require("../../frontend/assets/skin_colors/skin-3.png") },
]

const accessories = [
  { id: "1", image: require("../../frontend/assets/accessories/accessory-1.png") },
  { id: "2", image: require("../../frontend/assets/accessories/accessory-2.png") },
  { id: "3", image: require("../../frontend/assets/accessories/accessory-3.png") },
  { id: "4", image: require("../../frontend/assets/accessories/accessory-4.png") },
  { id: "5", image: require("../../frontend/assets/accessories/accessory-5.png") },
  { id: "6", image: require("../../frontend/assets/accessories/accessory-6.png") },
  { id: "7", image: require("../../frontend/assets/accessories/accessory-7.png") },
  { id: "8", image: require("../../frontend/assets/accessories/accessory-8.png") },
  { id: "9", image: require("../../frontend/assets/accessories/accessory-9.png") },
]
import Ionicons from "@expo/vector-icons/Ionicons";


const AvatarCreation = ({ }) => {
  const [isToggled, setIsToggled] = useState(false);
  const [selectedHair, setSelectedHair] = useState(dark_hair[0]); // default: hair id "1"
  const [selectedFace, setSelectedFace] = useState(faces[0]);     // default: face id "1"
  const [selectedSkinColor, setSelectedSkinColor] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const navigation = useNavigation();
  const viewShotRef = useRef(null);
  const route = useRoute();
  const from = route.params?.from || "ProfileScreen";
  const [whichScreen, setWhichScreen] = useState(0);
  

  const writeAvatar = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current.capture();
        const fileName = `my-avatar-${Date.now()}.png`;
        const newUri = FileSystem.documentDirectory + fileName;
        await FileSystem.copyAsync({ from: uri, to: newUri });
        console.log("done");
        await saveAvatar(newUri);
        console.log("Avatar saved at:", newUri);
        return newUri;
      } catch (error) {
        console.error("Error saving avatar:", error);
      }
    }
  };

  const displayedImages = (() => {
    if (whichScreen === 0) return isToggled ? light_hair : dark_hair;
    if (whichScreen === 1) return faces;
    if (whichScreen === 2) return skin_color;
    if (whichScreen === 3) return accessories;
    return [];
  })();


  const renderRow = ({ item }) => {
    const isSelected =
      whichScreen === 0 && selectedHair?.id === item.id ||
      whichScreen === 1 && selectedFace?.id === item.id ||
      whichScreen === 2 && selectedSkinColor?.id === item.id ||
      whichScreen === 3 && selectedAccessory?.id === item.id;
  
    return (
      <Pressable
        onPress={() => {
          if (whichScreen === 0) setSelectedHair(item);
          else if (whichScreen === 1) setSelectedFace(item);
          else if (whichScreen === 2) setSelectedSkinColor(item);
          else if (whichScreen === 3) setSelectedAccessory(item);
        }}
        style={{ alignItems: "center" }}
      >
        <View
          style={{
            backgroundColor: isSelected ? "#FEF9E5" : "transparent",
            borderRadius: 12,
            resizeMode: "contain",
            flex: 1,
          }}
        >
          <Image source={item.image} style={{ width: 130, height: 130 }} />
        </View>
      </Pressable>
    );
  };
  
  

  return (
    <View className="flex-1 bg-custom-blue-200">
      <View className="items-center pt-20">
        <Text className="text-white text-4xl font-bold font-spaceGrotesk">
          my avatar
        </Text>

        {/* Avatar Preview */}
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
          <View className="w-72 h-72 my-6 bg-[#FFE7C0] rounded-full items-center justify-center overflow-hidden relative">


            {selectedHair && (
              <Image
                source={selectedHair.image}
                className="h-96 w-96 absolute"
                resizeMode="contain"
              />
            )}
             
             {selectedSkinColor && (
              <Image
                source={selectedSkinColor.image}
                className="h-96 w-96 absolute"
                resizeMode="contain"
              />
             )}

             {selectedFace && (
              <Image
                source={selectedFace.image}
                className="h-96 w-96 absolute"
                resizeMode="contain"
              />
             )}

            {selectedAccessory && (
              <Image
                source={selectedAccessory.image}
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
              source={require("../../frontend/assets/dark_hair/hair-m5-dark-new.png")}
              className="w-20 h-20 absolute left-0 -ml-[17%]"
              resizeMode="contain"
            />
            <Image
              source={require("../../frontend/assets/light_hair/hair-m5-light-new.png")}
              className="w-20 h-20 absolute right-0 -mr-[15%]"
              resizeMode="contain"
            />
          </Pressable>

          <TouchableOpacity
            onPress={async () => {
              writeAvatar();
              await writeAvatar();
              if (from === "group") {
                navigation.replace("Main"); // redirect to MainTabs if from group
              } else {
                navigation.replace("ProfilePage"); // go back to ProfileDrawer
    }
            }}
            className="w-28 h-12 rounded-full bg-[#FFB95C] items-center justify-center"
          >
            <Text className="text-white text-2xl font-bold font-spaceGrotesk">
              done
            </Text>
          </TouchableOpacity>
        </View>
        {/* Navigation Buttons */}

        <View className="w-full bg-[#FFE7C0] flex-row justify-between items-center px-6 py-4">
          <TouchableOpacity
            onPress={() => setWhichScreen(prev => Math.max(prev - 1, 0))}
            disabled={whichScreen === 0}
          >
            <Text
              className={`text-custom-blue-200 text-4xl font-bold font-spaceGrotesk ${
                whichScreen === 0 ? "opacity-50" : ""
              }`}
            >
              {"<"}
            </Text>
          </TouchableOpacity>

          <Text className="text-custom-blue-200 text-4xl font-bold font-spaceGrotesk">
            {["hair", "face", "skin color", "accessories"][whichScreen]}
          </Text>


          <TouchableOpacity
            onPress={() => setWhichScreen(prev => Math.min(prev + 1, 3))}
            disabled={whichScreen === 3}
          >
            <Text
              className={`text-custom-blue-200 text-4xl font-bold font-spaceGrotesk ${
                whichScreen === 3 ? "opacity-50" : ""
              }`}
            >
              {">"}
            </Text>
          </TouchableOpacity>
        </View>

      
      </View> 

      <View className="flex-1 bg-white">
        <View className="flex-1 w-full bg-custom-yellow">
          <FlatList
            data={displayedImages}
            renderItem={renderRow}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={{
              alignItems: 'center',
              //flexWrap: 'wrap',
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default AvatarCreation;