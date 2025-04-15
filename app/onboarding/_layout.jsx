import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const OnBoardingLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default OnBoardingLayout;
