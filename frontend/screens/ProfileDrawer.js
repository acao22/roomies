// ProfileDrawer.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen'; 

const Drawer = createDrawerNavigator();

export default function ProfileDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Drawer.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ title: 'Your Profile' }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />

      {/* might add more here later */}
    </Drawer.Navigator>
  );
}
