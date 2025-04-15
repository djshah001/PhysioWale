import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Card, IconButton, Badge } from "react-native-paper";
import { Image } from "expo-image";
import { format } from "date-fns";

import { router } from "expo-router";
import axios from "axios";
import { apiUrl } from "../Utility/Repeatables";
import { useToastSate, useUserDataState } from "../../atoms/store";

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

const AppointmentCard = ({ appointment, onCancelSuccess }) => {
  const [UserData, setUserData] = useUserDataState();
  const [, setToast] = useToastSate();

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
              const response = await axios.post(
                `${apiUrl}/api/v/appointments/${appointment._id}/cancel`,
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

                // Call the callback to refresh the appointments list
                if (onCancelSuccess) {
                  onCancelSuccess();
                }
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
            }
          },
        },
      ]
    );
  };

  // Format the appointment date
  const appointmentDate = new Date(appointment.date);
  const formattedDate = format(appointmentDate, "EEEE, MMMM d, yyyy");

  // Check if appointment can be cancelled (not completed or already cancelled)
  const canCancel = !["completed", "cancelled", "rejected"].includes(
    appointment.status
  );


  return (
    <Card className="mb-4 overflow-hidden border border-white-200">
      {/* Status Badge */}
      <View className="absolute top-2 right-2 z-10">
        <Badge
          style={{
            color: "white",
            fontFamily: "OpenSans-SemiBold",
          }}
          className={getStatusClassName(appointment.status)}
        >
          {getStatusLabel(appointment.status)}
        </Badge>
      </View>

      {/* Clinic Image */}
      <View className="h-32 w-full">
        <Image
          source={{ uri: appointment.clinicId?.images?.[0] }}
          contentFit="cover"
          className="w-full h-full"
          placeholder={{ blurhash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6." }}
          transition={300}
        />
      </View>

      {/* Appointment Details */}
      <Card.Content className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="font-pbold text-lg text-black-400">
              {appointment.clinicId?.name}
            </Text>
            <Text className="font-osregular text-sm text-black-300 mb-2">
              Dr. {appointment.doctorId?.name}
            </Text>
          </View>
        </View>

        {/* Date and Time */}
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

        {/* Service Details */}
        <View className="bg-secondary-100/20 p-3 rounded-lg mt-3">
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

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="bg-secondary-100/30 rounded-lg px-4 py-2 flex-row items-center"
            onPress={() =>
              router.push({
                pathname: `/appointments/${appointment._id}`,
                params: { appointmentId: appointment._id },
              })
            }
          >
            <IconButton
              icon="information-outline"
              size={18}
              iconColor="#4A90E2"
              style={{ margin: 0, marginRight: -5 }}
            />
            <Text className="font-ossemibold text-blue-500">Details</Text>
          </TouchableOpacity>

          {canCancel && (
            <TouchableOpacity
              className="bg-red-100/30 rounded-lg px-4 py-2 flex-row items-center"
              onPress={handleCancelAppointment}
            >
              <IconButton
                icon="close-circle-outline"
                size={18}
                iconColor="#E53E3E"
                style={{ margin: 0, marginRight: -5 }}
              />
              <Text className="font-ossemibold text-red-500">Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

export default AppointmentCard;
