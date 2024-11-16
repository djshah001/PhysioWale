import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import FormField from "../../components/FormField";
import CustomBtn from "../../components/CustomBtn";
import { Link, router } from "expo-router";
import axios from "axios";
import { useSignInState } from "../../atoms/store";

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    password: "",
  });

  const [data, setdata] = useSignInState();

  console.log(data)

  const handleSignUp = async () => {
    console.log("hi");
    const res = await axios.post(
      "http://192.168.0.110:3001/api/v/auth/signup",
      form
    );
    console.log(res.data);
  };

  return (
    <SafeAreaView className="bg-[#f5f5f5] h-full ">
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          height: "100%",
        }}
      >
        <View className="h-[85vh] w-full justify-center items-center px-4  ">
          <Text className=" font-pregular text-xl">New To ProjectP ?,</Text>
          <Text className=" font-pbold text-2xl text-center ">
            Create An Account
          </Text>

          <FormField
            title="First Name"
            value={form.firstName}
            image={icons.user}
            handleChange={(e) => {
              setForm({ ...form, firstName: e });
            }}
            otherStyles="mt-7"
            placeholder="First Name"
          />

          <FormField
            title="Last Name"
            value={form.lastName}
            image={icons.user}
            handleChange={(e) => {
              setForm({ ...form, lastName: e });
            }}
            otherStyles="mt-7"
            placeholder="Last Name"
          />
          <FormField
            title="Email"
            value={form.email}
            image={icons.email}
            handleChange={(e) => {
              setForm({ ...form, email: e });
            }}
            otherStyles="mt-7"
            placeholder="Email"
            keyBoardStyle="email-address"
          />

          <FormField
            title="Number"
            value={form.number}
            image={icons.lock}
            handleChange={(e) => {
              setForm({ ...form, number: e });
            }}
            otherStyles="mt-6"
            placeholder="Phone Number"
            keyboardType="phone-pad"
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
            title="Sign-Up"
            customStyles="mt-5 justify-center items-center w-full "
            textStyles="text-white font-pbold"
            image={icons.rightWhite}
            imageStyles="w-5 h-5 ml-2"
            handlePress={() => {
              // router.push("/sign-in");
              handleSignUp();
            }}
          />

          <View className="mt-5 justify-center items-center w-full">
            <Text className="text-black text-base ">
              Already have an account ?{" "}
              <Link href="/sign-in" className="text-secondary-300">
                {" "}
                Sign In{" "}
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
