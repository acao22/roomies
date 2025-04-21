import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import face1 from "../assets/face1.png";
import { Ionicons } from "@expo/vector-icons";
import CustomModal from "./AddGroupModal";
import { getUserInfo, getUserGroup, fetchAvatar, verifyUserSession, leaveGroupAPI, addPointsToUser } from "../api/users.api.js";
import { updateCurrentUser } from "firebase/auth";

const ProfileScreen = ({ setUser }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [avatarUri, setAvatarUri] = useState(null);
  const [roomies, setRoomies] = useState([]);
  const avatarSrc = (r) =>
    r.avatar && r.avatar.trim().length ? { uri: r.avatar } : face1;
  

  useEffect(() => {
    if (!userGroup?.members || !userData?.uid) return;
  
    (async () => {
      try {
        const withAvatars = await Promise.all(
          userGroup.members
            .filter(m => m.uid !== userData.uid)               // skip yourself
            .map(async (m) => {
              try {
                const { uri } = await fetchAvatar(m.uid);
                return { ...m, avatar: uri };
              } catch {
                return { ...m, avatar: null };
              }
            })
        );
        setRoomies(withAvatars);
      } catch (err) {
        console.error('Could not load roommates', err);
      }
    })();
  }, [userGroup, userData]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { uid } = await verifyUserSession();
        const { firstName, lastName } = await getUserInfo();
        setUserData({ firstName: firstName, lastName: lastName, uid: uid, totalPoints: 0});

        const { id, groupName, members } = await getUserGroup();
        setUserGroup({ id, groupName: groupName, members: members });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch the user's avatar URI from your API
    const loadAvatar = async () => {
      try {
        const {uid, email, message} = await verifyUserSession();
        const { uri } = await fetchAvatar(uid) || { uri: null };
        console.log(uri.uri);
        setAvatarUri(uri);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    loadAvatar();
  }, []);

  // user leaves group
  const handleLeaveGroup = async () => {
    if (!userData?.uid || !userGroup?.id) {
      Alert.alert("Error", "No group to leave.");
      return;
    }

    const userId = userData.uid;
    const groupId = userGroup.id;

    try {
      await leaveGroupAPI(userId, groupId);
      const { totalPoints } = await getUserInfo();
      await addPointsToUser(userId, -totalPoints);

      setUser(prev => ({ 
        ...prev, 
        roomieGroup: null, 
        members: [], 
        totalPoints: 0,
      }));

      Alert.alert("Left Group", "You have succesfully left the group");

      // grab the root (RootStack) navigator by calling getParent() twice:
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Group' }],
          })
        );
      }, 0);

    } catch (error) {
      console.error("Leave group failed:", error);
      Alert.alert("Error", "Failed to leave group. Try again");
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = () => {
    // Optionally, add logifc to save profile changes here
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-custom-tan">
      <ScrollView>
        <View
          className="absolute top-0 left-0 right-0 h-72 rounded-b-3xl z-0 items-center">
          <View className="items-center pt-10">
            <View className="relative">
              <View className="w-32 h-32 rounded-full bg-custom-tan items-center justify-center">
                
              <Image
                  source={
                    avatarUri &&
                    typeof avatarUri === "string" &&
                    avatarUri.trim().length > 0
                      ? { uri: avatarUri }
                      : face1
                  }
                  className="w-32 h-32"
                />
              </View>
            </View>
          </View>
          <Text className="font-spaceGrotesk text-custom-blue-200 mt-6 text-4xl font-bold">
            {" "}
            {userData
              ? `${userData.firstName} ${userData.lastName}`
              : "first last"}
          </Text>
          <TouchableOpacity onPress={() => {
            console.log("going to prev edit profile screen");
              navigation.navigate("EditProfile", {
              origin: "ProfileScreen",
            });
          }}>
            <Text className="font-spaceGrotesk underline text-custom-blue-200 text-xl mt-3">edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* roomies list */}

        <View className="mt-4 pt-72 px-6">
          
          <View className="bg-custom-yellow rounded-3xl p-6 w-full items-center justify-center">
            <Text className="font-bold font-spaceGrotesk text-custom-blue-200 text-3xl">
              {userGroup ? `${userGroup.groupName}` : "you loner roomie"}
            </Text>

          {/* roommates block  ---------------------------------------------------*/}
          {roomies.length > 0 && (
            <View className="mt-6 w-full">
              {roomies.length <= 3 ? (
                /* 1 – 3 members: lay them out with flex‑row, no scrolling */
                <View
                  className="flex-row items-center"
                  style={{
                    /* one member ‑‑> centred, two ‑‑> space‑evenly, three ‑‑> space‑between */
                    justifyContent:
                      roomies.length === 1 ? "center" :
                      roomies.length === 2 ? "space-evenly" :
                      "space-between",
                  }}
                >
                  {roomies.map((item) => (
                    <View key={item.uid} className="items-center">
                      <Image
                        source={avatarSrc(item)}
                        className="w-16 h-16 rounded-full"
                      />
                      <Text className="mt-1 text-custom-blue-200 font-spaceGrotesk">
                        {item.firstName}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                /* 4 + members: keep the sideways scroll you already had */
                <FlatList
                  data={roomies}
                  horizontal
                  keyExtractor={(item) => item.uid}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View className="items-center mr-4">
                      <Image
                        source={avatarSrc(item)}
                        className="w-16 h-16 rounded-full"
                      />
                      <Text className="mt-1 text-custom-blue-200 font-spaceGrotesk">
                        {item.firstName}
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>
          )}


            
            <TouchableOpacity onPress={handleLeaveGroup}>
              <Text className="font-spaceGrotesk text-custom-blue-100 text-xl underline left-32">
                leave group
              </Text>
            </TouchableOpacity>
          </View>

        {/* leave btn */}
          <View className="mb-6">
          </View>
        </View>
      </ScrollView>
      <CustomModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
