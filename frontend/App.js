import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TaskScreen from './screens/TaskScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import "./global.css";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const TaskStack = createNativeStackNavigator();
const LeaderboardStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

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
        <LeaderboardStack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <LeaderboardStack.Screen name="Settings" component={SettingsScreen} />
      </LeaderboardStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      </ProfileStack.Navigator>
  );
}

function App() {
  return (
        <NavigationContainer>
            <Tab.Navigator>
            <Tab.Screen name="HomePage" component={HomeStackScreen} />
            <Tab.Screen name="TaskPage" component={TaskStackScreen} />
            <Tab.Screen name="LeaderboardPage" component={LeaderboardStackScreen} />
            <Tab.Screen name="ProfilePage" component={ProfileStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
  );
}

export default App;
