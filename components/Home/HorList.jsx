import { View, Text, Animated, FlatList } from "react-native";
import React, { useRef, useState } from "react";
import { HorizontalList } from "../../constants/Data";
import ListData from "./ListData";
import Pagination from "../Pagination";

const viewabilityConfig = {
  minimumViewTime: 300,
  viewAreaCoveragePercentThreshold: 10,
};

const HorList = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(10)).current;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  return (
    <>
      <FlatList
        data={HorizontalList}
        ref={ListRef}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        // bounces={false}
        pagingEnabled={true}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <ListData
              item={item}
              currentIndex={currentIndex}
              ListRef={ListRef}
              length={HorizontalList.length}
              scrollX={scrollX}
              data={HorizontalList}
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
      {/* <Pagination
        data={HorizontalList}
        scrollX={scrollX}
        customStyles="mt-0"
        divColor="#000000"
      /> */}
    </>
  );
};

export default HorList;
