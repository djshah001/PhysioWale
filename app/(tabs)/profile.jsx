import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState } from "react";
import { MotiText, MotiView } from "moti";
import { useUserDataState } from "../../atoms/store";
import { Avatar, Card, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Image } from "expo-image";
import { CameraView, useCameraPermissions } from "expo-camera";

const Profile = () => {
  const [UserData, setUserData] = useUserDataState();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);

  // console.log(permission);

  const SignOut = async () => {
    setUserData({});
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("isLoggedIn");
    router.replace("/sign-in");
  };

  const handleScanQRCode = async () => {
    if (!permission.granted) {
      const { status } = await requestPermission();
      if (status !== "granted") {
        return;
      }
    }
    setShowCamera(true);
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (showCamera) {
    return (
      <SafeAreaView className="flex-1">
        <CameraView
          autofocus
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          // className="flex-1 w-screen h-screen"
          style={{
            flex: 1,
          }}
          onBarcodeScanned={(res) => {
            setShowCamera(false);
            console.log(res.data);
          }}
        />
        <Button title="Close Camera" onPress={() => setShowCamera(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        className="px-4 "
        contentContainerStyle={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View className=" w-full h-full gap-3 items-center justify-center ">
          <View className=" relative ">
            <Avatar.Image
              source={images.no}
              size={100}
              style={{ backgroundColor: "transparent" }}
              className=""
            />
            <TouchableOpacity className=" absolute top-[70px] right-0  ">
              <Image
                source={{ uri: UserData.qrCode }}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>


          </View>
            <Image
              source={{ uri: UserData.qrCode }}
              style={{ width: 150, height: 150 }}
            />
          <View className="mt-2">
            <Text className="text-center font-osbold text-2xl ">
              {UserData.name}
            </Text>
            <Text className="text-center text-md font-ossemibold ">
              {UserData.email}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => SignOut()}
          className=" bg-white-100 py-3 px-4 rounded-2xl shadow-xl shadow-black-200"
        >
          <View className=" flex-row w-full justify-between items-center ">
            <View className=" bg-secondary-200 p-3 rounded-full ">
              <FontAwesome name="power-off" size={22} color="#F7F8F8" />
            </View>
            <Text className="text-center font-pmedium text-xl ">Log Out</Text>
            <FontAwesome name="chevron-right" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Button title="Scan QR Code" onPress={handleScanQRCode} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
