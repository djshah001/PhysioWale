import AlertBox from "../../components/AlertBox";
import CustomBtn from "../../components/CustomBtn";
import SignInForm from "../../components/SignInForm";
import OTPSignIn from "../../components/OTPSignIn";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import axios from "axios";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { SegmentedButtons } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSignInState, useUserDataState } from "../../atoms/store";

import { images } from "../../constants";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [data, setdata] = useSignInState();
  const [UserData, setUserData] = useUserDataState();

  /* -------------------------------------------------------------------------- */
  /*                            Loadin and alert box states                     */
  /* -------------------------------------------------------------------------- */

  const {
    IsLoading,
    setIsLoading,
    visible,
    showDialog,
    hideDialog,
    Error,
    setError,
  } = useLoadingAndDialog();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL; //API URL

  /* -------------------------------------------------------------------------- */
  /*                              sign in function                              */
  /* -------------------------------------------------------------------------- */

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/v/auth/signin`, form);
      console.log(res.data);
      if (res.data.success) {
        setdata(res.data.authToken);
        await AsyncStorage.setItem("authToken", res.data.authToken);

        // const result = await axios.post(
        //   `${apiUrl}/api/v/auth/getloggedinuser`,
        //   {},
        //   { headers: { authToken: res.data.authToken } }
        // );

        // console.log(result);
        // if (result.data.success) {
        //   setUserData(result.data.user);
        // }

        await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));

        router.replace("/home");
      } else {
        setError(res.data.errors[0].msg);
        // req.data.errors);
        showDialog();
      }
    } catch (error) {
      showDialog();
    }
    setIsLoading(false);
  };

  console.log(apiUrl);

  /* -------------------------------------------------------------------------- */
  /*                               for Number otp                               */
  /* -------------------------------------------------------------------------- */

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

  /* -------------------------------------------------------------------------- */
  /*                         switch between two methods                         */
  /* -------------------------------------------------------------------------- */

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
          <CustomBtn
            title="Sign In"
            iconName="login"
            handlePress={handleSignIn}
            loading={IsLoading}
          />

          <View className="mt-5 justify-center items-center w-full">
            <Text className="text-black text-base">
              New to ProjectP ?{" "}
              <Link href="/send-otp" className="text-secondary-300">
                {" "}
                Sign UP{" "}
              </Link>
            </Text>
          </View>
        </View>

        <AlertBox visible={visible} hideDialog={hideDialog} content={Error} />
        <StatusBar barStyle="default" />

        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
