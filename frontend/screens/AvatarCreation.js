import React, { use, useState } from "react";
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

  // Calculate which images to display
  const startIndex = currentPage * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const displayedImages = isToggled
  ? light_hair.slice(startIndex, endIndex)
  : dark_hair.slice(startIndex, endIndex);

  // Pagination functions
  const nextPage = () => {
    if (endIndex < dark_hair.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <View className="flex-1 bg-[#788ABF]">
      {/* Avatar Title */}
      <View className="flex-1 items-center justify-center pt-8">
        <Text className="m-10 text-white text-4xl font-bold font-spaceGrotesk">my avatar</Text>

        {/* Avatar Circle */}
        <View className="w-72 h-72 bg-[#FFD49B] rounded-full items-center justify-center overflow-hidden">
          <Image 
          source={require("../../frontend/assets/head/base-head.png")} 
          className="h-96 w-96"
          resizeMode="contain"
          >

          </Image>
        </View>

        <View className="pt-6 w-full flex flex-row justify-between px-8">
          {/* Toggle Button */}
          <Pressable
            onPress={() => setIsToggled(!isToggled)}
            className="w-28 h-12 rounded-full bg-white flex-row items-center justify-between relative"
          >
            {/* Toggle Circle */}
            <View
              className="w-12 h-12 bg-[#FFB95C] rounded-full"
              style={{
                position: "absolute",
                left: isToggled ? "74%" : "-17%",
                transform: [{ translateX: isToggled ? -16 : 16 }],
                transition: "all 0.3s ease",
              }}
            />
            {/* Dark Hair Image */}
            <Image
              source={require("../../frontend/assets/dark_hair/hair-m4-dark.png")}
              className="w-20 h-20 absolute left-0 -ml-[17%]"
              resizeMode="contain"
            />

            {/* Light Hair Image */}
            <Image
              source={require("../../frontend/assets/light_hair/hair-m4-light.png")}
              className="w-20 h-20 absolute right-0 -mr-[15%]"
              resizeMode="contain"
            />
          </Pressable>

          {/* Done Button */}
          <TouchableOpacity
            onPress={() => console.log("save and go back")}
            className="w-28 h-12 rounded-full bg-[#FFB95C] items-center justify-center"
          >
            <Text className="text-white text-2xl font-bold font-spaceGrotesk">done</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Section - Avatar Options */}
      <View className="w-full h-[45%] bg-[#F5A58C] flex justify-center">
        <View className="absolute top-0 w-full bg-[#f6b59d] p-5 flex-row justify-between items-center">

          {/* Previous Button */}
          <TouchableOpacity onPress={prevPage} disabled={currentPage === 0}>
            <Text
              className={`text-white text-4xl font-bold font-spaceGrotesk ${
                currentPage === 0 ? "opacity-50" : ""
              }`}
            >
              {"<"}
            </Text>
          </TouchableOpacity>

          <Text className="text-[#FEF9E5] text-4xl font-bold font-spaceGrotesk">hair</Text>

          {/* Next Button */}
          <TouchableOpacity onPress={nextPage} disabled={endIndex >= dark_hair.length}>
            <Text
              className={`text-white text-4xl font-bold font-spaceGrotesk ${
                endIndex >= dark_hair.length ? "opacity-50" : ""
              }`}
            >
              {">"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Display Images */}
        <View className="w-full bg-[#F5A58C] flex justify-center">
          {/* Row 1 */}
          <View className="flex flex-row justify-center mb-3">
            {displayedImages.slice(0, 3).map((item) => (
              <Pressable 
                key={item.id} 
                onPress={() => {
                  setSelectedHair(item.id); // Select the clicked hair
                  console.log(`Chose hair: ${item.name}`);
                }}
              >
                <View
                  className={`items-center justify-center ${selectedHair === item.id ? "bg-[#FEF9E5] h-32 w-32 m-3 rounded-xl" : ""}`}
                >
                  <Image source={item.image} style={{ width: 130, height: 130 }} />
                </View>
              </Pressable>
            ))}
          </View>

          {/* Row 2 */}
          <View className="flex flex-row justify-center">
            {displayedImages.slice(3, 6).map((item) => (
              <Pressable 
                key={item.id} 
                onPress={() => {
                  setSelectedHair(item.id); // Select the clicked hair
                  console.log(`Chose hair: ${item.name}`);
                }}
              >
                <View
                  className={`items-center justify-center ${selectedHair === item.id ? "bg-[#FEF9E5] h-32 w-32 m-3 rounded-xl" : ""}`}
                >
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
