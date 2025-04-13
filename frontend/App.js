import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";
import TaskScreen from "./screens/TaskScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LandingScreen from "./screens/LandingScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";

import {
  Platform,
  UIManager,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import "./global.css";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { verifyUserSession } from "./api/users.api.js";

// Enable layout animation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const TaskStack = createNativeStackNavigator();
const LeaderboardStack = createNativeStackNavigator();

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
    </ProfileStack.Navigator>
  );
}

function MainTabs({ setUser }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "TaskPage") {
            iconName = "checkmark-done";
          } else if (route.name === "LeaderboardPage") {
            iconName = "trophy";
          } else if (route.name === "ProfilePage") {
            iconName = "person";
          }

          return <Ionicons name={iconName} size={size + 4} color="#ffffff" />;
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#495BA2",
          position: "absolute",
          height: 51,
          paddingBottom: 5,
          paddingHorizontal: 55,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
            }}
          />
        ),
      })}
    >
      <Tab.Screen name="TaskPage" component={TaskStackScreen} />
      <Tab.Screen name="LeaderboardPage" component={LeaderboardStackScreen} />
      <Tab.Screen name="ProfilePage">
        {() => <ProfileStackScreen setUser={setUser} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    SpaceGrotesk: require("./fonts/SpaceGrotesk.ttf"),
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await verifyUserSession();
        if (session) {
          setUser(session);
        } else {
          await AsyncStorage.removeItem("idToken");
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

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="Main">
            {() => <MainTabs setUser={setUser} />}
          </RootStack.Screen>
        ) : (
          <>
            <RootStack.Screen name="Landing" component={LandingScreen} />
            <RootStack.Screen name="Signup">
              {() => <SignUpScreen setUser={setUser} />}
            </RootStack.Screen>
            <RootStack.Screen name="Login">
              {() => <LoginScreen setUser={setUser} />}
            </RootStack.Screen>
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
