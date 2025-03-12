import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";

const AvatarCreation = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedHair, setSelectedHair] = useState(null);
  const imagesPerPage = 6;

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

  const totalHairPages = Math.ceil(dark_hair.length / imagesPerPage);
  const isFaceSection = currentPage >= totalHairPages;

  const startIndex = isFaceSection
    ? (currentPage - totalHairPages) * imagesPerPage
    : currentPage * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  const displayedImages = isFaceSection
    ? faces.slice(startIndex, endIndex)
    : isToggled
    ? light_hair.slice(startIndex, endIndex)
    : dark_hair.slice(startIndex, endIndex);

  const totalPages = totalHairPages + Math.ceil(faces.length / imagesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <View className="flex-1 bg-[#788ABF]">
      <View className="flex-1 items-center justify-center pt-8">
        <Text className="m-10 text-white text-4xl font-bold font-spaceGrotesk">
          my avatar
        </Text>
        <View className="w-72 h-72 bg-[#FFD49B] rounded-full items-center justify-center overflow-hidden">
          <Image
            source={require("../../frontend/assets/head/base-head.png")}
            className="h-96 w-96"
            resizeMode="contain"
          />
        </View>
      </View>
      <View className="w-full h-[45%] bg-[#F5A58C] flex justify-center">
        <View className="absolute top-0 w-full bg-[#f6b59d] p-5 flex-row justify-between items-center">
          <TouchableOpacity onPress={prevPage} disabled={currentPage === 0}>
            <Text className={`text-white text-4xl font-bold font-spaceGrotesk ${currentPage === 0 ? "opacity-50" : ""}`}>
              {"<"}
            </Text>
          </TouchableOpacity>
          <Text className="text-[#FEF9E5] text-4xl font-bold font-spaceGrotesk">
            {isFaceSection ? "face" : "hair"}
          </Text>
          <TouchableOpacity onPress={nextPage} disabled={currentPage >= totalPages - 1}>
            <Text className={`text-white text-4xl font-bold font-spaceGrotesk ${currentPage >= totalPages - 1 ? "opacity-50" : ""}`}>
              {">"}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-full bg-[#F5A58C] flex justify-center">
          <View className="flex flex-row justify-center mb-3">
            {displayedImages.slice(0, 3).map((item) => (
              <Pressable key={item.id} onPress={() => setSelectedHair(item.id)}>
                <View className={`items-center justify-center ${selectedHair === item.id ? "bg-[#FEF9E5] h-32 w-32 m-3 rounded-xl" : ""}`}>
                  <Image source={item.image} style={{ width: 130, height: 130 }} />
                </View>
              </Pressable>
            ))}
          </View>
          <View className="flex flex-row justify-center">
            {displayedImages.slice(3, 6).map((item) => (
              <Pressable key={item.id} onPress={() => setSelectedHair(item.id)}>
                <View className={`items-center justify-center ${selectedHair === item.id ? "bg-[#FEF9E5] h-32 w-32 m-3 rounded-xl" : ""}`}>
                  <Image source={item.image} style={{ width: 130, height: 130 }} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default AvatarCreation;