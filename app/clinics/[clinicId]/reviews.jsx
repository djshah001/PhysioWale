import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Icon, Button, Dialog, Portal, FAB } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import axios from "axios";
import { apiUrl } from "../../../components/Utility/Repeatables";
import { useToastSate, useUserDataState } from "../../../atoms/store";
import ReviewForm from "../../../components/Reviews/ReviewForm";
import ReviewsList from "../../../components/Reviews/ReviewsList";
import colors from "../../../constants/colors";
import CustomBtn from "./../../../components/CustomBtn.jsx";

const ClinicReviewsScreen = () => {
  const { clinicId, appointmentId } = useLocalSearchParams();
  const [userData] = useUserDataState();
  const [, setToast] = useToastSate();

  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(
    appointmentId ? true : false
  );
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Fetch clinic details
  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/v/clinics/${clinicId}`);
        if (response.data.success) {
          setClinic(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching clinic details:", error);
        setToast({
          message: "Failed to load clinic details",
          visible: true,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClinicDetails();
  }, [clinicId]);

  // Check if user has already reviewed this clinic
  useEffect(() => {
    const checkUserReview = async () => {
      if (!userData?.authToken && !userData?.token) return;

      try {
        const response = await axios.get(
          `${apiUrl}/api/v/reviews/user/clinic/${clinicId}`,
          {
            headers: {
              Authorization: `Bearer ${userData?.authToken || userData?.token}`,
            },
          }
        );

        if (response.data.success) {
          setUserReview(response.data.data);
        }
      } catch (error) {
        // 404 means user hasn't reviewed yet, which is fine
        if (error.response?.status !== 404) {
          console.error("Error checking user review:", error);
        }
      }
    };

    checkUserReview();
  }, [clinicId, userData]);

  const handleWriteReview = () => {
    if (!userData?.authToken && !userData?.token) {
      setShowLoginDialog(true);
      return;
    }

    setShowReviewForm(true);
  };

  const handleReviewSubmitted = (review) => {
    setUserReview(review);
    setShowReviewForm(false);

    // Refresh the reviews list
    // This would be handled by the ReviewsList component's refresh mechanism
  };

  return (
    <View className="flex-1 bg-white-300">
      {/* Header */}
      <LinearGradient
        colors={colors.gradients.secondary2}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Appbar.Header
          className="bg-transparent"
          style={{ backgroundColor: "transparent" }}
          mode="center-aligned"
        >
          <Appbar.BackAction
            onPress={() => router.back()}
            color={colors.white[200]}
          />
          <Appbar.Content
            title="Clinic Reviews"
            titleStyle={{
              color: colors.white[200],
              fontFamily: "Poppins-SemiBold",
            }}
          />
        </Appbar.Header>

        {/* Clinic Info */}
        {clinic && (
          <View className="px-4 pb-4">
            <Text className="text-white-200 text-xl font-pbold">
              {clinic.name}
            </Text>
            <View className="flex-row items-center mt-1">
              {/* <Icon source="map-marker" size={16} color={colors.white[300]} /> */}
              <Text className="text-white-300 text-sm ml-1 font-osregular">
                {clinic.address}, {clinic.city}
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Review Form */}
        {showReviewForm && (
          <View className="mb-4">
            <ReviewForm
              clinicId={clinicId}
              appointmentId={appointmentId}
              existingReview={userReview}
              onReviewSubmitted={handleReviewSubmitted}
            />
            <CustomBtn
              title="Cancel"
              handlePress={() => setShowReviewForm(false)}
              className="rounded-xl"
              // variant="outlined"
              useGradient
              gradientColors={colors.gradients.error}
              iconName="close"
              iconPosition="left"
              borderColor={colors.error}
              // textColor={colors.error}
            />
          </View>
        )}

        {/* Reviews List */}
        <ReviewsList clinicId={clinicId} />
      </ScrollView>

      {/* Floating Action Button for writing review */}
      {!showReviewForm && (
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            borderRadius: 28,
            overflow: "hidden",
            elevation: 4,
          }}
        >
          <LinearGradient
            colors={
              userReview ? colors.gradients.secondary : colors.gradients.secondary2
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <FAB
              icon="pencil"
              label={userReview ? "Edit Review" : "Write Review"}
              color={colors.white[400]}
              style={{
                // backgroundColor: colors.accent['DEFAULT'],
                backgroundColor:'transparent',
              }}
              onPress={handleWriteReview}
              elevation={0}
              mode="flat"
            />
          </LinearGradient>
        </MotiView>
      )}

      {/* Login Dialog */}
      <Portal>
        <Dialog
          visible={showLoginDialog}
          onDismiss={() => setShowLoginDialog(false)}
          style={{ borderRadius: 16, backgroundColor: colors.white[400] }}
        >
          <View
            style={{
              backgroundColor: colors.accent[50],
              padding: 8,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Dialog.Title
              style={{
                color: colors.accent[700],
                fontFamily: "Poppins-SemiBold",
              }}
            >
              Login Required
            </Dialog.Title>
          </View>
          <Dialog.Content>
            <View className="flex-row items-center mt-4">
              <Icon
                source="information"
                size={24}
                color={colors.accent[500]}
                style={{ marginRight: 8 }}
              />
              <Text className="text-gray-700 font-osregular">
                You need to be logged in to write a review.
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setShowLoginDialog(false)}
              textColor={colors.gray[600]}
            >
              Cancel
            </Button>
            <LinearGradient
              colors={colors.gradients.accent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 20, overflow: "hidden" }}
            >
              <Button
                onPress={() => {
                  setShowLoginDialog(false);
                  router.push("/sign-in");
                }}
                textColor={colors.white[400]}
              >
                Login
              </Button>
            </LinearGradient>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default ClinicReviewsScreen;
