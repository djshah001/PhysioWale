import { Stack } from "expo-router";
import React from "react";

const AppointmentsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="book"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="failure"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="my-appointments"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
};

export default AppointmentsLayout;
