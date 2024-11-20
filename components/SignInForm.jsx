import React, { useState } from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

export default function SignInForm({ setForm, form }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [IsValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (email) => {
    setForm({ ...form, email });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  return (
    <View className=" w-5/6 justify-center my-4 ">
      {/* <Text className=" font-psemibold text-3xl mb-1 text-center ">Hey There,</Text> */}
      {/* <Text className=" font-psemibold text-3xl text-center ">Log In </Text> */}

      <TextInput
        mode="outlined"
        label="Email"
        placeholder="Email"
        placeholderTextColor="#6d6d6d"
        value={form.email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        activeOutlineColor="#95AEFE"
        outlineColor="#6d6d6d"
        // outlineStyle={{
        //   borderRadius: 10,
        // }}
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

      <TextInput
        mode="outlined"
        label="Password"
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
    </View>
  );
}
