import { View, FlatList, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { router } from "expo-router";
import Svg, { Circle, Defs, G, LinearGradient, Stop } from "react-native-svg";

import CustomBtn from "../../components/CustomBtn";
import Pagination from "../../components/Pagination";
import OnBoardingItem from "../../components/OnBoardingItem";

import icons from "../../constants/icons";
import { OnBoardingItems } from "../../constants/Data";

const viewabilityConfig = {
  minimumViewTime: 300,
  viewAreaCoveragePercentThreshold: 10,
};

const OnBoarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(10)).current;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const length = OnBoardingItems.length;

  const size = 56
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const per = (currentIndex + 1) * (100 / length);

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const animRef = useRef(null);
  const animation = (toValue) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(per);
  }, [per]);

  useEffect(() => {
    progressAnimation.addListener(
      (value) => {
        const strokeDashoffset =
          circumference - (circumference * value.value) / 100;
        if (animRef?.current) {
          animRef.current.setNativeProps({
            strokeDashoffset: strokeDashoffset,
          });
        }
      },
      [per]
    );
  });

  return (
    <View>
      <View className="flex-2">
        <FlatList
          data={OnBoardingItems}
          ref={ListRef}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          bounces={false}
          pagingEnabled={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <OnBoardingItem
                item={item}
                currentIndex={currentIndex}
                ListRef={ListRef}
                length={OnBoardingItems.length}
                scrollX={scrollX}
                // data={OnBoardingItems}
              />
            );
          }}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            { useNativeDriver: false }
          )}
        />
      </View>
      <Pagination
        length={OnBoardingItems.length}
        currentIndex={currentIndex}
        scrollX={scrollX}
      />
      <View className="  justify-center pt-5 items-end w-full">
        <Svg
          height="150"
          width="150"
          viewBox="0 0 100 100"
          className="absolute"
        >
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#92A3FD" stopOpacity="1" />
              <Stop offset="100%" stopColor="#9DCEFF" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <G rotation={-90} origin={50}>
            <Circle
              ref={animRef}
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#grad)"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={circumference}
            />
          </G>
        </Svg>
        <CustomBtn
          customStyles="w-[60px] h-[60px] rounded-full mb-5 mr-11 border-2 border-white-300"
          textStyles="text-white"
          iconName={`${
            currentIndex < OnBoardingItems.length - 1
              ? "chevron-right"
              : "check"
          }`}
          iconColor="white"
          iconSize={30}
          handlePress={async () => {
            // console.log(ListRef.current.items);
            if (currentIndex < OnBoardingItems.length - 1) {
              ListRef.current.scrollToIndex({ index: currentIndex + 1 });
            } else {
              router.replace("/sign-in");
            }
          }}
        />
      </View>
    </View>
  );
};

export default OnBoarding;
