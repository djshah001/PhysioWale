import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Chip } from "react-native-paper";
import { router } from "expo-router";
import { cssInterop } from "nativewind";
import axios from "axios";
import { apiUrl } from "../../components/Utility/Repeatables";
import { useUserDataState, useToastSate } from "../../atoms/store";
import AppointmentCard from "../../components/Appointments/AppointmentCard";
import EmptyAppointments from "../../components/Appointments/EmptyAppointments";

import { StatusBar } from "expo-status-bar";
import colors from "../../constants/colors";

cssInterop(Appbar, { className: "style" });

const MyAppointmentsScreen = () => {
  const [UserData, setUserData] = useUserDataState();
  const [, setToast] = useToastSate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

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
        setAppointments(response.data.data);
        filterAppointments(response.data.data, activeFilter);
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
          "Failed to fetch appointments. Please try again.",
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
      { label: "All", value: "all" },
      { label: "Upcoming", value: "confirmed" },
      { label: "Pending", value: "pending" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="mb-4 "
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
              // height: 32,
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
    <SafeAreaView className="flex-1 bg-white-100">
      <Appbar.Header
        className="bg-transparent"
        statusBarHeight={0}
        mode="center-aligned"
      >
        <Appbar.BackAction onPress={() => router.back()} color="#4A90E2" />
        <Appbar.Content
          title="My Appointments"
          titleStyle={{
            fontFamily: "OpenSans-Bold",
            fontSize: 20,
            color: "#4A90E2",
          }}
        />
      </Appbar.Header>

      <View>{renderFilterChips()}</View>
      <View className="flex-1">
        {loading && !refreshing ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text className="mt-4 font-osregular text-black-300">
              Loading your appointments...
            </Text>
          </View>
        ) : filteredAppointments.length === 0 ? (
          <EmptyAppointments />
        ) : (
          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#4A90E2"]}
              />
            }
          >
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancelSuccess={fetchAppointments}
              />
            ))}
            <View className="h-20" />
          </ScrollView>
        )}
      </View>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default MyAppointmentsScreen;
