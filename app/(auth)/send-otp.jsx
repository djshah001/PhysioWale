import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HelperText, TextInput } from "react-native-paper";
import CustomBtn from "../../components/CustomBtn";
import { Link, router } from "expo-router";
import axios from "axios";
import AlertBox from "../../components/AlertBox";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";

const SendOtp = () => {
  const [Email, setEmail] = useState("");
  const [IsValidEmail, setIsValidEmail] = useState(true);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const { IsLoading, setIsLoading, visible, showDialog, hideDialog } =
    useLoadingAndDialog();

  const handleEmailChange = (email) => {
    setEmail(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  const sendEmail = async (email) => {
    const res = await axios.post(`${apiUrl}/api/v/auth/sendemail`, {
      email: email,
    });
    return res.data;
  };

  const handleNextPress = async () => {
    setIsLoading(true);
    if (IsValidEmail) {
      const res = await sendEmail(Email);
      console.log(res);
      if (res.success) {
      router.push({
        pathname: "/verify-otp",
        params: { email: Email },
      });
      } else {
        showDialog();
      }
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="bg-white-300">
      <ScrollView
        contentContainerStyle={{
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "100%",
        }}
      >
        <View>
          <Text className="font-pregular text-center text-xl">
            New To PhysioWale ?,
          </Text>
          <Text className="font-osbold text-2xl text-center">
            Create An Account
          </Text>
        </View>

        <View className="w-5/6 justify-center gap-2">
          <TextInput
            mode="outlined"
            label="  Email"
            placeholder="Enter Your Email Address"
            placeholderTextColor="#6d6d6d"
            value={Email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            activeOutlineColor="#95AEFE"
            outlineColor="#6d6d6d"
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="email" color="#6d6d6d" />}
          />
          <HelperText
            type="error"
            visible={!IsValidEmail}
            padding="normal"
            style={{ paddingVertical: 0, paddingLeft: 25 }}
          >
            invalid email
          </HelperText>
        </View>

        <View className="w-5/6 mt-5 justify-center">
          <CustomBtn
            title="Next"
            iconName="chevron-double-right"
            handlePress={handleNextPress}
            disabled={IsLoading}
          />
          <View className="mt-5 justify-center items-center">
            <Text className="text-black text-base">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-secondary-300">
                Sign In
              </Link>
            </Text>
          </View>
          <AlertBox
            visible={visible}
            hideDialog={hideDialog}
            content="Invalid Email or Password"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendOtp;
