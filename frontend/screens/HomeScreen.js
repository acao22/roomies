import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const MEMBERS = [
  { id: 1, avatar: require("../images/avatar1.png") },
  { id: 2, avatar: require("../images/avatar2.png") },
  { id: 3, avatar: require("../images/avatar3.png") },
  { id: 4, avatar: require("../images/avatar4.png") },
  { id: 5, avatar: require("../images/avatar1.png") },
  { id: 6, avatar: require("../images/avatar2.png") },
  { id: 7, avatar: require("../images/avatar3.png") },
  { id: 8, avatar: require("../images/avatar4.png") },
];

// export default function GroupScreen() {
//   return (
//     <SafeAreaView className="flex-1 bg-[#F5A58C]">
//       {/* Peach background section with group images and text */}
//       <View className="items-center pt-6">
//         {/* Wrapper to position center icon + 4 avatars */}
//         <View className="relative w-44 h-44 items-center justify-center">
//           {/* 4 avatars */}
//           <Image
//             source={require("../images/avatar1.png")}
//             className="absolute w-10 h-10 rounded-full -top-2 left-2"
//           />
//           <Image
//             source={require("../images/avatar2.png")}
//             className="absolute w-10 h-10 rounded-full -top-2 right-2"
//           />
//           <Image
//             source={require("../images/avatar3.png")}
//             className="absolute w-10 h-10 rounded-full -bottom-2 left-2"
//           />
//           <Image
//             source={require("../images/avatar4.png")}
//             className="absolute w-10 h-10 rounded-full -bottom-2 right-2"
//           />

//           {/* Center circle with icon */}
//           <View className="w-20 h-20 bg-white rounded-full items-center justify-center">
//             <Image
//               source={require("../images/avatar1.png")}
//               className="w-8 h-8"
//             />
//           </View>
//         </View>

//         {/* Group name and edit group text */}
//         <Text className="mt-4 text-5xl text-[#FEF9E5] font-bold">
//           group name
//         </Text>
//         <Text className="mb-2 text-base text-lg text-[#FEF9E5]">
//           edit group
//         </Text>
//       </View>

//       {/* Cream background area */}
//       <View className="flex-1 bg-[#FFFCE8] px-4 pt-4">
//         <Text className="m-4 font-bold text-4xl text-[#788ABF]">my feed</Text>
//         {/* ... rest of your feed layout ... */}
//       </View>
//     </SafeAreaView>
//   );
// }

export default function GroupScreen() {
  // Radius controls how far the avatars appear from the center icon.
  const RADIUS = 110;

  return (
    <SafeAreaView className="flex-1 bg-[#F5A58C]">
      {/* -- top section w/ group info -- */}
      <View className="items-center pt-6">
        {/* top container for the center icon + ring of avatars
         */}
        <View className="relative w-80 h-80 items-center justify-center">
          {MEMBERS.map((member, index) => {
            // Angle for each member in the circle (in radians).
            const angle = (2 * Math.PI * index) / MEMBERS.length;

            // X/Y offsets to "push" each avatar onto a circle around center.
            const x = RADIUS * Math.cos(angle);
            const y = RADIUS * Math.sin(angle);

            return (
              <View
                key={member.id}
                // absolute positioning + transform for ring placement
                className="absolute"
                style={{ transform: [{ translateX: x }, { translateY: y }] }}
              >
                {/* 
                  Semi‐transparent circle behind the avatar
                  (e.g. 60% opacity white).
                */}
                <View className="bg-[rgba(255,255,255,0.6)] w-18 h-18 rounded-full items-center justify-center">
                  <Image
                    source={member.avatar}
                    className="w-20 h-20 rounded-full"
                  />
                </View>
              </View>
            );
          })}

          {/* Center circle with “group icon” or placeholder */}
          <View className="w-30 h-30 bg-white rounded-full items-center justify-center">
            <Image
              source={require("../images/image-icon.png")}
              className="p-8 w-30 h-30"
            />
          </View>
        </View>

        {/* Group name / edit group text */}
        <Text className="text-5xl text-[#FEF9E5] font-bold">group name</Text>
        <Text className="mb-2 text-base text-lg text-[#FEF9E5]">
          edit group
        </Text>
      </View>

      {/* -- Main feed area -- */}
      <View className="flex-1 bg-[#FFFCE8] px-4 pt-4">
        <Text className="m-4 font-bold text-4xl text-[#788ABF]">my feed</Text>
        {/* ...Your feed content... */}
      </View>
    </SafeAreaView>
  );
}
