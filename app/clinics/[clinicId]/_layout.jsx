import { Stack } from "expo-router";
import React from "react";
import colors from "../../../constants/colors";

const ClinicIdLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.white[300] },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="reviews"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
};

export default ClinicIdLayout;
