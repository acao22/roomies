<<<<<<< HEAD
import React, { useRef, useMemo } from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> bc883036ff7428b327678a900cec8e160929c1a5
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated
} from "react-native";
<<<<<<< HEAD
import { useNavigation, useFocusEffect } from "@react-navigation/native";
=======
import { useNavigation } from "@react-navigation/native";
import { getUserGroup, getUserInfo } from "../api/users.api";
import face1 from '../assets/face1.png';
>>>>>>> bc883036ff7428b327678a900cec8e160929c1a5

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

<<<<<<< HEAD
  // Hardcoded data for now
  const roomies = [
    { id: "1", name: "roomie1", score: 5, image: require("../assets/face1.png") },
    { id: "2", name: "roomie2", score: 200, image: require("../assets/face2.png") },
    { id: "3", name: "roomie3", score: 300, image: require("../assets/face3.png") },
  ];
=======
>>>>>>> bc883036ff7428b327678a900cec8e160929c1a5

  // Sort roomies so the highest score is first
  const sortedRoomies = [...roomies].sort((a, b) => b.totalPoints - a.totalPoints);
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
    <View className="flex-1 bg-custom-tan">


    <ScrollView className="mt-6 px-4 bg-custom-tan flex-1">
      {/* Header */}
      <View className="items-center mt-4 pb-3 bg-custom-tan">
        <Text className="mt-10 text-custom-pink-200 text-5xl font-bold font-spaceGrotesk">leaderboard</Text>
      </View>

      {/* Podium */}
<<<<<<< HEAD
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
=======
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

>>>>>>> bc883036ff7428b327678a900cec8e160929c1a5
            </View>
          )}

          {/* 1st Place */}
          {first && (
<<<<<<< HEAD
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
=======
            <View className="absolute items-center top-1">
              <Text className="text-custom-tan text-3xl font-bold font-spaceGrotesk mb-5">1</Text>
              <View className="w-24 h-24 rounded-full bg-custom-tan items-center justify-center">
                <Image source={face1} className="w-24 h-24" />
                <Image source={require("../assets/crown.png")} className="absolute w-20 h-20" style={{top: -36, right: -10, transform:[{rotate: "5deg"}],}} />


              </View>
              <Text className="text-custom-tan text-2xl mt-1 font-bold font-spaceGrotesk">{first.firstName}</Text>
              <Text className="text-custom-tan text-sm font-spaceGrotesk">{first.totalPoints}</Text>

>>>>>>> bc883036ff7428b327678a900cec8e160929c1a5
            </View>
          )}

          {/* 3rd Place */}
          {third && (
<<<<<<< HEAD
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
=======
            <View className="absolute right-10 top-12 items-center">
              <Text className="text-custom-tan text-3xl mt-1 font-bold font-spaceGrotesk">3</Text>

              <View className="w-20 h-20 rounded-full bg-custom-tan items-center justify-center">
                <Image source={face1} className="w-20 h-20" />

              </View>
              <Text className="text-custom-tan text-2xl mt-1 font-bold font-spaceGrotesk">{third.firstName}</Text>
              <Text className="text-custom-tan text-sm font-spaceGrotesk">{third.totalPoints}</Text>

>>>>>>> bc883036ff7428b327678a900cec8e160929c1a5
            </View>
          )}
        </View>
      </View>

      {/* Roomies Ranking */}
      <View className="flex-row items-center">
        <View className="mt-6 px-4">
<<<<<<< HEAD
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
=======
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
>>>>>>> bc883036ff7428b327678a900cec8e160929c1a5
      </View>
    </ScrollView>
    </View>
  );
};

export default LeaderBoardScreen;
