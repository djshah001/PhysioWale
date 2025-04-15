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

const AppointmentFailureScreen = () => {
  const params = useLocalSearchParams();
  const { message } = params;

  return (
    <SafeAreaView className="flex-1 bg-white-100">
      <Appbar.Header
        className="bg-transparent"
        statusBarHeight={0}
        mode="center-aligned"
      >
        <Appbar.Content
          title="Booking Failed"
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
          <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center mb-6">
            <MaterialCommunityIcons
              name="close-circle"
              size={64}
              color="#EF4444"
            />
          </View>
          
          <Text className="font-pbold text-2xl text-black-400 mb-2 text-center">
            Booking Failed
          </Text>
          
          <Text className="font-osregular text-md text-black-300 mb-8 text-center">
            {message || "There was an error booking your appointment."}
          </Text>

          <View className="bg-white-300 rounded-xl p-6 shadow-md w-full mb-6 border border-red-100/20">
            <Text className="font-osregular text-md text-black-300 text-center">
              Please try again or select a different time slot.
            </Text>
          </View>
        </MotiView>
      </ScrollView>

      <View className="px-4 py-3 border-t border-white-200 bg-white-100">
        <CustomBtn
          useGradient
          title="Try Again"
          iconName="refresh"
          className="rounded-xl mb-3"
          handlePress={() => router.back()}
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

export default AppointmentFailureScreen;