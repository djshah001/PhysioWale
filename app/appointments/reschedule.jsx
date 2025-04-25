import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Divider, Icon } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { cssInterop } from "nativewind";
import axios from "axios";
import { apiUrl } from "../../components/Utility/Repeatables";
import { useUserDataState, useToastSate } from "../../atoms/store";
import { Image } from "expo-image";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { StatusBar } from "expo-status-bar";
import CustomBtn from "../../components/CustomBtn";
import { Calendar } from "react-native-calendars";
import ScreenTransition from "../../components/Utility/ScreenTransition";

cssInterop(Appbar, { className: "style" });

const RescheduleScreen = () => {
  const { appointmentId } = useLocalSearchParams();
  const [UserData] = useUserDataState();
  const [, setToast] = useToastSate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  // Fetch appointment details
  useEffect(() => {
    fetchAppointmentDetails();
  }, []);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v/appointments/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${UserData?.authToken}`,
          },
        }
      );

      if (response.data.success) {
        setAppointment(response.data.data);
        // Set the current appointment date as the initially selected date
        const currentDate = new Date(response.data.data.date);
        setSelectedDate(format(currentDate, "yyyy-MM-dd"));
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

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate && appointment) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate, appointment]);

  const fetchAvailableTimeSlots = async () => {
    if (!selectedDate || !appointment) return;

    setLoadingTimeSlots(true);
    setSelectedTimeSlot(null);

    try {
      const response = await axios.get(
        `${apiUrl}/api/v/appointments/available-slots`,
        {
          params: {
            clinicId: appointment.clinicId._id,
            doctorId: appointment.doctorId._id,
            date: selectedDate,
          },
          headers: {
            Authorization: `Bearer ${UserData?.authToken}`,
          },
        }
      );

      if (response.data.success) {
        // Get current time for filtering past time slots
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const isToday = selectedDate === format(now, "yyyy-MM-dd");

        // Convert 24-hour format to 12-hour format with AM/PM and filter past times if today
        const formattedTimeSlots = response.data.data
          .filter((timeSlot) => {
            // Only filter if the selected date is today
            if (!isToday) return true;

            // Parse the time slot
            const [hours, minutes] = timeSlot.split(":");
            const slotHour = parseInt(hours);
            const slotMinute = parseInt(minutes);

            // Compare with current time
            if (slotHour > currentHour) return true;
            if (slotHour === currentHour && slotMinute > currentMinute)
              return true;
            return false; // Past time slot
          })
          .map((timeSlot) => {
            const [hours, minutes] = timeSlot.split(":");
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
          });

        setAvailableTimeSlots(formattedTimeSlots);
      }
    } catch (error) {
      console.error(
        "Error fetching available time slots:",
        error.response?.data || error.message
      );
      setToast({
        visible: true,
        message:
          (error.response?.data?.errors &&
            error.response?.data?.errors[0]?.msg) ||
          "Failed to fetch available time slots. Please try again.",
        type: "error",
      });
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      setToast({
        visible: true,
        message: "Please select both date and time slot",
        type: "error",
      });
      return;
    }

    // Check if the selected date and time are the same as the current appointment
    const currentDate = format(new Date(appointment.date), "yyyy-MM-dd");
    if (selectedDate === currentDate && selectedTimeSlot === appointment.time) {
      setToast({
        visible: true,
        message: "Please select a different date or time",
        type: "error",
      });
      return;
    }

    Alert.alert(
      "Confirm Reschedule",
      "Are you sure you want to reschedule this appointment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reschedule",
          onPress: async () => {
            setSubmitting(true);
            try {
              const response = await axios.post(
                `${apiUrl}/api/v/appointments/${appointmentId}/reschedule`,
                {
                  date: selectedDate,
                  time: selectedTimeSlot,
                },
                {
                  headers: {
                    Authorization: `Bearer ${UserData?.authToken}`,
                  },
                }
              );

              if (response.data.success) {
                setToast({
                  visible: true,
                  message: "Appointment rescheduled successfully",
                  type: "success",
                });
                router.replace({
                  pathname: `/appointments/${appointmentId}`,
                  params: { appointmentId },
                });
              }
            } catch (error) {
              console.error(
                "Error rescheduling appointment:",
                error.response?.data || error.message
              );
              setToast({
                visible: true,
                message:
                  (error.response?.data?.errors &&
                    error.response?.data?.errors[0]?.msg) ||
                  "Failed to reschedule appointment. Please try again.",
                type: "error",
              });
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white-100 justify-center items-center" edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="mt-4 font-osregular text-black-600">
          Loading appointment details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView className="flex-1 bg-white-100 justify-center items-center" edges={['top', 'left', 'right']}>
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

  // Generate marked dates for the calendar
  const today = startOfToday();
  const markedDates = {};

  // Mark the selected date
  if (selectedDate) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: "#4A90E2",
    };
  }

  // Mark the current appointment date
  const currentAppointmentDate = format(
    new Date(appointment.date),
    "yyyy-MM-dd"
  );
  if (currentAppointmentDate !== selectedDate) {
    markedDates[currentAppointmentDate] = {
      marked: true,
      dotColor: "#4A90E2",
    };
  }

  return (
    <ScreenTransition>
      <SafeAreaView className="flex-1 bg-white-100" edges={['top', 'left', 'right']}>
      <Appbar.Header
        className="bg-transparent "
        statusBarHeight={0}
        mode="center-aligned"
      >
        <Appbar.BackAction onPress={() => router.back()} color="#4A90E2" />
        <Appbar.Content
          title="Reschedule"
          titleStyle={{
            fontFamily: "OpenSans-Bold",
            fontSize: 20,
            color: "#4A90E2",
          }}
        />
      </Appbar.Header>

      <ScrollView className="flex-1 px-4">
        {/* Clinic Info */}
        <View className="bg-white-300 rounded-xl p-5 shadow-md mb-5 border border-secondary-100/20">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Icon source="hospital-building" size={20} color="#4A90E2" />
            </View>
            <View className="flex-1">
              <Text className="font-pbold text-lg text-black-800">
                {appointment.clinicId?.name}
              </Text>
              <Text className="font-osregular text-sm text-black-600">
                Dr. {appointment.doctorId?.name} • {appointment.serviceId?.name}
              </Text>
            </View>
          </View>

          <View className="bg-blue-50 p-4 rounded-lg mt-3 border border-blue-100">
            {/* <Text className="font-ossemibold text-black-800 mb-1">
              Current Appointment
            </Text> */}
            <View className="flex-row items-center mt-1 gap-1">
              <Icon source="calendar" size={18} color="#4A90E2" />
              <Text className="font-osregular text-black-600">
                {format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}
              </Text>
            </View>
            <View className="flex-row items-center mt-1 gap-1">
              <Icon source="clock-outline" size={18} color="#4A90E2" />
              <Text className="font-osregular text-black-600">
                {appointment.time}
              </Text>
            </View>
          </View>
        </View>

        {/* Calendar */}
        <View className="bg-white-300 rounded-xl p-5 shadow-md mb-5 border border-secondary-100/20">
          <View className="flex-row mb-3 gap-1">
            <Icon source="calendar-month" size={22} color="#4A90E2" />
            <Text className="font-pbold text-lg text-black-800">
              Select New Date
            </Text>
          </View>

          <Calendar
            minDate={format(today, "yyyy-MM-dd")}
            maxDate={format(addDays(today, 30), "yyyy-MM-dd")}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              todayTextColor: "#4A90E2",
              arrowColor: "#4A90E2",
              dotColor: "#4A90E2",
              selectedDayBackgroundColor: "#4A90E2",
              selectedDayTextColor: "#ffffff",
              textDayFontFamily: "OpenSans-Regular",
              textMonthFontFamily: "OpenSans-Bold",
              textDayHeaderFontFamily: "OpenSans-SemiBold",
              dayTextColor: "#333333",
              monthTextColor: "#333333",
              textMonthFontSize: 16,
              textDayFontSize: 14,
            }}
          />
        </View>

        {/* Time Slots */}
        <View className="bg-white-300 rounded-xl p-5 shadow-md mb-5 border border-secondary-100/20">
          <View className="flex-row mb-3 gap-1">
            <Icon
              source="clock-outline"
              size={22}
              color="#4A90E2"
              style={{ marginRight: 10 }}
            />
            <Text className="font-pbold text-lg text-black-800">
              Select New Time
            </Text>
          </View>

          {loadingTimeSlots ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="small" color="#4A90E2" />
              <Text className="mt-2 font-osregular text-black-600">
                Loading available time slots...
              </Text>
            </View>
          ) : availableTimeSlots.length === 0 ? (
            <View className="py-8 items-center">
              <Icon
                source="calendar-remove"
                size={40}
                color="#9CA3AF"
                style={{ marginBottom: 10 }}
              />
              <Text className="font-ossemibold text-black-800 text-center">
                No available time slots for this date.
              </Text>
              <Text className="mt-2 font-osregular text-black-600 text-center px-4">
                {selectedDate === format(new Date(), "yyyy-MM-dd")
                  ? "Past time slots for today are not available. Please select a future time or a different date."
                  : "Please select a different date."}
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-start gap-2">
              {availableTimeSlots.map((timeSlot) => (
                <TouchableOpacity
                  key={timeSlot}
                  onPress={() => setSelectedTimeSlot(timeSlot)}
                  className={` px-4 py-3 rounded-xl border shadow-sm ${
                    selectedTimeSlot === timeSlot
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white-100 border-gray-200"
                  }`}
                >
                  <Text
                    className={`font-ossemibold text-center ${
                      selectedTimeSlot === timeSlot
                        ? "text-white-100"
                        : "text-black-600"
                    }`}
                  >
                    {timeSlot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Action Button */}
      </ScrollView>
      <View className="p-4 bg-white-100 border-t border-gray-200 shadow-lg">
        <CustomBtn
          title="Confirm Reschedule"
          iconName="calendar-check"
          className="rounded-xl"
          bgColor="#4A90E2"
          useGradient
          handlePress={handleReschedule}
          loading={submitting}
          disabled={!selectedDate || !selectedTimeSlot || loadingTimeSlots}
        />
        {selectedDate && selectedTimeSlot && (
          <Text className="text-center mt-2 font-osregular text-sm text-gray-500">
            New appointment: {format(new Date(selectedDate), "MMM d, yyyy")} at{" "}
            {selectedTimeSlot}
          </Text>
        )}
      </View>

      <StatusBar style="dark" />
    </SafeAreaView>
    </ScreenTransition>
  );
};

export default RescheduleScreen;
