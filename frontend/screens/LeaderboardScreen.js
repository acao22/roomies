import React, { useRef, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const LeaderBoardScreen = () => {
  const navigation = useNavigation();

  // Hardcoded data for now
  const roomies = [
    { id: "1", name: "roomie1", score: 5, image: require("../assets/face1.png") },
    { id: "2", name: "roomie2", score: 200, image: require("../assets/face2.png") },
    { id: "3", name: "roomie3", score: 300, image: require("../assets/face3.png") },
  ];

  // Sort roomies so the highest score is first
  const sortedRoomies = [...roomies].sort((a, b) => b.score - a.score);
  const [first, second, third] = sortedRoomies;

  const maxScore = Math.max(first?.score || 1, second?.score || 1, third?.score || 1);

  // Animated heights for podium bars
  const firstHeight = useRef(new Animated.Value(0)).current;
  const secondHeight = useRef(new Animated.Value(0)).current;
  const thirdHeight = useRef(new Animated.Value(0)).current;

  // Animated opacity for ranking cards
  const cardOpacities = useMemo(
    () => sortedRoomies.map(() => new Animated.Value(0)),
    [sortedRoomies]
  );
  useFocusEffect(
    React.useCallback(() => {
      // Reset podium bars
      firstHeight.setValue(0);
      secondHeight.setValue(0);
      thirdHeight.setValue(0);

      // Reset card opacities
      cardOpacities.forEach(opacity => opacity.setValue(0));

      // Animate podiums
      Animated.timing(firstHeight, {
        toValue: Math.max(20, (first?.score / maxScore) * 180),
        duration: 800,
        useNativeDriver: false,
      }).start();

      if (second) {
        Animated.timing(secondHeight, {
          toValue: Math.max(20, (second?.score / maxScore) * 180),
          duration: 800,
          useNativeDriver: false,
        }).start();
      }

      if (third) {
        Animated.timing(thirdHeight, {
          toValue: Math.max(20, (third?.score / maxScore) * 180),
          duration: 800,
          useNativeDriver: false,
        }).start();
      }

      // Animate ranking cards with fade-in (staggered)
      Animated.stagger(
        200,
        cardOpacities.map(opacity =>
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        )
      ).start();

      return () => {
        firstHeight.stopAnimation();
        secondHeight.stopAnimation();
        thirdHeight.stopAnimation();
      };
    }, [first, second, third])
  );

  return (
    <ScrollView className="mt-6 px-4 bg-custom-tan flex-1">
      {/* Header */}
      <View className="items-center mt-4 pb-3 bg-custom-tan">
        <Text className="mt-10 text-custom-pink-200 text-5xl font-bold font-spaceGrotesk">leaderboard</Text>
      </View>

      {/* Podium */}
      <View className="bg-custom-pink-200 rounded-3xl mb-4 shadow-sm">
        <View className="relative w-full h-[270px] flex items-center justify-end mt-6">
          {/* 2nd Place */}
          {second && (
            <View className="absolute items-center bottom-0" style={{ left: 37 }}>
              <Animated.View
                className="absolute bottom-0 w-[102px] rounded-t-lg"
                style={{ height: secondHeight, backgroundColor: "#f6b8a0" }}
              />
              <View style={{ transform: [{ translateY: -Math.max(0, (second.score / maxScore) * 120 - 40) }] }}>
                <Text className="text-custom-tan text-3xl font-bold font-spaceGrotesk text-center">2</Text>
                <View className="w-20 h-20 rounded-full bg-custom-tan items-center justify-center">
                  <Image source={second.image} className="w-[74px] h-[74px]" />
                </View>
                <Text className="text-custom-tan text-2xl mt-1 font-bold text-center">{second.name}</Text>
                <Text className="text-custom-tan text-m font-spaceGrotesk text-center">{second.score}</Text>
              </View>
            </View>
          )}

          {/* 1st Place */}
          {first && (
            <View className="absolute items-center bottom-0">
              <Animated.View
                className="absolute bottom-0 w-[110px] rounded-t-lg"
                style={{ height: firstHeight, backgroundColor: "#fac9b3" }}
              />
              <View style={{ transform: [{ translateY: -Math.max(0, (first.score / maxScore) * 120 - 25) }] }}>
                <Text className="text-custom-tan text-3xl font-bold font-spaceGrotesk text-center mb-5">1</Text>
                <View className="w-24 h-24 rounded-full bg-custom-tan items-center justify-center">
                  <Image source={first.image} className="w-[74px] h-[74px]" />
                  <Image source={require("../assets/crown.png")} className="absolute w-[59px] h-[59px] pt-[5px]" style={{ top: -36, right: -10, transform: [{ rotate: "5deg" }] }} />
                </View>
                <Text className="text-custom-tan text-2xl mt-1 font-bold font-spaceGrotesk text-center">{first.name}</Text>
                <Text className="text-custom-tan text-m font-spaceGrotesk text-center">{first.score}</Text>
              </View>
            </View>
          )}

          {/* 3rd Place */}
          {third && (
            <View className="absolute items-center bottom-0" style={{ right: 37 }}>
              <Animated.View
                className="absolute bottom-0 w-[102px] rounded-t-lg"
                style={{ height: thirdHeight, backgroundColor: "#f6b8a0" }}
              />
              <View style={{ transform: [{ translateY: -Math.max(0, (third.score / maxScore) * 120 - 40) }] }}>
                <Text className="text-custom-tan text-3xl font-bold font-spaceGrotesk text-center">3</Text>
                <View className="w-20 h-20 rounded-full bg-custom-tan items-center justify-center">
                  <Image source={third.image} className="w-[74px] h-[74px]" />
                </View>
                <Text className="text-custom-tan text-2xl mt-1 font-bold text-center">{third.name}</Text>
                <Text className="text-custom-tan text-m font-spaceGrotesk text-center">{third.score}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Roomies Ranking */}
      <View className="flex-row items-center">
        <View className="mt-6 px-4">
          {sortedRoomies.map((roomie, index) => (
            <Animated.View
              key={roomie.id}
              className="flex-row items-center mb-1 px-4"
              style={{ opacity: cardOpacities[index] }}
            >
              <Text className="text-4xl text-custom-blue-100 font-bold font-spaceGrotesk mr-5">{index + 1}</Text>
              <TouchableOpacity
                className="bg-custom-blue-100 p-4 rounded-2xl mb-4 flex-row items-center justify-between"
                style={{
                  width: 280,
                  alignSelf: "center",
                }}
              >
                {/* Left side */}
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full items-center justify-center mr-2 bg-custom-tan">
                    <Image source={roomie.image} className="w-12 h-12" />
                  </View>
                  <Text className="text-2xl font-bold text-custom-tan font-spaceGrotesk">{roomie.name}</Text>
                </View>
                {/* Score */}
                <Text className="text-2xl text-custom-tan font-spaceGrotesk">{roomie.score}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default LeaderBoardScreen;
