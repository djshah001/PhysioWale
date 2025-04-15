import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import colors from "../../constants/colors";
import { router } from "expo-router";
import CustomBtn from "../CustomBtn";

const EmptyAppointments = () => {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <IconButton
        icon="calendar-blank"
        size={60}
        iconColor={colors.secondary[200]}
      />
      <Text className="font-pbold text-xl text-black-400 text-center mt-2">
        No Appointments Found
      </Text>
      <Text className="font-osregular text-md text-black-300 text-center mt-2 mb-6">
        You don't have any appointments scheduled. Book an appointment with a clinic to get started.
      </Text>
      <CustomBtn
        title="Find Clinics"
        iconName="magnify"
        useGradient
        className="rounded-xl"
        handlePress={() => router.push("/home")}
      />
    </View>
  );
};

export default EmptyAppointments;
