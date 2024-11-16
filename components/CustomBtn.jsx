import { TouchableOpacity, Text, Image, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

const CustomBtn = ({
  title,
  handlePress,
  customStyles,
  textStyles,
  isLoading,
  image,
  imageStyles,
  iconName,
  iconSize,
  iconColor,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      // className={`flex-row justify-center items-center mt-5 border-2 w-[60px] rounded-full`}
    >
      <LinearGradient
        // colors={["#ACADFF", "#8587DC"]}
        colors={["#9DCEFF", "#92A3FD"]}
        // colors={["#9DCEFF", "#92A3FD","#FB91E6"]}
        // locations={[0.2,0.5,0.8]}
        // start={{ x: 0.2, y: 0.5 }}
        // end={{ x: 0.7, y: 0.4 }}
        className={`flex-row justify-center items-center min-h-[60px] ${customStyles}`}
      >
        {title && (
          <Text
            className={`□ text-white-300 font-psemibold text-lg mr-2 ${textStyles} `}
          >
            {title}
          </Text>
        )}

        {iconName && (
          <View className="" >
            <FontAwesome
              name={iconName}
              size={iconSize}
              color={iconColor}
            />
          </View>
        )}

        {image && (
          <Image source={image} resizeMode="contain" className={imageStyles} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomBtn;
