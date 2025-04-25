import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Chip, Modal, Portal, Icon } from "react-native-paper";
import { cssInterop } from "nativewind";
import { MotiView } from "moti";
import { format, addDays } from "date-fns";
import { Calendar } from "react-native-calendars";

import colors from "../../constants/colors";
import { StatusBar } from "expo-status-bar";
import {
  useClinicsState,
  useUserDataState,
  useToastSate,
} from "../../atoms/store";
import CustomBtn from "../../components/CustomBtn";

// Import the components we created earlier
import TimeSlotGroup from "../../components/Appointments/TimeSlotGroup";
import NoSlotsAvailable from "../../components/Appointments/NoSlotsAvailable";
import DateSelector from "../../components/Appointments/DateSelector";
import { Image } from "expo-image";
import { CustomChip } from "../../components/ReUsables/CustomChip";
import axios from "axios";
import { apiUrl } from "../../components/Utility/Repeatables";
import GradientCard from "../../components/UI/GradientCard";

cssInterop(Appbar, { className: "style" });
cssInterop(Modal, { className: "style" });
cssInterop(Icon, { className: "style" });
cssInterop(Portal, { className: "style" });

// Helper function to convert time string to minutes for comparison
const timeToMinutes = (timeString) => {
  if (!timeString) return 0;

  const isPM = timeString.toLowerCase().includes("pm");
  const isAM = timeString.toLowerCase().includes("am");

  // Extract hours and minutes
  const timeParts = timeString.replace(/\s?[ap]m$/i, "").split(":");
  let hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1] || 0);

  // Convert to 24-hour format
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Helper function to check if a slot is unavailable
const filterAvailableSlots = (slots, date) => {
  // Check if slot is in the past for today
  if (date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // If the selected date is today, check if the slot is in the past
    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      // Get current time in minutes
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      // Add a buffer of 30 minutes
      const bufferMinutes = 30;

      return slots.map((slot) => {
        const slotStart = timeToMinutes(slot.time);
        // If slot is in the past or too close to current time, mark as unavailable
        return {
          ...slot,
          available: slotStart > currentTimeInMinutes + bufferMinutes,
        };
      });
    }
  }

  // If not today, return slots as is
  return slots.map((slot) => ({
    ...slot,
    available: true,
  }));
};

