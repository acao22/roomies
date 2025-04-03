import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  TransitionPresets,
} from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import TaskScreen from "./screens/TaskScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LandingScreen from "./screens/LandingScreen";
import AddTaskScreen from "./screens/AddTaskScreen";
import ProfileDrawer from "./screens/ProfileDrawer";
import {
  Platform,
  UIManager,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import "./global.css";
import { useFonts } from "expo-font";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PasswordScreen from "./screens/PasswordScreen";

// for verifying user, user session management
import { verifyUserSession } from "./api/users.api.js";
import GroupScreen from "./screens/GroupScreen";
import AvatarCreation from "./screens/AvatarCreation";

// for layout animation
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const TaskStack = createNativeStackNavigator();
const LeaderboardStack = createNativeStackNavigator();
const LandingStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

function TaskStackScreen() {
  return (
    <TaskStack.Navigator screenOptions={{ headerShown: false }}>
      <TaskStack.Screen name="Task" component={TaskScreen} />
    </TaskStack.Navigator>
  );
}

function LeaderboardStackScreen() {
  return (
    <LeaderboardStack.Navigator screenOptions={{ headerShown: false }}>
      <LeaderboardStack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
      />
      <LeaderboardStack.Screen name="Settings" component={SettingsScreen} />
    </LeaderboardStack.Navigator>
  );
}

function ProfileStackScreen({ setUser }) {
  const ProfileStack = createNativeStackNavigator();
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileDrawer">
        {() => <ProfileScreen setUser={setUser} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen name="AvatarCreation" component={AvatarCreation} />
      <ProfileStack.Screen name="Password" component={PasswordScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs({ user, setUser }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          // icons
          if (route.name === "HomePage") {
            iconName = "home";
          } else if (route.name === "TaskPage") {
            iconName = "checkmark-done";
          } else if (route.name === "LeaderboardPage") {
            iconName = "trophy";
          } else if (route.name === "ProfilePage") {
            iconName = "person";
          }

          return <Ionicons name={iconName} size={size + 4} color={"#ffffff"} />;
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#9CABD8",
          position: "absolute",
          height: 51,
          paddingBottom: 5,
        },
        tabBarItemStyle: {
          flex: 1, // Ensures equal space for all tabs
          alignItems: "center",
          justifyContent: "center",
          width: 65,
        },
        tabBarButton: (props) => {
          const isSelected = props.accessibilityState?.selected;
          return (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 65, // Keep width the same for all tabs
              }}
            >
              <TouchableOpacity
                {...props}
                style={{
                  alignItems: "center",
                  justifyContent: "top",
                  width: 65, // Ensure active and inactive states have the same width
                  height: isSelected ? 95 : 51, // Change height only for pop effect
                  backgroundColor: isSelected ? "#788ABF" : "transparent",
                  borderRadius: 14,
                  top: isSelected ? -10 : 0, // Moves up when active
                  paddingTop: 8,
                }}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomePage" component={HomeStackScreen} />
      <Tab.Screen name="TaskPage">
        {() => <TaskScreen user={user} />}
      </Tab.Screen>
      <Tab.Screen name="LeaderboardPage" component={LeaderboardStackScreen} />
      <Tab.Screen name="ProfilePage">
        {() => <ProfileStackScreen user={user} setUser={setUser} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function LandingScreenWrapper() {
  return <LandingScreen />;
}

function AvatarCreationWrapper() {
  return <AvatarCreation />;
}

function ProfileScreenWrapper() {
  return <ProfileScreen />;
}

function SignupScreenWrapper({ navigation }) {
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => navigation.replace("Landing")}
    >
      <SignUpScreen />
    </TouchableOpacity>
  );
}

// function LoginScreenWrapper({ navigation }) {
//   return (
//     <TouchableOpacity
//       style={{ flex: 1 }}
//       onPress={() => navigation.replace("Landing")}
//     >
//       <LoginScreen setUser={setUser} />
//     </TouchableOpacity>
//   );
// }

export default function App() {
  // for user sessions
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    SpaceGrotesk: require("./fonts/SpaceGrotesk.ttf"),
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await verifyUserSession();
        console.log("User session:", session);

        if (session?.uid && session?.roomieGroup) {
          setUser(session);
        } else {
          await AsyncStorage.removeItem("idToken"); // Clear expired token
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#788ABF" />
      </View>
    );
  }

  // return (
  //   <NavigationContainer>
  //     <RootStack.Navigator screenOptions={{ headerShown: false }}>
  //       <RootStack.Screen name="Landing" component={LandingScreenWrapper} />
  //       <RootStack.Screen name="Signup" component={SignupScreenWrapper} />
  //       <RootStack.Screen name="Login" component={LoginScreenWrapper} />
  //       <RootStack.Screen name="Main" component={MainTabs} />
  //     </RootStack.Navigator>
  //   </NavigationContainer>
  // );

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user && user.roomieGroup ? (
          <RootStack.Screen name="Main">
            {() => <MainTabs setUser={setUser} />}
          </RootStack.Screen>
        ) : (
          <>
            <RootStack.Screen
              name="Landing"
              component={LandingScreenWrapper}
              options={{
                animation: "slide_from_left",
              }}
            />
            <RootStack.Screen name="Signup">
              {() => <SignUpScreen setUser={setUser} />}
            </RootStack.Screen>
            <RootStack.Screen
              name="Group"
              options={{ animation: "slide_from_left" }}
            >
              {() => <GroupScreen setUser={setUser} />}
            </RootStack.Screen>
            <RootStack.Screen name="Login">
              {() => <LoginScreen setUser={setUser} />}
            </RootStack.Screen>
          </>
        )}
        <RootStack.Screen
          name="AvatarCreation"
          component={AvatarCreationWrapper}
        />
        <RootStack.Screen
          name="ProfileScreen"
          component={ProfileScreenWrapper}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
