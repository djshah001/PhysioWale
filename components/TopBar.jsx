import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useUserDataState } from "../atoms/store";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

const TopBar = ({ firstName, lastName, image }) => {
  const [UserData, setUserData] = useUserDataState();
  const SignOut = async () => {
    setUserData({});
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("isLoggedIn");
    router.replace("/sign-in");
  };
  return (
    <View className="w-full h-[70px] items-center justify-between px-1 rounded-xl flex-row  ">
      <View className="flex-row items-center">
        {/* <Image
          source={{
            uri: `http://192.168.0.110:3001/images/profilePic/no.png`,
          }}
          resizeMode="contain"
          className=" w-14 h-11 rounded-full mr-2"
        /> */}
        <Text className="text-xl font-pbold text-black-200">Project P</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          SignOut();
        }}
      >
        <Foundation name="align-right" size={30} color="black" />
        {/* <FontAwesome6 name="align-right" size={24} color="black" /> */}
      </TouchableOpacity>
    </View>
  );
};

export default TopBar;
