import AlertBox from "../../components/AlertBox";
import CustomBtn from "../../components/CustomBtn";
import SignInForm from "../../components/SignInForm";
import OTPSignIn from "../../components/OTPSignIn";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";

import axios from "axios";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { SegmentedButtons } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSignInState, useUserDataState } from "../../atoms/store";

import { icons, images } from "../../constants";

import { CountrySelector } from "../../components/CountrySelector";
import { LinearGradient } from "expo-linear-gradient";

const SignIn = ({ withFlag = true, withCallingCode = true }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [data, setdata] = useSignInState();
  const [UserData, setUserData] = useUserDataState();

  const handleSignIn = async () => {
    console.log("hi");
    console.log(form);
    const res = await axios.post(
      "http://192.168.242.172:3001/api/v/auth/signin",
      form
    );
    console.log(res.data);
    if (res.data.success) {
      setdata(res.data.authToken);
      await AsyncStorage.setItem("authToken", res.data.authToken);
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));

      router.replace("/home");
    } else {
      showDialog();
    }
  };

  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState({ code: "+91", flag: "🇮🇳" });
  const [isValid, setIsValid] = useState(true);

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    const fullNumber = `${country.code}${text}`;
    const phoneNumberObj = parsePhoneNumberFromString(fullNumber);
    setIsValid(phoneNumberObj ? phoneNumberObj.isValid() : false);
  };

  const [showSignIn, setshowSignIn] = useState(true);

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
        </View>
        <View className="w-4/5">
          <SegmentedButtons
            value={showSignIn}
            onValueChange={setshowSignIn}
            buttons={[
              {
                value: true,
                label: "Sign In",
                checkedColor: "#fff",
                style: {
                  backgroundColor: showSignIn ? "#95AEFE" : "transparent",
                  fontWeight: "bold",
                },
              },
              {
                value: false,
                label: "OTP",
                checkedColor: "#fff",
                style: {
                  backgroundColor: !showSignIn ? "#95AEFE" : "transparent",
                },
              },
            ]}
          />
        </View>

        {showSignIn ? (
          <SignInForm setForm={setForm} form={form} />
        ) : (
          <OTPSignIn
            setShow={setShow}
            country={country}
            show={show}
            setCountry={setCountry}
            phoneNumber={phoneNumber}
            handlePhoneNumberChange={handlePhoneNumberChange}
            isValid={isValid}
          />
        )}

        <View className=" w-5/6 justify-center ">
          <CustomBtn handleSignIn={handleSignIn} />

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

        <AlertBox visible={visible} hideDialog={hideDialog} />

        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
