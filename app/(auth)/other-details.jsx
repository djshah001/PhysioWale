import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import DatePicker from "../../components/ReUsables/DatePicker";
import CustomDropDown from "../../components/ReUsables/CustomDropDown";
import CustomInput from "./../../components/ReUsables/CustomInput.jsx";
import { router } from "expo-router";
import CustomBtn from "../../components/CustomBtn.jsx";

const OtherDetails = () => {
  const endYear = new Date().getFullYear();

  const OPTIONS = [
    { label: "Male", value: "male", icon: "mars" },
    { label: "Female", value: "female", icon: "venus" },
    { label: "Others", value: "others", icon: "circle-exclamation" },
  ];

  const [form, setForm] = useState({
    gender: "",
    DOB: "",
    weight: "",
    height: "",
  });

  const handleNextPress = () => {
    console.log("Form Data:", form);
    // router.push("/sign-up");
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <SafeAreaView className="bg-white-300">
      <ScrollView
        className="px-4"
        contentContainerStyle={{
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <View className="px-4 w-full h-screen justify-evenly">
          <View>
            <Text className="font-pbold text-2xl text-center">
              Let’s complete your profile
            </Text>
            <Text className="font-pextrathin text-center text-md">
              It will help us to know more about you!
            </Text>
          </View>

          <View className="w-full gap-2">
            <CustomDropDown
              label="Select Gender"
              data={OPTIONS}
              value={form.gender}
              onSelect={(value) => handleChange("gender", value)}
            />

            <DatePicker
              date={form.DOB}
              setDate={(date) => handleChange("DOB", date)}
              endYear={endYear}
            />

            <CustomInput
              label="Weight"
              placeholder="Weight"
              value={form.weight}
              leftIcon="weight"
              rightIcon="weight-kilogram"
              handleChange={(value) => handleChange("weight", value)}
            />

            <CustomInput
              label="Height"
              placeholder="Height in centimeters"
              value={form.height}
              leftIcon="human-male-height"
              handleChange={(value) => handleChange("height", value)}
            />

            <CustomBtn
              title="Next"
              iconName=""
              handlePress={handleNextPress}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtherDetails;
