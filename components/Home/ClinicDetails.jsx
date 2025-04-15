import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Card, Chip, Divider, IconButton } from "react-native-paper";
import colors from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { CustomChip } from "../ReUsables/CustomChip";
import CustomBtn from "../CustomBtn";

const ClinicDetails = ({ clinic, onClose }) => {
  // Format timing display
  const formatTiming = (day) => {
    if (!clinic.timing || !clinic.timing[day]) return "Not available";
    const dayData = clinic.timing[day];
    return dayData.isClosed
      ? "Closed"
      : `${dayData.opening} - ${dayData.closing}`;
  };

  // Check if clinic is currently open
  const isCurrentlyOpen = () => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = days[new Date().getDay()];

    if (
      !clinic.timing ||
      !clinic.timing[today] ||
      clinic.timing[today].isClosed
    ) {
      return false;
    }

    return true; // Simplified for now - would need actual time comparison
  };

  return (
    <Card className="rounded-lg overflow-hidden">
      <View className="relative">
        <Image
          source={{
            uri:
              clinic.images?.[0] ||
              "https://via.placeholder.com/400x200?text=No+Image",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 flex-row">
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
            className="bg-white/80 rounded-full"
            iconColor={colors.white[300]}
          />
        </View>
        {isCurrentlyOpen() ? (
          <CustomChip spec="Open Now" otherStyles="absolute bottom-2 left-2 " />
        ) : (
          <CustomChip spec="Closed" otherStyles="absolute bottom-2 left-2 " />
        )}
      </View>

      <ScrollView className="p-4 max-h-96">
        <View className="flex justify-between items-start">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
            <Text className="ml-1 font-bold">
              {clinic.rating?.overall || "New"}
            </Text>
            <Text className="text-gray-500 text-xs ml-1">
              ({clinic.rating?.reviewCount || 0} reviews)
            </Text>
          </View>
          <Text className="text-xl font-pbold">{clinic.name}</Text>
        </View>

        <Text className="text-gray-500 mt-1">{clinic.address}</Text>

        <View className="flex-row items-center mt-2">
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={18}
            color={colors.primary[500]}
          />
          <Text className="ml-1">
            {clinic.distanceInKm?.toFixed(1) || "?"} km away
          </Text>
        </View>

        <Divider className="my-3" />

        <Text className="font-pbold text-lg">Services</Text>
        <View className="flex-row flex-wrap mt-1">
          {clinic.services?.map((service, index) => (
            <CustomChip
              key={service._id || index}
              spec={`${service.name} ${
                service.price > 0 ? `₹${service.price}` : "Free"
              }`}
              otherStyles=""
            />
          ))}
        </View>

        <Text className="font-pbold text-lg mt-4">Specializations</Text>
        <View className="flex-row flex-wrap mt-1">
          {clinic.specializations?.map((spec, index) => (
            <CustomChip key={index} spec={spec} compact={true} />
          ))}
        </View>

        <Text className="font-pbold text-lg mt-4">Facilities</Text>
        <View className="flex-row flex-wrap mt-1">
          {clinic.facilities?.map((facility, index) => (
            <CustomChip key={index} spec={facility} otherStyles="mr-2 mt-2" />
          ))}
        </View>

        <Text className="font-pbold text-lg mt-4">Hours</Text>
        <View className="mt-1 mb-8 ">
          <View className="flex-row justify-between py-1">
            <Text>Sunday</Text>
            <Text>{formatTiming("sunday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Monday</Text>
            <Text>{formatTiming("monday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Tuesday</Text>
            <Text>{formatTiming("tuesday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Wednesday</Text>
            <Text>{formatTiming("wednesday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Thursday</Text>
            <Text>{formatTiming("thursday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Friday</Text>
            <Text>{formatTiming("friday")}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text>Saturday</Text>
            <Text>{formatTiming("saturday")}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-4 flex-row justify-between">
        {/* <TouchableOpacity
          className="bg-accent rounded-full px-6 py-3 flex-row items-center"
          onPress={() => {
            // Handle call action
            // You can use Linking.openURL(`tel:${clinic.phoneNumber}`)
          }}
        >
          <MaterialCommunityIcons
            name="phone"
            size={18}
            color={colors.black[300]}
          />
          <Text className="ml-2 font-bold">Call</Text>
        </TouchableOpacity> */}
        <CustomBtn
          title={"call"}
          iconName={"phone"}
          variant="oulined"
          handlePress={() => {
            // Handle call action
            Linking.openURL(`tel:${clinic.phoneNumber}`);
          }}
        />

        <CustomBtn
          title={"Book Appointment"}
          iconName={"calendar-check"}
          useGradient
          className="rounded-xl"
          handlePress={() => {
            router.push({
              pathname: "appointments/book",
              params: { clinicId: clinic._id, doctorId: clinic.doctor._id },
            });
          }}
        />
      </View>
    </Card>
  );
};

export default ClinicDetails;
