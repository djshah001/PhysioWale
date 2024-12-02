import { View, Text, Image } from "react-native";
import React from "react";
import Pagination from "../Pagination";

const ListData = ({ item, scrollX, data }) => {
  return (
    <View className="w-screen px-4 justify-center my-4 ">
      <View className=" overflow-hidden bg-secondary-200 rounded-3xl flex-row justify-between items-center shadow-xl shadow-black-200 ">
        <View className="w-2/3 pl-4 justify-center items-start gap-2 py-6">
          <Text className="font-osbold text-2xl text-white-300">
            {item.title}
          </Text>
          <Text className="font-pregular text-[10px] text-white-300 mx-2 ">
            {item.description}
          </Text>
          <Pagination
            data={data}
            scrollX={scrollX}
            divColor="#fff"
            customStyles="mt-0 ml-1 "
          />
        </View>
        <Image
          source={item.image}
          resizeMode="cover"
          className="w-1/3 h-full mt-5 "
        />
      </View>
    </View>
  );
};

export default ListData;
