import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
import CustomBtn from "../../components/CustomBtn";
import { router } from "expo-router";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import axios from "axios";
import AlertBox from "../../components/AlertBox";
import { useUserDataState, useToastSate } from "../../atoms/store";
import { apiUrl } from "../../components/Utility/Repeatables";

const VerifyOtp = () => {
  const [OTP, setOTP] = useState("");
  const [userData, setUserData] = useUserDataState();
  const emailSplit = userData.email.split("@");
  const hiddenEmail = userData.email[0] + "***@" + emailSplit[1];
  const otpRef = useRef(null);

  const [toast, setToast] = useToastSate();

  const handleOTPChange = (otp) => {
    setOTP(otp);
  };

  const verifyOTP = async (otp) => {
    console.log(otp);
    try {
      const res = await axios.post(`${apiUrl}/api/v/auth/verifyotp`, {
        phoneNumber: userData.phoneNumber,
        otp: otp,
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  };

  const {
    IsLoading,
    setIsLoading,
    Error,
    setError,
    visible,
    showDialog,
    hideDialog,
  } = useLoadingAndDialog();

  const handleNextPress = async () => {
    setIsLoading(true);
    const res = await verifyOTP(OTP);
    console.log(res);
    if (res.success) {
      router.replace({
        pathname: "/sign-up",
      });
    } else {
      setToast({
        message: res,
        visible: true,
        type: "error",
      });
    }
    setIsLoading(false);
  };

  const sendEmail = async () => {
    try {
      const res = await axios.post(`${apiUrl}/api/v/auth/sendemail`, userData);
      console.log(res.data);
      if (res.data.success) {
        setError("Email sent successfully");
        showDialog();
      } else {
        showDialog();
      }
    } catch (error) {
      console.log(error.response.data);
      showDialog();
    }
  };

  useEffect(() => {
    otpRef.current.focus();
  }, []);

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
          <Text className="font-pregular text-center text-lg">
            {`An OTP has been sent to your email address: ${hiddenEmail}`}
          </Text>
          <TextInput
            ref={otpRef}
            mode="outlined"
            label="  OTP"
            placeholder="Enter OTP"
            placeholderTextColor="#6d6d6d"
            value={OTP}
            onChangeText={handleOTPChange}
            keyboardType="decimal-pad"
            activeOutlineColor="#95AEFE"
            outlineColor="#6d6d6d"
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="email" color="#6d6d6d" />}
          />

          <View className="flex-row justify-center items-center">
            <Text className="font-pmedium">Didn't receive code?</Text>

            <Button onPress={sendEmail}>
              <Text className="text-secondary-200 leading-4 ">Resend code</Text>
            </Button>
          </View>
        </View>

        <View className="w-5/6 mt-5 justify-center">
          <CustomBtn
            title="Verify OTP"
            iconName="chevron-double-right"
            handlePress={handleNextPress}
            // loading={IsLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyOtp;
