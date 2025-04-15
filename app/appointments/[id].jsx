import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Divider, IconButton, Badge } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { cssInterop } from "nativewind";
import axios from "axios";
import { apiUrl } from "../../components/Utility/Repeatables";
import { useUserDataState, useToastSate } from "../../atoms/store";
import { Image } from "expo-image";
import { format } from "date-fns";

import { StatusBar } from "expo-status-bar";
import CustomBtn from "../../components/CustomBtn";
import colors from "../../constants/colors";

cssInterop(Appbar, { className: "style" });

const getStatusClassName = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-green-500";
    case "completed":
      return "bg-blue-500";
    case "cancelled":
      return "bg-red-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};

const AppointmentDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [UserData] = useUserDataState();
  const [, setToast] = useToastSate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointmentDetails();
  }, []);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${UserData?.authToken}`,
        },
      });

      if (response.data.success) {
        setAppointment(response.data.data);
      }
    } catch (error) {
      console.error(
        "Error fetching appointment details:",
        error.response?.data || error.message
      );
      setToast({
        visible: true,
        message:
          (error.response?.data?.errors &&
            error.response?.data?.errors[0]?.msg) ||
          "Failed to fetch appointment details. Please try again.",
        type: "error",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await axios.post(
                `${apiUrl}/api/v/appointments/${id}/cancel`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${UserData?.authToken}`,
                  },
                }
              );

              if (response.data.success) {
                setToast({
                  visible: true,
                  message: "Appointment cancelled successfully",
                  type: "success",
                });

                // Refresh appointment details
                fetchAppointmentDetails();
              }
            } catch (error) {
              console.error(
                "Error cancelling appointment:",
                error.response?.data || error.message
              );
              setToast({
                visible: true,
                message:
                  (error.response?.data?.errors &&
                    error.response?.data?.errors[0]?.msg) ||
                  "Failed to cancel appointment. Please try again.",
                type: "error",
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Check if appointment can be cancelled (not completed or already cancelled)
  const canCancel =
    appointment &&
    !["completed", "cancelled", "rejected"].includes(appointment.status);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white-100 justify-center items-center">
        <ActivityIndicator size="large" color={colors.secondary[300]} />
        <Text className="mt-4 font-osregular text-black-300">
          Loading appointment details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView className="flex-1 bg-white-100 justify-center items-center">
        <Text className="font-pbold text-lg">Appointment not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-secondary-300 px-6 py-2 rounded-lg"
        >
          <Text className="text-white-100 font-ossemibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Format the appointment date
  const appointmentDate = new Date(appointment.date);
  const formattedDate = format(appointmentDate, "EEEE, MMMM d, yyyy");

  return (
    <SafeAreaView className="flex-1 bg-white-100">
      <Appbar.Header
        className="bg-transparent"
        statusBarHeight={0}
        mode="center-aligned"
      >
        <Appbar.BackAction onPress={() => router.back()} color="#4A90E2" />
        <Appbar.Content
          title="Appointment Details"
          titleStyle={{
            fontFamily: "OpenSans-Bold",
            fontSize: 20,
            color: "#4A90E2",
          }}
        />
      </Appbar.Header>

      <ScrollView className="flex-1 px-4">
        {/* Status Badge */}
        <View className="items-center my-4">
          <Badge
            size={30}
            style={{
              color: "white",
              fontFamily: "OpenSans-SemiBold",
              fontSize: 14,
              paddingHorizontal: 12,
            }}
            className={getStatusClassName(appointment.status)}
          >
            {getStatusLabel(appointment.status)}
          </Badge>
        </View>

        {/* Clinic Image */}
        <View className="h-48 w-full rounded-xl overflow-hidden mb-4">
          <Image
            source={{ uri: appointment.clinicId?.images?.[0] }}
            contentFit="cover"
            className="w-full h-full"
            placeholder={{ blurhash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6." }}
            transition={300}
          />
        </View>

        {/* Clinic Details */}
        <View className="bg-white-300 rounded-xl p-4 shadow-sm mb-4 border border-secondary-100/20">
          <Text className="font-pbold text-xl text-black-400">
            {appointment.clinicId?.name}
          </Text>
          <Text className="font-osregular text-sm text-black-300 mb-2">
            {appointment.clinicId?.address}
          </Text>

          <Divider className="my-3" />

          <View className="flex-row items-center mt-2">
            <IconButton
              icon="doctor"
              size={20}
              iconColor="#4A90E2"
              style={{ margin: 0, marginRight: -5 }}
            />
            <Text className="font-ossemibold text-black-300">
              Dr. {appointment.doctorId?.name}
            </Text>
          </View>
        </View>

        {/* Appointment Details */}
        <View className="bg-white-300 rounded-xl p-4 shadow-sm mb-4 border border-secondary-100/20">
          <Text className="font-pbold text-lg text-black-400 mb-2">
            Appointment Details
          </Text>

          <View className="flex-row items-center mt-2">
            <IconButton
              icon="calendar"
              size={20}
              iconColor="#4A90E2"
              style={{ margin: 0, marginRight: -5 }}
            />
            <Text className="font-ossemibold text-black-300">
              {formattedDate}
            </Text>
          </View>

          <View className="flex-row items-center mt-1">
            <IconButton
              icon="clock-outline"
              size={20}
              iconColor="#4A90E2"
              style={{ margin: 0, marginRight: -5 }}
            />
            <Text className="font-ossemibold text-black-300">
              {appointment.time}
            </Text>
          </View>

          <Divider className="my-3" />

          {/* Service Details */}
          <View className="bg-secondary-100/20 p-3 rounded-lg mt-2">
            <Text className="font-ossemibold text-black-400">
              {appointment.serviceId?.name}
            </Text>
            <View className="flex-row justify-between mt-1">
              <Text className="font-osregular text-sm text-black-300">
                {appointment.serviceId?.duration} min
              </Text>
              <Text className="font-pbold text-blue-500">
                ₹{appointment.serviceId?.price}
              </Text>
            </View>
          </View>

          {appointment.notes && (
            <View className="mt-3">
              <Text className="font-ossemibold text-black-400">Notes:</Text>
              <Text className="font-osregular text-black-300 mt-1">
                {appointment.notes}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {canCancel && (
          <View className="mb-8">
            <CustomBtn
              title="Cancel Appointment"
              iconName="close-circle-outline"
              className="rounded-xl"
              bgColor="#E53E3E"
              handlePress={handleCancelAppointment}
              loading={loading}
            />
          </View>
        )}
      </ScrollView>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default AppointmentDetailScreen;
