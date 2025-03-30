import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getUserGroup, getUserInfo } from "../api/users.api";
import face1 from '../assets/face1.png';

const LeaderBoardScreen = () => {
  const navigation = useNavigation();
  const [roomies, setRoomies] = useState([]);

  //get group data
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupData = await getUserGroup();
        if (groupData && groupData.members) {
          setRoomies(groupData.members);
        }
      } catch (err) {
        console.error("Failed to fetch group data");
      }
    };

    fetchGroup();
  }, []);


  // Sort roomies so the highest score is first
  const sortedRoomies = [...roomies].sort((a, b) => b.totalPoints - a.totalPoints);
  const [first, second, third] = sortedRoomies;

  return (
    <View className="flex-1 bg-custom-tan">


    <ScrollView className="mt-6 px-4 bg-custom-tan flex-1">
      {/* Header */}
      <View className="items-center mt-4 pb-3 bg-custom-tan">
        <Text className="mt-10 text-custom-pink-200 text-5xl font-bold font-spaceGrotesk">leaderboard</Text>
      </View>
      {/* Podium */}
      <View
        className="bg-custom-pink-200 rounded-3xl p-2 mb-4 shadow-sm pb-28"
      >
        {/* Podium Structure */}
        <View className="flex-row justify-center items-end mt-6 relative h-32 w-full">
          {/* 2nd Place - Left (Lower) */}
          {second && (
            <View className="absolute left-10 top-10 items-center">
              <Text className="text-custom-tan text-3xl mt-1 font-bold font-spaceGrotesk">2</Text>
              <View className="w-20 h-20 rounded-full bg-custom-tan items-center justify-center">
                <Image source={face1} className="w-20 h-20" />
                
              </View>
              <Text className="text-custom-tan text-2xl mt-1 font-bold">{second.firstName}</Text>
              <Text className="text-custom-tan text-sm font-spaceGrotesk">{second.totalPoints}</Text>

            </View>
          )}

          {/* 1st Place - Center (Highest) */}
          {first && (
            <View className="absolute items-center top-1">
              <Text className="text-custom-tan text-3xl font-bold font-spaceGrotesk mb-5">1</Text>
              <View className="w-24 h-24 rounded-full bg-custom-tan items-center justify-center">
                <Image source={face1} className="w-24 h-24" />
                <Image source={require("../assets/crown.png")} className="absolute w-20 h-20" style={{top: -36, right: -10, transform:[{rotate: "5deg"}],}} />


              </View>
              <Text className="text-custom-tan text-2xl mt-1 font-bold font-spaceGrotesk">{first.firstName}</Text>
              <Text className="text-custom-tan text-sm font-spaceGrotesk">{first.totalPoints}</Text>

            </View>
          )}

          {/* 3rd Place - Right (Lowest) */}
          {third && (
            <View className="absolute right-10 top-12 items-center">
              <Text className="text-custom-tan text-3xl mt-1 font-bold font-spaceGrotesk">3</Text>

              <View className="w-20 h-20 rounded-full bg-custom-tan items-center justify-center">
                <Image source={face1} className="w-20 h-20" />

              </View>
              <Text className="text-custom-tan text-2xl mt-1 font-bold font-spaceGrotesk">{third.firstName}</Text>
              <Text className="text-custom-tan text-sm font-spaceGrotesk">{third.totalPoints}</Text>

            </View>
          )}
        </View>
      </View>
      

      {/* Roomies Ranking */}
      <View
        className={`flex-row items-center`}
      >
        
        <View className="mt-6 px-4">
        {sortedRoomies.map((roomie, index) => (
          <View key={roomie.uid ? `${roomie.uid}-${index}`: index} className="flex-row items-center mb-1 px-4">
              <Text className="text-4xl text-custom-blue-100 font-bold font-spaceGrotesk mr-5">{index + 1}</Text>


          
          <TouchableOpacity
            className={`bg-custom-blue-100 p-4 rounded-2xl mb-4 flex-row items-center justify-between`}
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
                <Image source={face1} className="w-12 h-12" />
              </View>
              <Text className="text-2xl font-bold text-custom-tan font-spaceGrotesk">{roomie.firstName}</Text>
            </View>
            {/* Right side: Score */}
            <Text className="text-sm text-custom-tan font-spaceGrotesk">{roomie.totalPoints}</Text>
          </TouchableOpacity>
          </View>
        ))}
      </View>

      </View>
      
    </ScrollView>
    </View>
  );
};

export default LeaderBoardScreen;
