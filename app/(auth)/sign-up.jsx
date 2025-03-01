import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import FormField from "../../components/FormField";
import CustomBtn from "../../components/CustomBtn";
import { Link, router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useSignInState, useUserDataState } from "../../atoms/store";
import { HelperText, TextInput } from "react-native-paper";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import AlertBox from "../../components/AlertBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../components/ReUsables/CustomInput";
import CustomDropDown from "../../components/ReUsables/CustomDropDown";
import DatePicker from "../../components/ReUsables/DatePicker";

const SignUp = () => {
  const [userData, setUserData] = useUserDataState();

  const endYear = new Date().getFullYear();

  const OPTIONS = [
    { label: "Male", value: "male", icon: "mars" },
    { label: "Female", value: "female", icon: "venus" },
    { label: "Others", value: "others", icon: "circle-exclamation" },
  ];

  const [form, setForm] = useState({
    ...userData,
    gender: "",
    DOB: "",
    weight: "",
    height: "",
    number: "",
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

  const {
    IsLoading,
    Error,
    setError,
    setIsLoading,
    visible,
    showDialog,
    hideDialog,
  } = useLoadingAndDialog();

  // const [data, setdata] = useSignInState();
  // console.log(data);

  const [date, setDate] = useState("");

  const apiUrl = process.env.EXPO_PUBLIC_API_URL; //API URL

  // console.log(date.toLocaleDateString());

  const handleSignUp = async () => {
    console.log(form);
    setIsLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/v/auth/signup`, {
        ...form,
        DOB: date,
      });
      console.log(res.data);
      if (res.data.success) {
        await AsyncStorage.setItem("isProfileComplete", JSON.stringify(false));
        router.replace("sign-in");
      } else {
        setError(res.data.errors[0].msg);
        showDialog();
      }
    } catch (error) {
      showDialog();
    }

    setIsLoading(false);
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
              label="  Select Gender"
              data={OPTIONS}
              value={form.gender}
              onSelect={(value) => handleChange("gender", value)}
            />

            <DatePicker date={date} setDate={setDate} endYear={endYear} />

            <CustomInput
              label="  Weight"
              placeholder="Weight"
              value={form.weight}
              leftIcon="weight"
              rightIcon="weight-kilogram"
              handleChange={(value) => handleChange("weight", value)}
            />

            <CustomInput
              label="  Height"
              placeholder="Height in centimeters"
              value={form.height}
              leftIcon="human-male-height"
              handleChange={(value) => handleChange("height", value)}
            />

            <CustomInput
              label="  Mobile"
              placeholder="Mobiles"
              value={form.number}
              leftIcon="cellphone"
              handleChange={(value) => handleChange("number", value)}
            />

          </View>
            <CustomBtn
              title="Sign-Up"
              iconName="account-plus"
              handlePress={handleSignUp}
              loading={IsLoading}
            />
        </View>
        <AlertBox visible={visible} hideDialog={hideDialog} content={Error} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
