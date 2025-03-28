import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
// needed for real time updates
import { collection, query, onSnapshot, where, orderBy } from "firebase/firestore";
import { getUserInfo, getUserGroup } from "../api/users.api.js";
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
  const [userMap, setUsersMap] = useState([]);

  useEffect(() => {
    let unsubscribe;
    async function fetchAndSubscribe() {
      try {
        const groupData = await getUserGroup();
        const groupId = groupData.id;

        // Build a query filtering by groupId and ordering by updatedAt descending.
        const tasksRef = collection(db, "task");
        const q = query(
          tasksRef,
          where("groupId", "==", groupId),
          where("status","==", "completed"),
          orderBy("completedAt", "desc") //updatedAt isn't a field rn so just using created
        );

        unsubscribe = onSnapshot(q, snapshot => {
          const tasksData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTasks(tasksData);
        }, error => {
          console.error("Error listening to tasks:", error);
        });
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    }
    fetchAndSubscribe();
    return () => {if (unsubscribe) unsubscribe()};
  }, []);


  // find only completed ones
  const completedTasks = tasks.filter(task => task.status === "completed");


  // find users of completed tasks
  useEffect(() => {
    const fetchUsersForCompletedTasks = async () => {
      const uids = [...new Set(completedTasks.map(task => task.completedBy))];
      const tempUsers = {};
      for (const uid of uids) {
        try {
          const userData = await getUserInfo({ uid });
          tempUsers[uid] = userData;
        } catch (error) {
          console.error("Error fetching user for uid:", uid, error);
        }
      }
      setUsersMap(tempUsers);
    };

    if (completedTasks.length > 0) {
      fetchUsersForCompletedTasks();
    }
  }, [completedTasks]);




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
          {avatars.map((avatar, index) => (
            <View
              key={index}
              className="rounded-full overflow-hidden h-16 w-16 bg-[#FEF9E5] shadow-md"
            >
              <Image source={avatar} className="h-16 w-16" resizeMode="cover" />
            </View>
          ))}
        </View>
        {/* group name section */}
        <View className="mt-4 items-center">
          <Text className="text-4xl font-bold text-[#788ABF]">group name</Text>
          <TouchableOpacity>
            <Text className="text-sm text-[#9CABD8]">edit group</Text>
          </TouchableOpacity>
        </View>
        {/* feed list */}
        <View className="mt-6 px-4">
          {completedTasks.map((task) => {
            const user = userMap[task.completedBy] || {};
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
                  source={user.avatarURL ? { uri: user.avatarURL } : face1}
                  className="h-10 w-10 rounded-full bg-gray-300"
                />
                <Text className="mx-2 text-[#FEF9E5] text-lg">
                  {task.description}
                </Text>
              </View>
              {task.completedAt && (
                <Text className="text-[#FEF9E5] font-bold text-xs mt-1">
                {new Date(task.completedAt.seconds * 1000).toLocaleString()}
                </Text>
                
              )}

            </View>
          );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
