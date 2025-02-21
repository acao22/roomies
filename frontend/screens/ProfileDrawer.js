// ProfileDrawer.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "./ProfileScreen";
import SettingsScreen from "./SettingsScreen";
import CalendarScreen from "./CalendarScreen";

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
        options={{ title: "Profile" }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      {/* will move this later*/}
      <Drawer.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: "Calendar" }}
      />

      {/* might add more here later */}
    </Drawer.Navigator>
  );
}
