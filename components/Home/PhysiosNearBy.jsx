import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React from "react";

const PhysiosNearBy = () => {
  return (
    <View
      className="w-full flex-row items-center justify-between px-3  "
      // style={{ borderBottomWidth: 2, borderBottomColor: "#000" }}
    >
      <Text className="font-osbold text-xl ml-1">Physios Near-Me </Text>
      <TouchableOpacity className="">
        <Text className="font-ossemibold text-md text-secondary-300 underline decoration-8 underline-offset-8 ">
          see all{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhysiosNearBy;
