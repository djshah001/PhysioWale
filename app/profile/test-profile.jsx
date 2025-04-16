import { View, Text, ScrollView, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserDataState, useToastSate } from '../../atoms/store';
import { apiUrl } from '../../components/Utility/Repeatables';

const TestProfile = () => {
  const [userData, setUserData] = useUserDataState();
  const [setToast] = useToastSate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [bmiData, setBmiData] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${apiUrl}/api/v/users/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        setProfileData(response.data.data);
        setToast({
          message: 'Profile fetched successfully',
          visible: true,
          type: 'success',
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error.response?.data || error);
      setToast({
        message: 'Failed to fetch profile',
        visible: true,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBMI = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${apiUrl}/api/v/users/bmi`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.success) {
        setBmiData(response.data.data);
        setToast({
          message: 'BMI calculated successfully',
          visible: true,
          type: 'success',
        });
      }
    } catch (error) {
      console.error('BMI calculation error:', error.response?.data || error);
      setToast({
        message: 'Failed to calculate BMI',
        visible: true,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: 'Test Profile API',
          headerTitleStyle: {
            fontFamily: 'Poppins-Medium',
          },
        }}
      />
      <ScrollView className="flex-1 p-4">
        <Text className="text-xl font-pbold mb-4">Profile API Test</Text>
        
        <View className="mb-6">
          <Button 
            title={loading ? "Loading..." : "Fetch Profile"} 
            onPress={fetchProfile}
            disabled={loading}
          />
        </View>
        
        {profileData && (
          <View className="mb-6 p-4 bg-gray-100 rounded-lg">
            <Text className="font-pbold mb-2">Profile Data:</Text>
            <Text>Name: {profileData.name}</Text>
            <Text>Email: {profileData.email || 'Not set'}</Text>
            <Text>Phone: {profileData.phoneNumber || 'Not set'}</Text>
            <Text>Age: {profileData.age || 'Not set'}</Text>
            <Text>Gender: {profileData.gender || 'Not set'}</Text>
            <Text>Height: {profileData.height ? `${profileData.height} cm` : 'Not set'}</Text>
            <Text>Weight: {profileData.weight ? `${profileData.weight} kg` : 'Not set'}</Text>
          </View>
        )}
        
        <View className="mb-6">
          <Button 
            title={loading ? "Loading..." : "Calculate BMI"} 
            onPress={fetchBMI}
            disabled={loading}
          />
        </View>
        
        {bmiData && (
          <View className="mb-6 p-4 bg-gray-100 rounded-lg">
            <Text className="font-pbold mb-2">BMI Data:</Text>
            <Text>BMI: {bmiData.bmi}</Text>
            <Text>Category: {bmiData.category}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestProfile;
