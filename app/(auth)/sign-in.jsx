import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";

import axios from "axios";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSignInState, useUserDataState } from "../../atoms/store";

import FormField from "../../components/FormField";
import CustomBtn from "../../components/CustomBtn";

import { icons, images } from "../../constants";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [data, setdata] = useSignInState();
  const [UserData, setUserData] = useUserDataState();

  const handleSignIn = async () => {
    console.log("hi");
    const res = await axios.post(
      "http://192.168.0.110:3001/api/v/auth/signin",
      form
    );
    console.log(res.data);
    if (res.data.success) {
      setdata(res.data.authToken);
      await AsyncStorage.setItem("authToken", res.data.authToken);
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));

      router.replace("/home");
    }
  };

  return (
    <SafeAreaView className="bg-[#f5f5f5] h-full ">
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          // height: "100%",
        }}
      >
        {/* <View className=" w-full justify-center items-center px-4  "> */}
        <View className="w-full flex-1 justify-center items-center ">
          <Image
            source={images.signIn}
            resizeMode="contain"
            className="w-full h-[50vh] mb-2"
          />
          {/* <Text className=" font-psemibold text-3xl mb-1 text-center ">Hey There,</Text> */}
          <Text className=" font-psemibold text-3xl text-center ">Log In </Text>
        </View>
        <View className='flex-auto w-[90%] justify-center items-center '>
          <FormField
            title="Email"
            value={form.email}
            image={icons.email}
            handleChange={(e) => {
              setForm({ ...form, email: e });
            }}
            otherStyles="mt-7"
            placeholder="Email"
            keyboardType="email-address"
          />

          <FormField
            title="password"
            value={form.password}
            image={icons.lock}
            handleChange={(e) => {
              setForm({ ...form, password: e });
            }}
            otherStyles="mt-6"
            placeholder="Password"
          />

          <CustomBtn
            title="Sign-In"
            customStyles="mt-5 justify-center items-center w-full "
            textStyles="text-white font-pbold"
            iconName="angle-right"
            iconSize={28}
            iconColor="white"
            // image={icons.rightWhite}
            // imageStyles="w-5 h-5 ml-2"
            handlePress={() => {
              // router.push("/home");
              handleSignIn();
            }}
          />

          <View className="mt-5 justify-center items-center w-full">
            <Text className="text-black text-base">
              New to ProjectP ?{" "}
              <Link href="/sign-up" className="text-secondary-300">
                {" "}
                Sign UP{" "}
              </Link>
            </Text>
          </View>
        </View>
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
