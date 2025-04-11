import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
// needed for real time updates
import { collection, query, onSnapshot, where, orderBy } from "firebase/firestore";
import { getUserInfo, getUserGroup, fetchAvatar } from "../api/users.api.js";
import face1 from "../images/avatar1.png";
import { db } from "../firebaseConfig.js";


const avatars = [
  require("../images/avatar1.png"),
  require("../images/avatar2.png"),
  require("../images/avatar3.png"),
  require("../images/avatar4.png"),
];

// default images since we don't know how to upload yet
const taskImages = [
  require("../images/task1.png"),
  require("../images/task2.png"),
];

const getTaskImage = (taskId) => {
  const hash = taskId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return taskImages[hash % taskImages.length];
};

// const feedItems = [
//   {
//     id: "1",
//     userName: "Angie",
//     taskName: "trash",
//     timeAgo: "7 min ago",
//     message: "yay! i just took out the trash.",
//     image: require("../images/task1.png"),
//   },
//   {
//     id: "2",
//     userName: "Luna",
//     taskName: "recycling",
//     timeAgo: "34 min ago",
//     message: "skibidi",
//     image: require("../images/task2.png"),
//   },
//   {
//     id: "3",
//     userName: "Katherine",
//     taskName: "poop",
//     timeAgo: "24 years ago",
//     message: "i just pooped",
//     image: require("../images/task1.png"),
//   },
// ];

export default function GroupFeedScreen() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [userMap, setUsersMap] = useState({});
  const [groupName, setGroupName] = useState('your group');
  const [groupMembers, setGroupMembers] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchGroup() {
        try {
          const groupData = await getUserGroup();
          if (groupData && groupData.members) {
            const membersWithAvatars = await Promise.all(
              groupData.members.map(async (member) => {
                try {
                  const avatarData = await fetchAvatar(member.uid);
                  return { ...member, avatar: avatarData.uri };
                } catch (error) {
                  console.error(`Error fetching avatar for ${member.uid}:`, error);
                  return { ...member, avatar: null };
                }
              })
            );
            setGroupMembers(membersWithAvatars);
          }
        } catch (error) {
          console.error("Error fetching group data:", error);
        }
      }
      fetchGroup();
    }, [])
  );

  useEffect(() => {
    const tasksRef = collection(db, "task");
    const q = query(tasksRef);
    const unsubscribe = onSnapshot(q, snapshot => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    }, error => {
      console.error("Error listening to tasks:", error);
    });
    return () => unsubscribe();
  }, []);


  // find only completed ones
  const completedTasks = tasks.filter(task => task.status === "completed");


  // find users of completed tasks
  useFocusEffect(
    React.useCallback(() => {
      const fetchUsersForCompletedTasks = async () => {
        const uids = [
          ...new Set(
            tasks
              .map((task) => task.createdBy)
              .concat(tasks.map((task) => task.completedBy))
              .filter(Boolean)
          ),
        ];
        const tempUsers = {};
        for (const uid of uids) {
          try {
            // Fetch basic user info
            const userData = await getUserInfo({ uid });
            // Then fetch the user's avatar
            try {
              const avatarData = await fetchAvatar(uid);
              // Merge the avatar URI into the userData object
              tempUsers[uid] = { ...userData, avatar: avatarData.uri };
            } catch (avatarError) {
              console.error("Error fetching avatar for uid:", uid, avatarError);
              tempUsers[uid] = { ...userData, avatar: null };
            }
          } catch (error) {
            console.error("Error fetching user for uid:", uid, error);
          }
        }
        setUsersMap(tempUsers);
      };
  
      if (completedTasks.length > 0) {
        fetchUsersForCompletedTasks();
      }
    }, [completedTasks, tasks])
  );


  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        const groupData = await getUserGroup();
        setGroupName(groupData.groupName);
      } catch (error) {
        console.error('Error fetching group name:', error);
      }
    };

    fetchGroupName();
  }, []);

  const getAvatarSource = (member) =>
    member.avatar ? { uri: member.avatar } : face1;

  return (
    <View className="flex-1 bg-[#FEF9E5]">
      <ScrollView>
        <View className="bg-[#F5A58C] w-full h-48 absolute top-0 z-0" />

        {/* temp button for landing page for testing */}
        {/* <TouchableOpacity
          className="bg-[#9CABD8]  p-3 rounded-full mx-4 mt-14 absolute z-10"
          onPress={() => navigation.replace("Landing")}
        >
          <Text className="text-white font-bold text-lg">Landing Page</Text>
        </TouchableOpacity> */}

        {/* avatars row, need to fix this spacing later */}
        <View className="flex-row justify-between px-24 mt-40">
            {Object.values(groupMembers).map((user, index) => (
              <View
                key={index}
                className="rounded-full overflow-hidden h-16 w-16 bg-[#FEF9E5] shadow-md">
                <Image source={getAvatarSource(user)} className="h-16 w-16" resizeMode="cover" />
              </View>
          ))}
        </View>
        {/* group name section */}
        <View className="mt-4 items-center">
          <Text className="text-4xl font-bold text-[#788ABF]">{groupName}</Text>
          <TouchableOpacity>
            <Text className="text-sm text-[#9CABD8]">edit group</Text>
          </TouchableOpacity>
        </View>
        {/* feed list */}
        <View className="mt-6 px-4">
          {completedTasks.map((task) => {
            const user = task.completedBy ? userMap[task.completedBy] : userMap[task.createdBy] || {};
            const imageSource = task.image ? task.image : getTaskImage(task.id);
            return (

            <View
              key={task.id}
              className="bg-[#9CABD8] rounded-2xl p-4 mb-6 shadow-sm"
            >
              {/* user & task info */}
              <Text className="text-[#FEF9E5] font-bold text-lg">
                {user.firstName} completed “{task.title}”!
              </Text>

              {/* image if input */}
              <View className="mt-3 rounded-xl overflow-hidden">
                <Image
                  source={imageSource}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              </View>

              {/* msg & time */}
              <View className="flex-row items-center space-x-2 mt-3">
                <Image
                  source={getAvatarSource(user)}
                  className="h-10 w-10 rounded-full bg-gray-300"
                />
                <Text className="mx-2 text-[#FEF9E5] text-lg">
                  {task.description}
                </Text>
              </View>
              {(task.completedAt && (
                <Text className="text-[#FEF9E5] font-bold text-xs mt-1">
                {new Date(task.completedAt.seconds * 1000).toLocaleString()}
                </Text>
                
              )) || <Text className="text-[#FEF9E5] font-bold text-xs mt-1">
                {new Date(task.createdAt).toLocaleString()} </Text>}

            </View>
          );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
