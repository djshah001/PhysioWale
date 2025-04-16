import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Chip, Divider } from "react-native-paper";
import { router } from "expo-router";
import { cssInterop } from "nativewind";
import axios from "axios";
import { apiUrl } from "../../components/Utility/Repeatables";
import { useUserDataState, useToastSate } from "../../atoms/store";
import AppointmentCard from "../../components/Appointments/AppointmentCard";
import EmptyAppointments from "../../components/Appointments/EmptyAppointments";
import AppointmentAnalytics from "../../components/Appointments/AppointmentAnalytics";
import ScreenTransition from "../../components/Utility/ScreenTransition";
import { StatusBar } from "expo-status-bar";
import colors from "../../constants/colors";

cssInterop(Appbar, { className: "style" });

const AppointmentHistoryScreen = () => {
  const [UserData] = useUserDataState();
  const [, setToast] = useToastSate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("completed");
  const [showAnalytics, setShowAnalytics] = useState(true);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v/appointments/my-appointments`,
        {
          headers: {
            Authorization: `Bearer ${UserData?.authToken}`,
          },
        }
      );

      if (response.data.success) {
        // Get all appointments
        const allAppointments = response.data.data;
        
        // Filter to only include completed, cancelled, or expired appointments
        const historyAppointments = allAppointments.filter(
          (appointment) =>
            appointment.status === "completed" ||
            appointment.status === "cancelled" ||
            appointment.status === "expired"
        );
        
        setAppointments(historyAppointments);
        filterAppointments(historyAppointments, activeFilter);
      }
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error.response?.data || error.message
      );
      setToast({
        visible: true,
        message:
          (error.response?.data?.errors &&
            error.response?.data?.errors[0]?.msg) ||
          "Failed to fetch appointment history. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [UserData?.authToken, activeFilter]);

  const filterAppointments = (appointmentsData, filter) => {
    if (filter === "all") {
      setFilteredAppointments(appointmentsData);
    } else {
      setFilteredAppointments(
        appointmentsData.filter((appointment) => appointment.status === filter)
      );
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    filterAppointments(appointments, filter);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const renderFilterChips = () => {
    const filters = [
      { label: "All History", value: "all" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
      { label: "Expired", value: "expired" },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="mb-4"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {filters.map((filter) => (
          <Chip
            elevated
            key={filter.value}
            selected={activeFilter === filter.value}
            onPress={() => handleFilterChange(filter.value)}
            style={{
              marginRight: 8,
              marginBottom: 4,
              backgroundColor:
                activeFilter === filter.value
                  ? colors.accent["DEFAULT"]
                  : "#F5F5F5",
            }}
            textStyle={{
              color: activeFilter === filter.value ? "#FFFFFF" : "#333333",
              fontFamily: "OpenSans-SemiBold",
              fontSize: 12,
            }}
          >
            {filter.label}
          </Chip>
        ))}
      </ScrollView>
    );
  };

  return (
    <ScreenTransition>
      <SafeAreaView className="flex-1 bg-white-100" edges={['top', 'left', 'right']}>
        <Appbar.Header
          className="bg-transparent"
          statusBarHeight={0}
          mode="center-aligned"
        >
          <Appbar.BackAction onPress={() => router.back()} color="#4A90E2" />
          <Appbar.Content
            title="Appointment History"
            titleStyle={{
              fontFamily: "OpenSans-Bold",
              fontSize: 20,
              color: "#4A90E2",
            }}
          />
          <Appbar.Action
            icon={showAnalytics ? "chart-bar" : "chart-bar-stacked"}
            color="#4A90E2"
            onPress={() => setShowAnalytics(!showAnalytics)}
          />
        </Appbar.Header>

        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4A90E2"]}
            />
          }
        >
          {/* Analytics Section */}
          {showAnalytics && <AppointmentAnalytics />}

          {/* Filter Chips */}
          <View className="mt-2">
            {renderFilterChips()}
          </View>

          {/* Appointments List */}
          <View className="flex-1 px-4">
            {loading && !refreshing ? (
              <View className="py-8 justify-center items-center">
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text className="mt-4 font-osregular text-black-300">
                  Loading your appointment history...
                </Text>
              </View>
            ) : filteredAppointments.length === 0 ? (
              <View className="py-8">
                <EmptyAppointments message="No appointment history found for the selected filter." />
              </View>
            ) : (
              <View>
                <Text className="font-ossemibold text-black-400 mb-2">
                  {filteredAppointments.length} {filteredAppointments.length === 1 ? 'appointment' : 'appointments'} found
                </Text>
                
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onCancelSuccess={fetchAppointments}
                  />
                ))}
                <View className="h-20" />
              </View>
            )}
          </View>
        </ScrollView>

        <StatusBar style="dark" />
      </SafeAreaView>
    </ScreenTransition>
  );
};

export default AppointmentHistoryScreen;
