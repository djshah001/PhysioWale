import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { cssInterop } from "nativewind";
import { MotiView } from "moti";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../constants/colors";
import CustomBtn from "../../components/CustomBtn";
import { StatusBar } from "expo-status-bar";

cssInterop(Appbar, { className: "style" });
cssInterop(MotiView, { className: "style" });

const AppointmentSuccessScreen = () => {
  const params = useLocalSearchParams();
  const { appointmentId, clinicName, doctorName, date, time } = params;

  return (
    <SafeAreaView className="flex-1 bg-white-100">
      <Appbar.Header
        className="bg-transparent"
        statusBarHeight={0}
        mode="center-aligned"
      >
        <Appbar.Content
          title="Appointment Booked"
          titleStyle={{
            fontFamily: "OpenSans-Bold",
            fontSize: 20,
            color: colors.blueishGreen?.[400] || colors.secondary[400],
          }}
        />
      </Appbar.Header>

      <ScrollView className="flex-1 px-4">
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 500 }}
          className="items-center justify-center py-8"
        >
          <View className="w-24 h-24 rounded-full bg-secondary-100 items-center justify-center mb-6">
            <MaterialCommunityIcons
              name="check-circle"
              size={64}
              color={colors.secondary[400]}
            />
          </View>

          <Text className="font-pbold text-2xl text-black-800 mb-2 text-center">
            Appointment Confirmed!
          </Text>

          <Text className="font-osregular text-md text-black-500 mb-8 text-center">
            Your appointment has been successfully booked.
          </Text>

          <View className="bg-white-300 rounded-xl p-6 shadow-md w-full mb-6 border border-secondary-100/20">
            <View className="mb-4">
              <Text className="font-osregular text-sm text-black-500">
                Clinic
              </Text>
              <Text className="font-ossemibold text-lg text-black-800">
                {clinicName}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="font-osregular text-sm text-black-500">
                Doctor
              </Text>
              <Text className="font-ossemibold text-lg text-black-800">
                Dr. {doctorName}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="font-osregular text-sm text-black-500">
                Date
              </Text>
              <Text className="font-ossemibold text-lg text-black-800">
                {date}
              </Text>
            </View>

            <View>
              <Text className="font-osregular text-sm text-black-500">
                Time
              </Text>
              <Text className="font-ossemibold text-lg text-black-800">
                {time}
              </Text>
            </View>
          </View>

          <Text className="font-osregular text-sm text-black-500 mb-4 text-center">
            Appointment ID: {appointmentId}
          </Text>
        </MotiView>
      </ScrollView>

      <View className="px-4 py-3 border-t border-white-200 bg-white-100">
        <CustomBtn
          useGradient
          title="View My Appointments"
          iconName="calendar-check"
          className="rounded-xl mb-3"
          handlePress={() => router.push("/appointments/my-appointments")}
        />

        <CustomBtn
          title="Back to Home"
          iconName="home"
          className="rounded-xl"
          variant="outline"
          handlePress={() => router.push("/")}
        />
      </View>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default AppointmentSuccessScreen;