const BookAppointmentScreen = () => {
  const params = useLocalSearchParams();
  const clinicId = params.clinicId;
  const doctorId = params.doctorId;
  const [clinics] = useClinicsState();
  const [loading, setLoading] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [UserData] = useUserDataState();
  const [, setToast] = useToastSate();
  const [selectedService, setSelectedService] = useState(null);

  // Get clinic data from state using useMemo for better performance
  const clinicData = useMemo(() => {
    return clinics.find((clinic) => clinic._id === clinicId);
  }, [clinics, clinicId]);

  // Group time slots by morning, afternoon, evening for better organization
  const groupedSlots = useMemo(() => {
    if (!availableSlots.length) return {};

    return availableSlots.reduce((acc, slot) => {
      const time = slot.time;
      if (time.includes("AM")) {
        acc.morning = [...(acc.morning || []), slot];
      } else if (time.includes("PM") && parseInt(time.split(":")[0]) < 5) {
        acc.afternoon = [...(acc.afternoon || []), slot];
      } else {
        acc.evening = [...(acc.evening || []), slot];
      }
      return acc;
    }, {});
  }, [availableSlots]);

  // Format date for display
  const formatDate = useCallback((date) => {
    if (!date) return "Select Date";
    return format(date, "EEEE, MMMM d, yyyy");
  }, []);

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);

    // Fetch available slots for tomorrow
    if (clinicData) {
      fetchAvailableSlots(tomorrow);
    }
  }, [clinicData]);

  // Fetch available slots for the selected date
  const fetchAvailableSlots = async (date) => {
    setLoading(true);
    setSelectedSlot(null); // Reset selected slot when date changes

    try {
      // Format date as YYYY-MM-DD for API request
      const formattedDate = format(date, "yyyy-MM-dd");

      // Make API request to get available slots
      const response = await axios.get(
        `${apiUrl}/api/v/appointments/available-slots`,
        {
          params: {
            clinicId: clinicId,
            doctorId: doctorId || clinicData?.doctor?._id,
            date: formattedDate,
          },
          headers: {
            Authorization: `Bearer ${UserData?.authToken}`,
          },
        }
      );
      // console.log(response.data);

      if (response.data.success) {
        // Transform API response into the format expected by the UI
        const slots = response.data.data.map((timeString, index) => {
          // Parse the time string (format: "HH:MM")
          const [hours, minutes] = timeString.split(":").map(Number);

          // Calculate time in minutes for comparison
          const timeInMinutes = hours * 60 + minutes;

          // Format time for display (12-hour format with AM/PM)
          const period = hours >= 12 ? "PM" : "AM";
          const displayHour = hours % 12 || 12;
          const displayTime = `${displayHour}:${minutes
            .toString()
            .padStart(2, "0")} ${period}`;

          return {
            id: `slot-${index}`,
            time: displayTime,
            available: true,
            startMinutes: timeInMinutes,
            endMinutes: timeInMinutes + 30, // Assuming 30-minute slots
          };
        });

        // Use filterAvailableSlots to filter out past slots
        const filteredSlots = filterAvailableSlots(slots, date);
        setAvailableSlots(filteredSlots);
      } else {
        // If API returns an error or no slots
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error(
        "Error fetching available slots:",
        error.response?.data || error.message
      );
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const onDismissCalendar = () => {
    setCalendarVisible(false);
  };

  const onSelectDate = (day) => {
    const selectedDate = new Date(day.dateString);
    setCalendarVisible(false);
    setSelectedDate(selectedDate);
    fetchAvailableSlots(selectedDate);
  };

  const handleBookAppointment = async () => {
    console.log("Booking appointment");
    if (!selectedDate || !selectedSlot || !clinicData) {
      alert("Please select both date and time slot");
      return;
    }

    if (!selectedService) {
      alert("Please select a service");
      return;
    }

    setLoading(true);
    try {
      // Prepare appointment data
      const appointmentData = {
        clinicId,
        doctorId: doctorId || clinicData?.doctor?._id,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedSlot.time,
        serviceId: selectedService._id,
        notes: "", // Optional notes
      };

      console.log("Booking appointment:", appointmentData);

      // Make API call to book appointment
      const response = await axios.post(
        `${apiUrl}/api/v/appointments/book`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${UserData?.authToken}`,
          },
        }
      );

      if (response.data.success) {
        // Navigate to success screen with appointment details
        router.replace({
          pathname: "/appointments/success",
          params: {
            appointmentId: response.data.data._id,
            clinicName: clinicData.name,
            doctorName: clinicData.doctor.name,
            date: format(selectedDate, "EEEE, MMMM d, yyyy"),
            time: selectedSlot.time,
          },
        });
      } else {
        // Navigate to failure screen with error message
        router.push({
          pathname: "/appointments/failure",
          params: {
            message: response.data.message || "Failed to book appointment",
          },
        });
      }
    } catch (error) {
      console.error(
        "Error booking appointment:",
        error.response?.data || error.message
      );

      // Check if the error is due to an existing appointment (409 Conflict)
      if (
        error.response?.status === 409 ||
        (error.response?.data?.errors &&
          error.response?.data?.errors[0]?.msg?.includes(
            "time slot is already booked"
          ))
      ) {
        // Show toast notification instead of navigating to failure screen
        setToast({
          visible: true,
          message:
            (error.response?.data?.errors &&
              error.response?.data?.errors[0]?.msg) ||
            "This time slot is already booked. Please select another time.",
          type: "error",
        });
      } else {
        // For other errors, navigate to failure screen with error message
        router.push({
          pathname: "/appointments/failure",
          params: {
            message:
              (error.response?.data?.errors &&
                error.response?.data?.errors[0]?.msg) ||
              "Failed to book appointment. Please try again.",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!clinicData) {
    return (
      <SafeAreaView className="flex-1 bg-white-100 justify-center items-center">
        <Text className="font-pbold text-lg">Clinic not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-secondary-300 px-6 py-2 rounded-lg"
        >
          <Text className="text-white-100 font-ossemibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // console.log("clinicData", clinicData.services);

  return (
    <SafeAreaView
      className="flex-1 bg-white-100"
      edges={["top", "left", "right"]}
    >
      <Appbar.Header
        className="bg-transparent"
        statusBarHeight={0}
        mode="center-aligned"
      >
        <Appbar.BackAction
          onPress={() => router.back()}
          color={colors.blueishGreen?.[400] || colors.secondary[400]}
        />
        <Appbar.Content
          title="Book Appointment"
          titleStyle={{
            fontFamily: "OpenSans-Bold",
            fontSize: 20,
            color: colors.blueishGreen?.[400] || colors.secondary[400],
          }}
        />
      </Appbar.Header>

      <View className="flex-1">
        <ScrollView className="flex-1 px-4">
          {/* Clinic Info Card */}

          <GradientCard
            variant={"secondary"}
            style={{ marginBottom: 16 }}
            contentStyle={{ padding: 16 }}
            animationProps={{
              from: { opacity: 0, translateY: 10 },
              animate: { opacity: 1, translateY: 0 },
              transition: { type: "timing", duration: 500 },
            }}
            className=" shadow-xl shadow-secondary-300 "
          >
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 rounded-full bg-secondary-100 items-center justify-center mr-3">
                {/* <Text className="font-pbold text-lg text-secondary-300">
                  {clinicData?.name?.charAt(0) || "C"}
                </Text> */}
                <Image
                  source={{ uri: clinicData?.images[0] }}
                  contentFit="cover"
                  className="w-10 h-10 rounded-full"
                />
              </View>
              <View className="flex-1">
                <Text className="font-pbold text-xl text-white-200 leading-6">
                  {clinicData?.name}
                </Text>
                <Text className="font-osregular text-sm text-white-300">
                  Dr. {clinicData?.doctor?.name}
                </Text>
              </View>
            </View>
            <Text className="font-osregular text-sm text-white-300 mb-2">
              {clinicData?.address}, {clinicData?.city}
            </Text>

            {clinicData?.specializations?.length > 0 && (
              <View className="flex-row flex-wrap mt-1">
                {clinicData.specializations.map((spec, idx) => (
                  <CustomChip key={idx} spec={spec} compact={true} />
                ))}
              </View>
            )}
          </GradientCard>

          {/* Date Selection - Using DateSelector component */}
          <DateSelector
            selectedDate={selectedDate}
            onPress={() => setCalendarVisible(true)}
            formatDate={formatDate}
          />

          {/* Time Slots */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 200 }}
          >
            <Text className="font-pbold text-lg text-black-800 mb-2">
              Available Time Slots
            </Text>

            {loading ? (
              <View className="bg-white-300 rounded-xl p-6 shadow-sm mb-6 items-center border border-secondary-100/20">
                <ActivityIndicator size="small" color={colors.secondary[300]} />
                <Text className="font-osregular text-md text-black-600 mt-2">
                  Loading available slots...
                </Text>
              </View>
            ) : availableSlots.length === 0 ? (
              <NoSlotsAvailable message="No slots available for this date" />
            ) : (
              <View className="mb-6">
                {/* Morning slots - Using TimeSlotGroup component */}
                <TimeSlotGroup
                  title="Morning"
                  icon="weather-sunny"
                  slots={groupedSlots.morning}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />

                {/* Afternoon slots - Using TimeSlotGroup component */}
                <TimeSlotGroup
                  title="Afternoon"
                  icon="weather-partly-cloudy"
                  slots={groupedSlots.afternoon}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />

                {/* Evening slots - Using TimeSlotGroup component */}
                <TimeSlotGroup
                  title="Evening"
                  icon="weather-night"
                  slots={groupedSlots.evening}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
              </View>
            )}
          </MotiView>

          {/* Service Selection */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 300 }}
            className="mb-6"
          >
            <Text className="font-pbold text-lg text-black-800 mb-2">
              Select Service
            </Text>
            <View className="bg-white-300 rounded-xl p-4 shadow-sm border border-secondary-100/20">
              {clinicData?.services?.length > 0 ? (
                <ScrollView
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  style={{ maxHeight: 300 }}
                >
                  {clinicData.services.map((service) => (
                    <TouchableOpacity
                      key={service._id}
                      onPress={() => setSelectedService(service)}
                      className={`border rounded-lg p-3 mb-2 ${
                        selectedService?._id === service._id
                          ? "border-secondary-300 bg-secondary-100/20"
                          : "border-white-200"
                      }`}
                    >
                      <View className="flex-row justify-between">
                        <View className="flex-1">
                          <Text className="font-ossemibold text-black-800">
                            {service.name}
                          </Text>
                          {service.description && (
                            <Text className="font-osregular text-sm text-black-600 mt-1">
                              {service.description}
                            </Text>
                          )}
                          <View className="flex-row mt-2">
                            {service.duration && (
                              <View className="bg-secondary-100/70 px-2 py-1 rounded-md mr-2">
                                <Text className="font-osregular text-xs text-secondary-300">
                                  {service.duration} min
                                </Text>
                              </View>
                            )}
                            {service.category && (
                              <View className="bg-secondary-100/70 px-2 py-1 rounded-md">
                                <Text className="font-osregular text-xs text-secondary-300">
                                  {service.category}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <Text className="font-pbold text-lg text-secondary-400 mx-2">
                          ₹{service.price}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <Text className="font-osregular text-center text-black-600 py-4">
                  No services available for this clinic
                </Text>
              )}
            </View>
          </MotiView>
        </ScrollView>

        {/* Book Button - Fixed to bottom with improved UI */}
        <View className="px-4 py-3 border-t border-white-200 bg-white-100">
          {(selectedSlot || selectedService) && (
            <View className="mb-3 px-2">
              <View className="mb-2">
                <Text className="font-osregular text-black-600 mb-1">
                  Selected Time:
                </Text>
                {selectedSlot ? (
                  <View className="bg-secondary-100/30 px-3 py-1 rounded-lg">
                    <Text className="font-ossemibold text-secondary-400">
                      {selectedDate ? format(selectedDate, "MMM d") : ""} •{" "}
                      {selectedSlot.time}
                    </Text>
                  </View>
                ) : (
                  <Text className="font-osregular text-black-600/50 italic">
                    No time slot selected
                  </Text>
                )}
              </View>

              <View>
                <Text className="font-osregular text-black-600 mb-1">
                  Selected Service:
                </Text>
                {selectedService ? (
                  <View className="bg-secondary-100/30 px-3 py-1 rounded-lg">
                    <Text className="font-ossemibold text-secondary-400">
                      {selectedService.name}
                    </Text>
                  </View>
                ) : (
                  <Text className="font-osregular text-black-600/50 italic">
                    No service selected
                  </Text>
                )}
              </View>
            </View>
          )}

          <CustomBtn
            useGradient
            title="Confirm Booking"
            iconName="calendar-check"
            className="rounded-xl"
            handlePress={handleBookAppointment}
            disabled={
              !selectedDate || !selectedSlot || !selectedService || loading
            }
            loading={loading}
          />
        </View>
      </View>

      {/* Calendar Modal */}
      <Portal>
        <Modal
          visible={calendarVisible}
          onDismiss={onDismissCalendar}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            margin: 20,
            borderRadius: 16,
            elevation: 5,
          }}
        >
          <View className="mb-4">
            <View className="flex-row justify-center mb-4 gap-1">
              <Icon source="calendar-month" size={24} color="#4A90E2" />
              <Text className="font-pbold text-lg text-black-800">
                Select Appointment Date
              </Text>
            </View>

            <Calendar
              minDate={format(new Date(), "yyyy-MM-dd")}
              maxDate={format(addDays(new Date(), 30), "yyyy-MM-dd")}
              onDayPress={onSelectDate}
              markedDates={{
                [selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""]: {
                  selected: true,
                  selectedColor: "#4A90E2",
                },
              }}
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
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#4A90E2",
                selectedDotColor: "#ffffff",
                disabledArrowColor: "#d9e1e8",
                monthTextColor: "#4A90E2",
              }}
            />

            {selectedDate && (
              <View className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <Text className="font-ossemibold text-black-800 text-center">
                  Selected: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={onDismissCalendar}
              className="flex-1 bg-gray-200 py-3 rounded-xl items-center"
            >
              <Text className="font-ossemibold text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (selectedDate) {
                  onDismissCalendar();
                  fetchAvailableSlots(selectedDate);
                }
              }}
              className="flex-1 bg-blue-500 py-3 rounded-xl items-center"
              disabled={!selectedDate}
            >
              <Text className="font-ossemibold text-white-100">Confirm</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default BookAppointmentScreen;
