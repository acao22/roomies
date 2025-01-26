import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TaskScreen from './screens/TaskScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const TaskStack = createNativeStackNavigator();
const LeaderboardStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
      <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={HomeScreen} />
      </HomeStack.Navigator>
  );
}

function TaskStackScreen() {
  return (
      <TaskStack.Navigator>
        <TaskStack.Screen name="Task" component={TaskScreen} />
      </TaskStack.Navigator>
  );
}

function LeaderboardStackScreen() {
  return (
      <LeaderboardStack.Navigator>
        <LeaderboardStack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <LeaderboardStack.Screen name="Settings" component={SettingsScreen} />
      </LeaderboardStack.Navigator>
  );
}

function App() {
  return (
        <NavigationContainer>
            <Tab.Navigator>
            <Tab.Screen name="HomeNav" component={HomeStackScreen} />
            <Tab.Screen name="TaskNav" component={TaskStackScreen} />
            <Tab.Screen name="LeaderboardNav" component={LeaderboardStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
  );
}

export default App;