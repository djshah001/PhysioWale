import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import FormField from "../../components/FormField";
import CustomBtn from "../../components/CustomBtn";
import { Link, router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useSignInState } from "../../atoms/store";
import { HelperText, TextInput } from "react-native-paper";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import AlertBox from "../../components/AlertBox";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const { email } = useLocalSearchParams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: email,
    number: "",
    password: "",
  });

  const { IsLoading, setIsLoading, visible, showDialog, hideDialog } =
    useLoadingAndDialog();

  const [data, setdata] = useSignInState();

  console.log(data);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL; //API URL

  const handleSignUp = async () => {
    setIsLoading(true);
    const res = await axios.post(`${apiUrl}/api/v/auth/signup`, form);
    if (res.data.success) {
      await AsyncStorage.setItem("isProfileComplete", JSON.stringify(false));
      router.replace("sign-in");
    } else {
      showDialog();
    }
    setIsLoading(false);
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [IsValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (email) => {
    setForm({ ...form, email });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  return (
    <SafeAreaView className="bg-white-300  ">
      <ScrollView
        contentContainerStyle={{
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "100%",
          // backgroundColor:'#010101'
        }}
      >
        <View>
          <Text className=" font-pregular text-center text-xl">
            New To PhysioWale ?,
          </Text>
          <Text className=" font-osbold text-2xl text-center ">
            Create An Account
          </Text>
        </View>

        <View className=" w-5/6 justify-center gap-2 ">
          <TextInput
            mode="outlined"
            label="  First Name"
            placeholder="First Name"
            placeholderTextColor="#6d6d6d"
            value={form.firstName}
            onChangeText={(e) => {
              setForm({ ...form, firstName: e });
            }}
            // keyboardType="email-address"
            activeOutlineColor="#95AEFE"
            outlineColor="#6d6d6d"
            // outlineStyle={{
            //   borderRadius: 10,
            // }}
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="account" color="#6d6d6d" />}
          />

          <TextInput
            mode="outlined"
            label="  Last Name"
            title="lastName"
            placeholder="Last Name"
            placeholderTextColor="#6d6d6d"
            value={form.lastName}
            onChangeText={(e) => {
              setForm({ ...form, lastName: e });
            }}
            // keyboardType="email-address"
            activeOutlineColor="#95AEFE"
            outlineColor="#6d6d6d"
            // outlineStyle={{
            //   borderRadius: 10,
            // }}
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="account" color="#6d6d6d" />}
          />

          <TextInput
            mode="outlined"
            label="  Contact"
            placeholder="Contact"
            placeholderTextColor="#6d6d6d"
            value={form.number}
            onChangeText={(e) => {
              setForm({ ...form, number: e });
            }}
            keyboardType="email-address"
            activeOutlineColor="#95AEFE"
            outlineColor="#6d6d6d"
            // outlineStyle={{
            //   borderRadius: 10,
            // }}
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="cellphone" color="#6d6d6d" />}
          />

          <TextInput
            mode="outlined"
            label=" Email"
            placeholder="Email"
            placeholderTextColor="#6d6d6d"
            value={form.email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            activeOutlineColor="#95AEFE"
            outlineColor="#6d6d6d"
            disabled
            // outlineStyle={{
            //   borderRadius: 10,
            // }}
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="email" color="#6d6d6d" />}
          />

          {/* <HelperText
            type="error"
            visible={!IsValidEmail}
            padding="normal"
            style={{ paddingVertical: 0, paddingLeft: 25 }}
          >
            invalid email
          </HelperText> */}

          <TextInput
            mode="outlined"
            label="  Password"
            placeholder="Password"
            placeholderTextColor="#6d6d6d"
            value={form.password}
            onChangeText={(e) => setForm({ ...form, password: e })}
            secureTextEntry={!passwordVisible}
            activeOutlineColor="#95AEFE"
            outlineColor="#6B7280"
            style={{
              borderRadius: 25,
              overflow: "hidden", // Ensures the border radius is respected
            }}
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="lock" color="#6d6d6d" />}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                color="#6d6d6d"
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />

          <TextInput
            mode="outlined"
            label="  Confirm Password"
            placeholder="Confirm Password"
            placeholderTextColor="#6d6d6d"
            value={form.confirmPassword}
            onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            secureTextEntry={!passwordVisible}
            activeOutlineColor="#95AEFE"
            outlineColor="#6B7280"
            style={{
              borderRadius: 25,
              overflow: "hidden", // Ensures the border radius is respected
            }}
            theme={{ roundness: 25 }}
            left={<TextInput.Icon icon="lock" color="#6d6d6d" />}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                color="#6d6d6d"
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />
        </View>

        <View className="w-5/6 mt-5 justify-center  ">
          <CustomBtn
            title="Sign-Up"
            iconName="account-plus"
            handlePress={() => {
              handleSignUp();
            }}
            loading={IsLoading}
          />

          <View className="mt-5 justify-center items-center">
            <Text className="text-black text-base ">
              Already have an account ?{" "}
              <Link href="/sign-in" className="text-secondary-300">
                {" "}
                Sign In{" "}
              </Link>
            </Text>
          </View>
          <AlertBox
            visible={visible}
            hideDialog={hideDialog}
            content="Something went wrong"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
