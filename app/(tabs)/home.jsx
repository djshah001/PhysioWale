import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import TopBar from "../../components/Home/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserDataState } from "../../atoms/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { StatusBar } from "expo-status-bar";
import HorList from "../../components/Home/HorList";
import IconMenu from "../../components/Home/IconMenu";
import PhysiosNearBy from "../../components/Home/PhysiosNearBy";

const Home = () => {
  const [UserData, setUserData] = useUserDataState();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const getUserData = async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    const res = await axios.post(
      `${apiUrl}/api/v/auth/getloggedinuser`,
      {},
      { headers: { authToken: authToken } }
    );
    return res;
  };

  useEffect(() => {
    getUserData().then((userdata) => {
      console.log(userdata.data);
      if (userdata.data.success) {
        setUserData(userdata.data.user);
      }
    });
    console.log(UserData);
  }, []);

  console.log(`${apiUrl}/images/profilePic/${UserData.profilePic}`);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <TopBar
          firstName={UserData.firstName}
          lastName={UserData.lastName}
          imageUrl={`${apiUrl}/images/profilePic/${UserData.profilePic}`}
        />
        <HorList />
        <IconMenu />
        <PhysiosNearBy />
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default Home;
