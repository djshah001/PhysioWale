import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBtn from "../../components/CustomBtn";
import { router, Stack } from "expo-router";
import axios from "axios";
import { useToastSate, useUserDataState } from "../../atoms/store";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import DatePicker from "../../components/ReUsables/DatePicker";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { apiUrl, blurhash } from "../../components/Utility/Repeatables";
import CustomInput from "../../components/ReUsables/CustomInput";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cssInterop } from "nativewind";
import CustomDD from "../../components/ReUsables/CustomDD";

cssInterop(Image, { className: "style" });

const EditProfile = () => {
  const [userData, setUserData] = useUserDataState();
  const [toast, setToast] = useToastSate();
  const {
    IsLoading,
    setIsLoading,
    visible,
    showDialog,
    hideDialog,
    Error,
    setError,
  } = useLoadingAndDialog();

  const [date, setDate] = useState(
    userData.DOB ? new Date(userData.DOB) : null
  );
  const [Img, setImg] = useState(null);
  const [uploading, setUploading] = useState(false);

  const OPTIONS = [
    { label: "Male", value: "male", icon: "mars" },
    { label: "Female", value: "female", icon: "venus" },
    { label: "Others", value: "others", icon: "circle-exclamation" },
  ];

  const [form, setForm] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phoneNumber: userData.phoneNumber || "",
    gender: userData.gender || "",
    height: userData.height ? userData.height.toString() : "",
    weight: userData.weight ? userData.weight.toString() : "",
    profilePic: userData.profilePic || "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImg(result.assets[0]);
        await cloudUpload(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setToast({
        message: "Error selecting image",
        visible: true,
        type: "error",
      });
    }
  };

  const cloudUpload = async (image) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("context", "user");
    formData.append("id", userData._id);
    formData.append("phoneNumber", userData.phoneNumber || "user");

    if (image) {
      formData.append("profilePic", {
        uri: image.uri,
        type: image.mimeType || "image/jpeg",
        name: image.fileName || "profile.jpg",
      });
    }

    try {
      const res = await axios.post(`${apiUrl}/api/v/auth/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm((prev) => ({
        ...prev,
        profilePic: res.data.filePath,
      }));

      setToast({
        message: "Image uploaded successfully",
        visible: true,
        type: "success",
      });
    } catch (error) {
      console.error("Upload error:", error.response?.data || error);
      setToast({
        message:
          error.response?.data?.errors?.[0]?.msg || "Failed to upload image",
        visible: true,
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async () => {
    if (!form.name) {
      setToast({
        message: "Name is required",
        visible: true,
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    const authToken = await AsyncStorage.getItem("authToken");

    try {
      const updateData = {
        ...form,
        DOB: date ? date.toISOString() : undefined,
      };

      const response = await axios.put(
        `${apiUrl}/api/v/users/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        // Update the user data in state
        setUserData((prev) => ({
          ...prev,
          ...response.data.data,
        }));

        setToast({
          message: "Profile updated successfully",
          visible: true,
          type: "success",
        });

        // Navigate back to profile
        router.back();
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      setToast({
        message:
          error.response?.data?.errors?.[0]?.msg || "Failed to update profile",
        visible: true,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Edit Profile",
          headerTitleStyle: {
            fontFamily: "Poppins-Medium",
          },
        }}
      />
      <ScrollView className="flex-1 px-4">
        <View className="items-center my-6">
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            <View className="relative">
              <Image
                source={
                  form.profilePic
                    ? { uri: form.profilePic }
                    : Img
                    ? { uri: Img.uri }
                    : require("../../assets/images/no.png")
                }
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
                className="w-32 h-32 rounded-full"
              />
              <View className="absolute bottom-0 right-0 bg-secondary-200 p-2 rounded-full">
                <FontAwesome name="camera" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          {uploading && (
            <Text className="text-gray-500 mt-2">Uploading...</Text>
          )}
        </View>

        <View className="gap-4 mb-6">
          <CustomInput
            label="Full Name"
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
            placeholder="Enter your full name"
          />

          <CustomInput
            label="Email"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <CustomInput
            label="Phone Number"
            value={form.phoneNumber}
            onChangeText={(text) => handleChange("phoneNumber", text)}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            editable={false} // Phone number shouldn't be editable as it's used for authentication
          />

          <View className="mb-2">
            <Text className="font-pmedium text-base mb-1">Date of Birth</Text>
            <DatePicker
              date={date}
              setDate={setDate}
              placeholder="Select your date of birth"
            />
          </View>

          <View className="mb-2">
            <Text className="font-pmedium text-base mb-1">Gender</Text>
            <CustomDD
              options={OPTIONS}
              value={form.gender}
              onChange={(value) => handleChange("gender", value)}
              placeholder="Select your gender"
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <CustomInput
                label="Height (cm)"
                value={form.height}
                onChangeText={(text) => handleChange("height", text)}
                placeholder="Height in cm"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <CustomInput
                label="Weight (kg)"
                value={form.weight}
                onChangeText={(text) => handleChange("weight", text)}
                placeholder="Weight in kg"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View className="mb-8">
          <CustomBtn
            title="Save Changes"
            onPress={updateProfile}
            loading={IsLoading}
            disabled={IsLoading || uploading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
