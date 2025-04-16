import { Stack } from "expo-router";
import React from "react";
import { defaultScreenOptions } from "../../constants/navigationConfig";

const AppointmentsLayout = () => {
  return (
    <Stack
      screenOptions={{
        ...defaultScreenOptions,
        gestureEnabled: true,
        gestureDirection: "horizontal",
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
      <Stack.Screen
        name="history"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="reschedule"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
};

export default AppointmentsLayout;
