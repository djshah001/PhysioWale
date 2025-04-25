import { Stack } from "expo-router";
import React from "react";
import { defaultScreenOptions } from "../../constants/navigationConfig";
import colors from "../../constants/colors";

const AppointmentsLayout = () => {
  return (
    <Stack
      screenOptions={{
        ...defaultScreenOptions,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.white[300] },
      }}
    >
      <Stack.Screen
        name="book"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="failure"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="my-appointments"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="reschedule"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
};

export default AppointmentsLayout;
