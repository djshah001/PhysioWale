import React from "react";
import { View, Text, Image } from "react-native";

import { Tabs, Redirect } from "expo-router";

import { icons } from "../../constants";
import Ionicons from "@expo/vector-icons/Ionicons";

const TabIcon = ({ iconName, color, name, focused }) => {
  console.log(focused);
  return (
    <View className={`items-center justify-center w-12 h-12 rounded-lg mb-2 `}>
      <Ionicons
        name={iconName}
        size={24}
        color={`${focused ? "#000" : "#8a939f"}`}
      />
      <Text className={`text-[12px] text-${focused ? "#000" : "gray-400"}`}>{name}</Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "#cdcde0",
          tabBarActiveTintColor: "#92A3FD",
          tabBarStyle: {
            backgroundColor: "#F7F8F8",
            // borderTopColor:'#000',
            // borderTopRightRadius: 20,
            // borderTopLeftRadius: 20,
            // borderTopWidth: 2,
            paddingVertical: 10,
            height: 68,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return (
                <TabIcon
                  iconName="home-outline"
                  color={color}
                  name="Home"
                  focused={focused}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          name="workouts"
          options={{
            title: "Workout",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return (
                <TabIcon
                  iconName="barbell-outline"
                  color={color}
                  name="Workout"
                  focused={focused}
                />
              );
            },
          }}
        />

        {/* <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return (
                <TabIcon
                  icon={icons.bookmark}
                  color={color}
                  name="Bookmark"
                  focused={focused}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return (
                <TabIcon
                  icon={icons.plus}
                  color={color}
                  name="Create"
                  focused={focused}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return (
                <TabIcon
                  icon={icons.profile}
                  color={color}
                  name="Profile"
                  focused={focused}
                />
              );
            },
          }}
        /> */}
      </Tabs>
    </>
  );
};

export default TabsLayout;
