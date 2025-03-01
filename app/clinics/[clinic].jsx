import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Repeatables from "../../components/Utility/Repeatables";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";

const ClincScreen = () => {
  const { clinicId } = useLocalSearchParams();
  const { apiUrl, blurhash } = Repeatables();

  const [ClinicData, setClinicData] = useState({});
  const [MainImg, setMainImg] = useState("");

  const getClinic = async () => {
    console.log("first");
    const res = await axios.get(`${apiUrl}/api/v/clinics?id=${clinicId}`);
    setClinicData(res.data.data[0]);
    setMainImg(res.data.data[0].images[0]);
  };

  //   console.log(ClinicData.name);

  useEffect(() => {
    getClinic();
  }, []);

  return (
    <SafeAreaView className="bg-white-300 flex-1 ">
      <ScrollView
        // className="px-4"
        contentContainerClassName="flex-grow px w-full h-scree justify-evenl self-cente "
      >
        <Image
          source={{
            uri: MainImg ? MainImg : "https://via.placeholder.com/400",
          }}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
          className=" w-full h-[30%] rounded- overflow-hidden "
        />
        <View className="absolute top-[22%] p-4 self-center">
          <BlurView
            intensity={15}
            tint="systemChromeMaterialLight"
            experimentalBlurMethod="dimezisBlurView"
            className="flex-row gap-3 bg-white-300 justify-center py-4 rounded-xl overflow-hidden  "
          >
            {ClinicData.images?.map((image, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  className="w-1/5 h-[60px] "
                  onPress={() => {
                    setMainImg(image);
                  }}
                >
                  <Image
                    source={{
                      uri: image ? image : "https://via.placeholder.com/400",
                    }}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={1000}
                    className=" w-full h-full rounded-md  "
                  />
                </TouchableOpacity>
              );
            })}
          </BlurView>
        </View>
        <Text>Clinic</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClincScreen;
