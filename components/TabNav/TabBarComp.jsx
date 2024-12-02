import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import TabButton from "./TabButton";
import { MotiView } from "moti";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

const TabBarComp = ({ state, descriptors, navigation }) => {
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setTabBarWidth(width);
  };

  const w = tabBarWidth / state.routes.length;

  const translateVal = useSharedValue(0);

  return (
    <View
      onLayout={handleLayout}
      className=" w-4/5 flex-row justify-between items-center relative bottom-[20] left-[10%] py-3 rounded-full bg-slate-50 shadow-md shadow-black "
    >
      <MotiView
        className={` bg-secondary-200 shadow-md shadow-blue-600 justify-center items-center 
          w-[50px] h-[50px] rounded-full absolute  `}
        style={{ left: useDerivedValue(() => w / 2 - 25) }}
        animate={useDerivedValue(() => ({
          translateX: translateVal.value,
        }))}
        transition={{
          type: "spring",
          duration: 1300,
          stiffness: 200,
          dampingRatio: 0.8,
        }}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const iconName = options.icon; // Get the icon name from options
        const focusedIcon = options.focusedIcon; // Get the icon name from options
        const isFocused = state.index === index;

        const onPress = () => {
          translateVal.value = w * index;
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.name}
            w={w}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
            iconName={iconName}
            focusedIcon={focusedIcon}
            label={label}
            tabBarWidth={tabBarWidth}
            index={state.index}
          />
        );
      })}
    </View>
  );
};

export default TabBarComp;
