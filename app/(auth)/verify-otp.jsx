import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HelperText, TextInput } from "react-native-paper";
import CustomBtn from "../../components/CustomBtn";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import axios from "axios";
import AlertBox from "../../components/AlertBox";

const VerifyOtp = () => {
  const [OTP, setOTP] = useState("");
  const { email } = useLocalSearchParams();
  const emailSplit = email.split("@");
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // console.log(emailSplit);

  const { IsLoading, setIsLoading, visible, showDialog, hideDialog } =
    useLoadingAndDialog();

  const handleOTPChange = (otp) => {
    setOTP(otp);
  };

  const verifyOTP = async (otp) => {
    console.log(otp);
    const res = await axios.post(`${apiUrl}/api/v/auth/verifyotp`, {
      email: email,
      verificationCode: otp,
    });
    return res.data;
  };

  const handleNextPress = async () => {
    setIsLoading(true);
    const res = await verifyOTP(OTP);
    console.log(res);
    if (res.success) {
      router.push({
        pathname: "/sign-up",
        params: { email: email },
      });
    } else {
      showDialog();
    }
    setIsLoading(false);
  };

  const hideAlert = () => {
    hideDialog();
    router.replace("/sign-in");
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
          <Text className="font-pregular text-center text-lg">
            {`An OTP has been sent to your email address: ${email[0]}***@${emailSplit[1]}`}
          </Text>
          <TextInput
            mode="outlined"
            label="  OTP"
            placeholder="Enter OTP"
            placeholderTextColor="#6d6d6d"
            value={OTP}
            onChangeText={handleOTPChange}
            keyboardType="numeric"
            activeOutlineColor="#95AEFE"
            outlineColor="#6d6d6d"
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="email" color="#6d6d6d" />}
          />
          {/* <HelperText
            type="error"
            visible={!IsValidEmail}
            padding="normal"
            style={{ paddingVertical: 0, paddingLeft: 25 }}
          >
            invalid OTP
          </HelperText> */}
        </View>

        <View className="w-5/6 mt-5 justify-center">
          <CustomBtn
            title="Next"
            iconName="chevron-double-right"
            handlePress={handleNextPress}
            // loading={IsLoading}
          />
          <View className="mt-5 justify-center items-center">
            <Text className="text-black text-base">
              Already have an account?{" "}
              {/* <Link href="/sign-in" className="text-secondary-300">
                Sign In
              </Link> */}
            </Text>
          </View>
        </View>
        <AlertBox
          visible={visible}
          hideDialog={hideAlert}
          content="Entered OTP is wrong"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyOtp;
