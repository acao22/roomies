import React, { useRef, useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getUserGroup, getUserInfo, fetchAvatar } from "../api/users.api";

import { getUserGroup } from "../api/users.api";
import face1 from '../assets/face1.png';
import crown from '../assets/crown.png';
import questionIcon from '../assets/question.png';
import crown from "../assets/crown.png";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig"

const LeaderBoardScreen = () => {
  const [roomies, setRoomies] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      const fetchGroupAndAvatars = async () => {
        try {
          const groupData = await getUserGroup();
          if (groupData && groupData.members) {
            // For each member, fetch the avatar using their uid.
            const membersWithAvatars = await Promise.all(
              groupData.members.map(async (member) => {
                try {
                  // Pass the uid as an argument to fetchAvatar
                  const avatarData = await fetchAvatar(member.uid);
                  return { ...member, avatar: avatarData.uri };
                } catch (err) {
                  console.error(`Error fetching avatar for ${member.uid}:`, err);
                  // Use a default avatar if fetching fails
                  return { ...member, avatar: null };
                }
              })
            );
            setRoomies(membersWithAvatars);
          }
        } catch (err) {
          console.error("Failed to fetch group data", err);
        }
      };
  
      fetchGroupAndAvatars();
    }, [])
  );

  // Sort roomies so the highest score is first
  const [showInfo, setShowInfo] = useState(false);

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

  const sortedRoomies = [...roomies].sort((a, b) => b.totalPoints - a.totalPoints);
  const [first, second, third] = sortedRoomies;
  const maxScore = Math.max(...sortedRoomies.map(r => r.totalPoints || 1), 1);

  const firstHeight = useRef(new Animated.Value(0)).current;
  const secondHeight = useRef(new Animated.Value(0)).current;
  const thirdHeight = useRef(new Animated.Value(0)).current;

  const cardOpacities = useMemo(
    () => sortedRoomies.map(() => new Animated.Value(0)),
    [sortedRoomies]
  );

  useEffect(() => {
    firstHeight.setValue(0);
    secondHeight.setValue(0);
    thirdHeight.setValue(0);
    cardOpacities.forEach(opacity => opacity.setValue(0));

    Animated.timing(firstHeight, {
      toValue: Math.max(35, (first?.totalPoints / maxScore) * 180),
      duration: 800,
      useNativeDriver: false,
    }).start();

    if (second) {
      Animated.timing(secondHeight, {
        toValue: Math.max(35, (second?.totalPoints / maxScore) * 180),
        duration: 800,
        useNativeDriver: false,
      }).start();
    }

    if (third) {
      Animated.timing(thirdHeight, {
        toValue: Math.max(35, (third?.totalPoints / maxScore) * 180),
        duration: 800,
        useNativeDriver: false,
      }).start();
    }

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
  }, [first, second, third, sortedRoomies]);

  const getAvatarSource = (member) =>
    member.avatar ? { uri: member.avatar } : face1;

  const getAvatarSource = (member) =>
    member.avatar ? { uri: member.avatar } : face1;

  return (
    <ScrollView className="mt-6 px-4 bg-custom-tan flex-1">
      <View className="mt-4 mb-2 items-center">
        <Text className="text-custom-pink-200 text-5xl font-bold mt-6 font-spaceGrotesk text-center">leaderboard</Text>
      </View>

      <View className="relative bg-custom-pink-200 rounded-3xl mb-4">
        <TouchableOpacity onPress={() => setShowInfo(true)} style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
          <Image source={questionIcon} className="w-6 h-6" />
        </TouchableOpacity>

        {showInfo && (
          <View className="absolute top-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-5 pt-4 pb-5 w-[340px] border-2 border-custom-pink-200 z-50 shadow-md">
            <Text className="text-custom-pink-200 text-xl font-bold mb-2">ways to earn points:</Text>
            <Text className="text-custom-blue-100 text-3xl font-bold mt-2 mb-1 text-center">+1</Text>
            <Text className="text-custom-blue-100 text-1xl mb-3 text-center">every day for opening the roomies app!</Text>
            <Text className="text-custom-blue-100 text-3xl font-bold mt-4 mb-1 text-center">up to +20</Text>
            <Text className="text-custom-blue-100 text-1xl text-center">for finishing a task!</Text>
            <TouchableOpacity onPress={() => setShowInfo(false)} className="absolute top-3 right-4">
              <Text className="text-lg font-bold text-gray-500">✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="relative w-full h-[270px] flex items-center justify-end mt-6">
          {second && (
            <View className="absolute items-center bottom-0" style={{ left: 37 }}>
              <Animated.View className="absolute bottom-0 w-[102px] rounded-t-lg shadow-md" style={{ height: secondHeight, backgroundColor: "#f6b8a0" }} />
              <View style={{ transform: [{ translateY: -Math.max(0, (second.totalPoints / maxScore) * 120 - 40) }] }}>
                <Text className="text-custom-tan text-3xl font-bold font-spaceGrotesk text-center">2</Text>
                <View className="w-20 h-20 rounded-full bg-custom-tan items-center justify-center shadow-sm">
                  <Image source={getAvatarSource(second)} className="w-[74px] h-[74px]" />
                </View>
                <Text className="text-custom-tan text-2xl mt-1 font-bold text-center">{second.firstName}</Text>
                <Text className="text-custom-tan text-m font-spaceGrotesk text-center">{second.totalPoints}</Text>
              </View>
            </View>
          )}

          {first && (
            <View className="absolute items-center bottom-0">
              <Animated.View className="absolute bottom-0 w-[110px] rounded-t-lg shadow-md" style={{ height: firstHeight, backgroundColor: "#fac9b3" }} />
              <View style={{ transform: [{ translateY: -Math.max(0, (first.totalPoints / maxScore) * 120 - 25) }] }}>
                <Text className="text-custom-tan text-3xl font-bold font-spaceGrotesk text-center mb-5">1</Text>
                <View className="w-24 h-24 rounded-full bg-custom-tan items-center justify-center">
                  <Image source={getAvatarSource(first)} className="w-[74px] h-[74px] shadow-sm" />
                  <Image source={crown} className="absolute w-[59px] h-[59px] pt-[5px]" style={{ top: -36, right: -10, transform: [{ rotate: "5deg" }] }} />
                </View>
                <Text className="text-custom-tan text-2xl mt-1 font-bold font-spaceGrotesk text-center">{first.firstName}</Text>
                <Text className="text-custom-tan text-m font-spaceGrotesk text-center">{first.totalPoints}</Text>
              </View>
            </View>
          )}

          {third && (
            <View className="absolute items-center bottom-0" style={{ right: 37 }}>
              <Animated.View className="absolute bottom-0 w-[102px] rounded-t-lg shadow-md" style={{ height: thirdHeight, backgroundColor: "#f6b8a0" }} />
              <View style={{ transform: [{ translateY: -Math.max(0, (third.totalPoints / maxScore) * 120 - 40) }] }}>
                <Text className="text-custom-tan text-3xl font-bold font-spaceGrotesk text-center">3</Text>
                <View className="w-20 h-20 rounded-full bg-custom-tan items-center justify-center shadow-sm">
                  <Image source={getAvatarSource(third)} className="w-[74px] h-[74px]" />
                </View>
                <Text className="text-custom-tan text-2xl mt-1 font-bold text-center">{third.firstName}</Text>
                <Text className="text-custom-tan text-m font-spaceGrotesk text-center">{third.totalPoints}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View className="items-center w-full">
        <View className="mt-2 w-[100%] max-w-[320px]">
          {sortedRoomies.map((roomie, index) => (
            <Animated.View
              key={roomie.uid ? `${roomie.uid}-${index}` : index}
              className="flex-row items-center mb-4"
              style={{ opacity: cardOpacities[index] }}
            >
              <Text className="text-4xl text-custom-blue-100 font-bold font-spaceGrotesk mr-5 text-center" style={{ width: 40 }}>{index + 1}</Text>
              <TouchableOpacity
                className="bg-custom-blue-100 p-4 rounded-2xl flex-row items-center justify-between shadow-sm"
                style={{ flex: 1, height: 70 }}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full items-center justify-center mr-2 bg-custom-tan">
                    <Image source={getAvatarSource(roomie)} className="w-12 h-12" />
                  </View>
                  <Text className="text-2xl font-bold text-custom-tan font-spaceGrotesk">{roomie.firstName}</Text>
                </View>
                <Text className="text-2xl text-custom-tan font-spaceGrotesk">{roomie.totalPoints}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default LeaderBoardScreen;