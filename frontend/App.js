import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import TaskScreen from "./screens/TaskScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LandingScreen from "./screens/LandingScreen";
import ProfileDrawer from "./screens/ProfileDrawer";
import { Platform, UIManager, TouchableOpacity, View } from "react-native";
import "./global.css";
import { useFonts } from "expo-font";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
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

function ProfileStackScreen() {
  const ProfileStack = createNativeStackNavigator();
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileDrawer" component={ProfileDrawer} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          // icons
          if (route.name === "HomePage") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "TaskPage") {
            iconName = focused ? "checkmark-done" : "checkmark-done-outline";
          } else if (route.name === "LeaderboardPage") {
            iconName = focused ? "trophy" : "trophy-outline";
          } else if (route.name === "ProfilePage") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF8C83",
        tabBarInactiveTintColor: "#748c94",
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen name="HomePage" component={HomeStackScreen} />
      <Tab.Screen name="TaskPage" component={TaskStackScreen} />
      <Tab.Screen name="LeaderboardPage" component={LeaderboardStackScreen} />
      <Tab.Screen name="ProfilePage" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}

function LandingScreenWrapper() {
  return <LandingScreen />;
}

function AvatarCreationWrapper () {
    return <AvatarCreation />
}

function ProfileScreenWrapper () {
  return <ProfileScreen />
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

function LoginScreenWrapper({ navigation }) {
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => navigation.replace("Landing")}
    >
      <LoginScreen />
    </TouchableOpacity>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk: require("./fonts/SpaceGrotesk.ttf"),
  });

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Landing" component={LandingScreenWrapper} />
        <RootStack.Screen name="Signup" component={SignupScreenWrapper} />
        <RootStack.Screen name="Login" component={LoginScreenWrapper} />
        <RootStack.Screen name="Main" component={MainTabs} />
        <RootStack.Screen name="AvatarCreation" component={AvatarCreationWrapper} />
        <RootStack.Screen name="ProfileScreen" component={ProfileScreenWrapper} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
