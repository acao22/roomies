import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const LeaderBoardScreen = () => {
  const navigation = useNavigation();

  // Hardcoded data for now
  const roomies = [
    { id: "1", name: "roomie1", bgClass: "bg-custom-red", score: 5, image: require("../assets/face1.png") },
    { id: "2", name: "roomie2", bgClass: "bg-custom-blue-100", score: 200, image: require("../assets/face2.png")  },
    { id: "3", name: "roomie3", bgClass: "bg-custom-yellow", score: 300, image: require("../assets/face3.png")  },
  ];

  // Sort roomies so the highest score is first
  const sortedRoomies = [...roomies].sort((a, b) => b.score - a.score);
  const [first, second, third] = sortedRoomies;

  return (
    <View className="mt-6 px-4 bg-custom-tan flex-1">
      {/* Header */}
      <View className="items-center mt-4 pb-3 bg-custom-tan">
        <Text className="mt-10 text-custom-red text-5xl font-bold font-spaceGrotesk">leaderboard</Text>
      </View>
      {/* Podium */}
      <View
        className="bg-custom-red rounded-3xl p-2 mb-4 shadow-sm pb-28"
      >
        {/* Podium Structure */}
        <View className="flex-row justify-center items-end mt-6 relative h-32 w-full">
          {/* 2nd Place - Left (Lower) */}
          {second && (
            <View className="absolute left-10 top-10 items-center">
              <Text className="text-custom-tan text-3xl mt-1 font-bold font-spaceGrotesk">2</Text>
              <View className="w-20 h-20 rounded-full bg-custom-tan items-center justify-center">
                <Image source={second.image} className="w-20 h-20" />
                
              </View>
              <Text className="text-custom-tan text-2xl mt-1 font-bold">{second.name}</Text>
              <Text className="text-custom-tan text-sm font-spaceGrotesk">{second.score}</Text>

            </View>
          )}

          {/* 1st Place - Center (Highest) */}
          {first && (
            <View className="absolute items-center top-1">
              <Text className="text-custom-tan text-3xl font-bold font-spaceGrotesk mb-5">1</Text>
              <View className="w-24 h-24 rounded-full bg-custom-tan items-center justify-center">
                <Image source={first.image} className="w-24 h-24" />
                <Image source={require("../assets/crown.png")} className="absolute w-20 h-20" style={{top: -36, right: -10, transform:[{rotate: "5deg"}],}} />


              </View>
              <Text className="text-custom-tan text-2xl mt-1 font-bold font-spaceGrotesk">{first.name}</Text>
              <Text className="text-custom-tan text-sm font-spaceGrotesk">{first.score}</Text>

            </View>
          )}

          {/* 3rd Place - Right (Lowest) */}
          {third && (
            <View className="absolute right-10 top-12 items-center">
              <Text className="text-custom-tan text-3xl mt-1 font-bold font-spaceGrotesk">3</Text>

              <View className="w-20 h-20 rounded-full bg-custom-tan items-center justify-center">
                <Image source={third.image} className="w-20 h-20" />

              </View>
              <Text className="text-custom-tan text-2xl mt-1 font-bold font-spaceGrotesk">{third.name}</Text>
              <Text className="text-custom-tan text-sm font-spaceGrotesk">{third.score}</Text>

            </View>
          )}
        </View>
      </View>
      

      {/* Roomies Ranking */}
      <View
        className={`flex-row items-center`}
      >
        
        <ScrollView className="mt-6 px-4">
        {sortedRoomies.map((roomie, index) => (
          <View key={roomie.id} className="flex-row items-center mb-1 px-4">
              <Text className="text-4xl text-custom-blue-100 font-bold font-spaceGrotesk mr-5">{index + 1}</Text>


          
          <TouchableOpacity
            key={roomie.id}
            className={`${roomie.bgClass} p-4 rounded-2xl mb-4 flex-row items-center justify-between`}
            style={{
              width: 280,
              alignSelf:"center",
            }}
            onPress={() => {
              // Optional: Add feature where when touched, popup screen that shows tasks they completed that contributes to score
            }}
          >
            {/* Left side: Rank, Profile Picture, and Name */}
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-full items-center justify-center mr-2 bg-custom-tan">
                <Image source={roomie.image} className="w-12 h-12" />
              </View>
              <Text className="text-2xl font-bold text-custom-tan font-spaceGrotesk">{roomie.name}</Text>
            </View>
            {/* Right side: Score */}
            <Text className="text-sm text-custom-tan font-spaceGrotesk">{roomie.score}</Text>
          </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      </View>
      
    </View>
  );
};

export default LeaderBoardScreen;
