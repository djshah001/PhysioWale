import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import TopBar from "../../components/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserDataState } from "../../atoms/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Home = () => {
  const [UserData, setUserData] = useUserDataState();

  const getUserData = async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    const res = await axios.post(
      "http://192.168.0.110:3001/api/v/auth/getloggedinuser",
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
  }, []);

  // console.log({UserData:UserData});

  return (
    <SafeAreaView className="h-full px-4">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <TopBar
          firstName={UserData.firstName}
          lastName={UserData.lastName}
          image={UserData.profilePic}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
