import { View, Text } from "react-native";
import React from "react";

const Pagination = ({ length, currentIndex }) => {
  return (
    <View className="flex-row justify-center mt-6">
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          className={`w-[15px] h-[15px] rounded-full border-2 mx-1 ${
            i === currentIndex && "bg-black"
          } `}
        />
      ))}
    </View>
  );
};

export default Pagination;
