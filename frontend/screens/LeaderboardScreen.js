import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const LeaderBoardScreen = () => {
  const navigation = useNavigation();

  // Hardcoded data for now
  const roomies = [
    { id: "1", name: "roomie #1", bgClass: "bg-[#FF8C83]", score: 5 },
    { id: "2", name: "roomie #2", bgClass: "bg-[#FFB95C]", score: 200 },
    { id: "3", name: "roomie #3", bgClass: "bg-[#6CD8D5]", score: 300 },
  ];

  // Sort roomies so the highest score is first
  const sortedRoomies = [...roomies].sort((a, b) => b.score - a.score);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="items-center mt-4">
        <Text className="text-2xl font-bold">Leaderboard</Text>
      </View>

      {/* Roomies Ranking */}
      <ScrollView className="mt-6 px-4">
        {sortedRoomies.map((roomie, index) => (
          <TouchableOpacity
            key={roomie.id}
            className={`${roomie.bgClass} p-4 rounded-lg mb-4 flex-row items-center justify-between`}
            onPress={() => {
              // Optional: Add press functionality here
            }}
          >
            {/* Left side: Rank, Profile Picture, and Name */}
            <View className="flex-row items-center">
              <Text className="text-xl font-bold mr-2">{index + 1}.</Text>
              <View className="w-12 h-12 rounded-full items-center justify-center mr-2 bg-white">
                <Ionicons name="person" size={24} color="black" />
              </View>
              <Text className="text-xl font-bold">{roomie.name}</Text>
            </View>
            {/* Right side: Score */}
            <Text className="text-xl font-bold">Score: {roomie.score}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderBoardScreen;
