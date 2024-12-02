import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
export default function CustomBtn({
  title,
  iconName,
  handlePress,
  loading,
  disabled,
}) {
  return (
    <View
      style={{
        elevation: 5,
        // Android shadow shadow
        Color: "#000",
        // iOS shadow
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderRadius: 25,
        // Match the border radius of the gradient
        overflow: "hidden",
      }}
    >
      <LinearGradient
        colors={["#9DCEFF", "#95AEFE"]} // colors={[ "#56BBF1","#63a4ff"]}
        // locations={[0.2, 0.5, 0.8]}
        start={{
          x: 0.7,
          y: 0.4,
        }}
        end={{
          x: 0.4,
          y: 0.1,
        }}
        className=" py-2 px-2 rounded-full overflow-hidden "
      >
        <Button
          icon={iconName}
          // size={30}
          loading={loading || false}
          disabled={disabled || false}
          // buttonColor="#95AEFE"
          textColor="#F7F8F8"
          contentStyle={{
            flexDirection: "row-reverse",
          }}
          onPress={() => {
            handlePress();
          }}
        >
          {title}
        </Button>
      </LinearGradient>
    </View>
  );
}
