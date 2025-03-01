import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import axios from "axios";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { cssInterop } from "nativewind";
import { Icon, IconButton } from "react-native-paper";

import colors from "../../constants/colors";

cssInterop(Image, { className: "style" });

const PhysiosNearBy = ({ clinics }) => {
  // console.log(clinics);

  let today = new Date();
  let dayOfWeek = today.getDay();

  let days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  let currentDay = days[dayOfWeek];

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <View className="px-4 w-screen ">
      <View className="w-full flex-row items-center justify-between">
        <Text className="font-osbold text-xl ml-1">Physios Near-Me</Text>
        <TouchableOpacity>
          <Text className="font-ossemibold text-md text-secondary-300 underline decoration-8 underline-offset-8">
            See All
          </Text>
        </TouchableOpacity>
      </View>
      {clinics.map((clinic, i) => {
        const distance = (clinic.distance / 1000).toFixed(1);
        const opening = clinic.timing[currentDay].opening;
        const closing = clinic.timing[currentDay].closing;
        return (
          <View
            key={clinic._id}
            className={`my-3 gap-3 justify-center bg-white-300 shadow-md shadow-black-200 rounded-[30px] overflow-hidden `}
          >
            <Image
              source={{
                uri: clinic.images[0]
                  ? clinic.images[0]
                  : "https://via.placeholder.com/400",
              }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
              className=" w-full h-80 rounded-3xl overflow-hidden "
            />

            <BlurView
              intensity={15}
              tint="systemChromeMaterialLight"
              experimentalBlurMethod="dimezisBlurView"
              className=" absolute top-3 right-2 rounded-full overflow-hidden "
            >
              <IconButton
                icon="bookmark-outline"
                iconColor={colors.white["500"]}
                // className="bg-white-400"
                size={24}
                onPress={() => console.log("Pressed")}
              />
            </BlurView>

            <BlurView
              intensity={15}
              tint="systemChromeMaterialLight"
              experimentalBlurMethod="dimezisBlurView"
              className=" absolute top-3 left-2 rounded-full overflow-hidden flex-row items-center justify-around  "
            >
              <IconButton
                icon="map-marker-radius-outline"
                iconColor={colors.white["500"]}
                className="bg-white-40 ml-0 "
                size={24}
                onPress={() => console.log("Pressed")}
              />
              <View className="mr-5">
                <Text className="text-white-500 ">{distance} km</Text>
              </View>
            </BlurView>

            <BlurView
              intensity={30}
              tint="systemChromeMaterialDark"
              experimentalBlurMethod="dimezisBlurView"
              className=" absolute bottom-0 w-full "
            >
              <View className="p-3 my-2  rounded-b-3xl shadow-xl flex-row items-center justify-around bg-blac-200/50 ">
                {/* Overlayed content */}
                <View className=" w-9/12 gap-1 ">
                  <Text className="text-xs font-oslight text-accent mb-1 ">
                    <Icon
                      source="clock-time-two-outline"
                      size={12}
                      color={colors.accent["DEFAULT"]}
                    />{" "}
                    {opening} - {closing}
                  </Text>
                  <Text className="text-xl font-pbold text-white-400 leading-6 ">
                    {clinic.name}
                  </Text>
                  {/* <Text
                    className=" font-osmedium text-accent "
                    numberOfLines={1}
                  >
                    <Icon
                      source="map-marker"
                      size={16}
                      color={colors.accent["DEFAULT"]}
                    />
                    {clinic.address || "Address not available"}
                  </Text> */}
                </View>
                <BlurView
                  intensity={20}
                  tint="systemChromeMaterialLight"
                  experimentalBlurMethod="dimezisBlurView"
                  className=" rounded-full overflow-hidden "
                >
                  <IconButton
                    icon="arrow-top-right"
                    iconColor={colors.white["500"]}
                    // className="bg-white-400"
                    size={30}
                    onPress={() =>
                      router.push({
                        pathname: "/clinics/".concat(clinic._id),
                        params: {
                          clinicId: clinic._id,
                        },
                      })
                    }
                  />
                </BlurView>
              </View>
            </BlurView>
            {/* </> */}
          </View>
        );
      })}
    </View>
  );
};

export default PhysiosNearBy;
