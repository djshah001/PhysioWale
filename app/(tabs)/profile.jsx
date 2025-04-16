import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useUserDataState } from "../../atoms/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { router, Link } from "expo-router";
import { Divider, Icon, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

import { cssInterop } from "nativewind";
import { blurhash } from "../../components/Utility/Repeatables";
import HealthMetrics from "../../components/Profile/HealthMetrics";
import QRCodeDisplay from "../../components/Profile/QRCodeDisplay";
import CustomBtn from "../../components/CustomBtn";
import colors from "../../constants/colors";
cssInterop(Image, { className: "style" });
cssInterop(Icon, { className: "style" });

const Profile = () => {
  const [UserData, setUserData] = useUserDataState();

  const SignOut = async () => {
    setUserData({});
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("isLoggedIn");
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="h-full bg-white-300">
      <ScrollView
        className="px-4"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        {/* Profile Header */}
        <View className="w-full items-center justify-around py-6 flex-row">
          <View className="relative">
            <Image
              source={
                UserData.profilePic ? { uri: UserData.profilePic } : images.no
              }
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
              className="w-24 h-24 rounded-full"
            />
            {/* Edit Profile Button */}
            <Link
              href="/profile/edit-profile"
              className="absolute bottom-0 right-0 bg-secondary-300 p-3 rounded-full "
            >
              <Icon
                source="pencil"
                size={16}
                // onPress={() => router.push("/profile/edit-profile")}
                // containerColor="#055300"
                color="#F7F8F8"
                // mode="contained"
              />
            </Link>
          </View>

          <View className="mt-3">
            <Text className="text-center font-osbold text-2xl">
              {UserData.name}
            </Text>
            <Text className="text-center text-md font-osthin">
              {UserData.email || UserData.phoneNumber}
            </Text>
            {UserData.age && (
              <View className="flex-row justify-center items-center mt-1">
                <Text className="text-center text-sm font-osthin text-gray-600">
                  {UserData.age} years
                </Text>
                {UserData.gender && (
                  <Text className="text-center text-sm font-osthin text-gray-600 ml-2">
                    •{" "}
                    {UserData.gender}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Health Metrics Section */}
        <HealthMetrics />

        {/* QR Code Section */}
        {UserData.qrCode && (
          <QRCodeDisplay qrCode={UserData.qrCode} userName={UserData.name} />
        )}

        <View className="w-full mt-2 gap-4 bg-white-100 rounded-2xl p-4 shadow-sm shadow-black-200">
          {/* My Appointments Button */}
          <ProfileLinks
            href="/appointments/my-appointments"
            title="My Appointments"
            icon="calendar"
          />

          {/* Edit Profile Button */}
          <ProfileLinks
            href="/profile/edit-profile"
            title="Edit Profile"
            icon="account-edit"
          />

          {/* Logout Button */}
          <CustomBtn
            title="Log Out"
            iconName="logout"
            handlePress={SignOut}
            className="rounded-xl"
            bgColor={"#E53E3E"}
          />
        </View>
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

function ProfileLinks({ href, title, icon }) {
  return (
    <>
      <Link href={href} className="px-4 rounded-2xl">
        <View className="flex-row w-full justify-between items-center gap-2">
          {/* <View className="bg-secondary-200 p-3 rounded-full"> */}
          <Icon source={icon} size={24} color={colors.secondary["300"]} />
          {/* </View> */}
          <Text className="text-center font-pmedium text-lg">{title}</Text>
          {/* <IconButton
          icon="chevron-right"
          size={24}
          iconColor="black"
          style={{
            margin: 0,
            padding: 0,
          }}
        /> */}
        </View>
      </Link>
      <Divider style={{ backgroundColor: colors.black["400"] }} />
    </>
  );
}
