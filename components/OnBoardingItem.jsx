import { Image, Text, View } from "react-native";
import CustomBtn from './CustomBtn';
import Pagination from './Pagination';
import { icons } from "../constants";

const OnBoardingItem = ({ item, currentIndex, ListRef, length }) => {
  return (
    <View className="h-[100vh] justify-between">
      <View className="w-[100vw] h-[58vh] items-start">
        <Image
          source={item.image}
          resizeMode="contain"
          className="w-full h-full"
        />
      </View>
      <View className="mx-5 w-[90vw]">
        <Text className="text-3xl font-pbold mb-2">{item.title}</Text>
        <Text className="text-lg font-pregular">{item.description}</Text>
      </View>

      <View className="flex justify-between mx-5 ">
        {/* <CustomBtn
          // title="&larr;"
          customStyles={`w-[70px] h-[70px] rounded-full mb-5 ${
            currentIndex == 0 && " opacity-50"
          } `}
          textStyles="text-white"
          image={icons.left}
          imageStyles="w-[30px] h-[30px]"
          handlePress={() => {
            // console.log(currentIndex);
            if (currentIndex > 0) {
              ListRef.current.scrollToIndex({ index: currentIndex - 1 });
            }
          }}
        /> */}
        <Pagination length={length} currentIndex={currentIndex} />
        
        <CustomBtn
          // title="&rarr;"
          customStyles="w-[70px] h-[70px] rounded-full mb-5"
          textStyles="text-white"
          image={icons.right}
          imageStyles="w-[30px] h-[30px]"
          handlePress={async () => {
            // console.log(ListRef.current.items);
            if (currentIndex < length - 1) {
              ListRef.current.scrollToIndex({ index: currentIndex + 1 });
            } else {
              router.replace("/sign-in");
            }
          }}
        />
      </View>
      {/* <StatusBar barStyle="light-content" /> */}
    </View>
  );
};

export default OnBoardingItem;
