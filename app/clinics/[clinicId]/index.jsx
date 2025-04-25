import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { router, useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";
import { Appbar, Icon, IconButton, Chip, List } from "react-native-paper";
import { cssInterop } from "nativewind";
import { StatusBar } from "expo-status-bar";
import colors from "../../../constants/colors";
import Animated from "react-native-reanimated";
import { useClinicsState, useToastSate } from "../../../atoms/store";
import { MotiView, MotiText } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { blurhash } from "../../../components/Utility/Repeatables";
import InfoCard from "../../../components/Clinic/InfoCard";
import ImageCarousel from "../../../components/Clinic/ImageCarousel";
import ClinicTimingSheet from "../../../components/Clinic/ClinicTimingSheet";
import {
  getFacilityIcon,
  getServiceIcon,
} from "../../../components/Utility/iconHelpers";
import CustomBtn from "../../../components/CustomBtn";
import { CustomChip } from "../../../components/ReUsables/CustomChip";

cssInterop(Appbar, { className: "style" });
cssInterop(Icon, { className: "style" });

const ClinicScreen = () => {
  const { id, distance } = useLocalSearchParams();
  const [Clinics, setClinics] = useClinicsState();
  const [toast, setToast] = useToastSate();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTimingSheet, setShowTimingSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Memoize clinic data to prevent unnecessary re-renders
  const ClinicData = useMemo(() => {
    if (!Array.isArray(Clinics) || !id) return null;
    return Clinics.find((clinic) => clinic._id === id) || null;
  }, [Clinics, id]);

  // Get current day for timing display
  const today = useMemo(
    () => new Date().toLocaleString("en-us", { weekday: "long" }).toLowerCase(),
    []
  );

  // Format timing display
  const timingDisplay = useMemo(() => {
    if (!ClinicData) return "Not available";

    if (ClinicData.open24hrs) return "Open 24 Hours";

    if (
      !ClinicData.timing ||
      !ClinicData.timing[today] ||
      ClinicData.timing[today].isClosed
    ) {
      return "Closed Today";
    }

    const opening = ClinicData.timing[today].opening
      ?.replace("pm", "AM")
      ?.replace("am", "AM");
    const closing = ClinicData.timing[today].closing
      ?.replace("pm", "PM")
      ?.replace("am", "AM");

    return `${opening} - ${closing}`;
  }, [ClinicData, today]);

  // Handle opening maps for directions
  const openMaps = useCallback(() => {
    if (!ClinicData?.location?.coordinates) return;

    const [longitude, latitude] = ClinicData.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  }, [ClinicData?.location?.coordinates]);

  // Handle phone call
  const makePhoneCall = useCallback(() => {
    if (!ClinicData?.phoneNumber) return;
    Linking.openURL(`tel:${ClinicData.phoneNumber}`);
  }, [ClinicData?.phoneNumber]);

  // Toggle favorite
  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
    setToast({
      message: isFavorite ? "Removed from favorites" : "Added to favorites",
      visible: true,
      type: "success",
    });
  }, [isFavorite, setToast]);

  // Scroll to section
  const scrollToSection = useCallback((yOffset) => {
    scrollRef.current?.scrollTo({ y: yOffset, animated: true });
  }, []);

  // Loading state
  // if (isLoading) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-white-300">
  //       <ActivityIndicator size="large" color={colors.secondary[300]} />
  //       <Text className="text-lg font-pbold mt-4 text-black-600">
  //         Loading clinic details...
  //       </Text>
  //     </View>
  //   );
  // }

  // Error state
  if (!ClinicData) {
    return (
      <View className="flex-1 justify-center items-center bg-white-300">
        <Icon
          source="hospital-building"
          size={80}
          color={colors.secondary[200]}
        />
        <Text className="text-xl font-pbold mt-4 text-black-600">
          Clinic not found
        </Text>
        <Text className="text-sm font-osregular text-black-600 mt-2 mb-6 text-center px-8">
          The clinic you're looking for doesn't exist or has been removed.
        </Text>
        <TouchableOpacity
          className="mt-4 bg-secondary-300 px-6 py-3 rounded-xl shadow-md"
          onPress={() => router.back()}
        >
          <Text className="text-white-100 font-pbold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // console.log(ClinicData.services);

  return (
    <View className="flex-1 bg-white-300">
      <StatusBar style="light" />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header with back button and favorite button */}
        <Appbar.Header
          className="absolute top-6 bg-transparent z-50 w-full flex justify-between px-4 mt-1"
          statusBarHeight={0}
          safeAreaInsets={{ top: 0, bottom: 0 }}
          mode="center-aligned"
        >
          <BlurView
            intensity={80}
            tint="systemChromeMaterial"
            experimentalBlurMethod="dimezisBlurView"
            className="rounded-full overflow-hidden shadow-lg shadow-black-100"
          >
            <Appbar.BackAction
              icon="chevron-left"
              size={24}
              onPress={() => router.back()}
              color={colors.blueishGreen[400]}
            />
          </BlurView>
          <BlurView
            intensity={80}
            tint="systemChromeMaterialLight"
            experimentalBlurMethod="dimezisBlurView"
            className="rounded-full overflow-hidden shadow-lg shadow-black-100"
          >
            <IconButton
              icon={isFavorite ? "heart" : "heart-outline"}
              onPress={toggleFavorite}
              iconColor={isFavorite ? colors.accent.DEFAULT : undefined}
            />
          </BlurView>
        </Appbar.Header>

        {/* Image Carousel */}
        <ImageCarousel images={ClinicData?.images || []} />

        {/* Clinic Info Header */}
        <BlurView
          intensity={70}
          tint="systemChromeMaterialLight"
          experimentalBlurMethod="dimezisBlurView"
          className="mx-4 px-4 py-4 gap-1 rounded-2xl overflow-hidden -mt-16 mb-4 z-10"
        >
          <MotiText
            from={{ opacity: 0, translateY: 5 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            className="text-2xl font-pbold text-black-800"
          >
            {ClinicData.name}
          </MotiText>

          <MotiView
            from={{ opacity: 0, translateY: 5 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 100 }}
            className="flex-row items-center gap-2"
          >
            <Animated.Image
              source={{ uri: ClinicData.doctor?.profilePic }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
              className="w-10 h-10 rounded-full border-2 border-white-200"
            />
            <Text className="text-md font-ossemibold self-center">
              Dr. {ClinicData.doctor?.name}
            </Text>
          </MotiView>

          {/* Specializations */}
          <MotiView
            from={{ opacity: 0, translateY: 5 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: 200 }}
            className="flex-row flex-wrap gap-1 mt-1"
          >
            {ClinicData.specializations?.slice(0, 3).map((spec, idx) => (
              <CustomChip key={idx} spec={spec} compact={true} />
            ))}
            {ClinicData.specializations?.length > 3 && (
              <CustomChip
                spec={`+${ClinicData.specializations.length - 3} more`}
                compact={true}
              />
            )}
          </MotiView>
        </BlurView>

        {/* Quick Navigation */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400 }}
          className="px-4 mb-4"
        >
          <View className="flex-row justify-around py-3 px-2 bg-white-200 rounded-xl shadow-md">
            <TouchableOpacity
              className="items-center"
              onPress={() => scrollToSection(400)}
            >
              <View className="bg-secondary-100 rounded-full p-2 mb-1">
                <Icon
                  source="medical-bag"
                  size={20}
                  color={colors.secondary[300]}
                />
              </View>
              <Text className="text-xs font-ossemibold text-black-600">
                Services
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => scrollToSection(600)}
            >
              <View className="bg-secondary-100 rounded-full p-2 mb-1">
                <Icon
                  source="hospital-building"
                  size={20}
                  color={colors.secondary[300]}
                />
              </View>
              <Text className="text-xs font-ossemibold text-black-600">
                Facilities
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => setShowTimingSheet(true)}
            >
              <View className="bg-secondary-100 rounded-full p-2 mb-1">
                <Icon
                  source="clock-outline"
                  size={20}
                  color={colors.secondary[300]}
                />
              </View>
              <Text className="text-xs font-ossemibold text-black-600">
                Timings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={openMaps}>
              <View className="bg-secondary-100 rounded-full p-2 mb-1">
                <Icon
                  source="map-marker"
                  size={20}
                  color={colors.secondary[300]}
                />
              </View>
              <Text className="text-xs font-ossemibold text-black-600">
                Directions
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        <MotiView
          from={{
            opacity: 0.8,
            translateY: 20,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            type: "timing",
            duration: 500,
          }}
          className="px-4 gap-2 relative"
        >
          {/* Essential Info Cards */}
          <View className=" flex-row flex-wrap justify-between gap-1 ">
            <InfoCard
              icon="clock"
              title="Today"
              value={timingDisplay}
              onPress={() => setShowTimingSheet(true)}
              // otherStyles={"w-1/2"}
            />

            <InfoCard
              icon="map-marker-distance"
              title="Distance"
              value={`${distance || "N/A"} km`}
              // otherStyles={'w-1/2'}
            />

            <InfoCard
              icon="phone"
              title="Contact"
              value={ClinicData.phoneNumber || "Not Available"}
              actionIcon="phone"
              onAction={makePhoneCall}
              // otherStyles={"w-1/2"}
            />

            <InfoCard
              icon="star"
              title="Rating"
              value={`${ClinicData.rating?.overall || "New"} (${
                ClinicData.rating?.reviewCount || 0
              })`}
              actionIcon="chevron-right"
              onAction={() => router.push(`/clinics/${id}/reviews`)}
              // otherStyles={'w-1/2'}
            />

            <InfoCard
              icon="map"
              title="Location"
              value="Get Directions"
              subtitle={ClinicData.address}
              otherStyles={"w-full"}
              actionIcon="directions"
              onAction={openMaps}
            />
          </View>

          {/* Services Section */}
          {ClinicData?.services && ClinicData?.services?.length > 0 && (
            <View className="mt-6">
              <View className="flex-row items-center gap-3 mb-4">
                <View className="bg-secondary-300 rounded-full p-3 shadow-lg shadow-secondary-300">
                  <Icon
                    source="medical-bag"
                    size={22}
                    color={colors.white[300]}
                  />
                </View>
                <Text className="text-xl font-pbold text-black-600">
                  Services
                </Text>
              </View>

              <View className="bg-white-200 rounded-2xl shadow-md border border-secondary-100/20 overflow-hidden">
                <List.AccordionGroup>
                  {ClinicData?.services?.map((service, index) => (
                    <MotiView
                      key={index}
                      from={{ opacity: 0, translateY: 10 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      transition={{ delay: index * 100, type: "timing" }}
                    >
                      <List.Accordion
                        id={index.toString()}
                        title={
                          <Text className="text-base font-pbold text-black-600">
                            {service.name}
                          </Text>
                        }
                        description={
                          <View className="flex-row gap-2 items-center">
                            <Text className="text-sm font-pbold text-secondary-300">
                              {service.price > 0 ? `₹${service.price}` : "Free"}
                            </Text>
                            <Text className="text-sm font-pregular text-black-600">
                              {service.duration} min
                            </Text>
                          </View>
                        }
                        left={(props) => (
                          <List.Icon
                            {...props}
                            icon={getServiceIcon(service.name)}
                            color={colors.blueishGreen[400]}
                          />
                        )}
                      >
                        <List.Item
                          title={null}
                          description={() => (
                            <View className="px-4 py-2">
                              <Text className="text-sm font-psemibold text-black-700 leading-5 mb-3">
                                {service.description ||
                                  "No description available for this service."}
                              </Text>

                              {/* Additional service details */}
                              {service.category && (
                                <View className="flex-row mt-1 flex-wrap">
                                  <Chip
                                    mode="outlined"
                                    style={{
                                      marginRight: 8,
                                      marginBottom: 8,
                                      borderColor: colors.secondary[200],
                                    }}
                                    textStyle={{
                                      fontSize: 12,
                                      color: colors.secondary[300],
                                    }}
                                  >
                                    {service.category}
                                  </Chip>
                                </View>
                              )}
                            </View>
                          )}
                          style={{
                            backgroundColor: colors.secondary[150],
                            paddingVertical: 0,
                          }}
                        />
                      </List.Accordion>
                    </MotiView>
                  ))}
                </List.AccordionGroup>
              </View>
            </View>
          )}

          {/* Facilities Section */}
          {ClinicData?.facilities && ClinicData?.facilities?.length > 0 && (
            <View className="mt-6">
              <View className="flex-row items-center gap-3 mb-4">
                <View className="bg-secondary-300 rounded-full p-3 shadow-lg shadow-secondary-300">
                  <Icon
                    source="hospital-building"
                    size={22}
                    color={colors.white[300]}
                  />
                </View>
                <Text className="text-xl font-pbold text-black-600">
                  Facilities
                </Text>
              </View>

              <View className="bg-white-200 rounded-2xl p-5 shadow-md border border-secondary-100/20">
                <View className="flex-row flex-wrap justify-between gap-3 ">
                  {ClinicData?.facilities?.map((facility, index) => (
                    <MotiView
                      key={index}
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 50, type: "spring" }}
                      className="bg-white-200 rounded-xl p-3 shadow-xl border border-secondary-100/10 flex-row items-center  flex-grow "
                      style={{
                        width: "48%",
                      }}
                    >
                      <View
                        className="rounded-full p-2 mr-2"
                        style={{
                          backgroundColor: `${colors.secondary[100]}`,
                        }}
                      >
                        <Icon
                          source={getFacilityIcon(facility)}
                          size={18}
                          color={colors.secondary[300]}
                        />
                      </View>
                      <Text className="text-sm font-ossemibold text-black-600 flex-1 flex-wrap">
                        {facility}
                      </Text>
                    </MotiView>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* About Section */}
          {ClinicData?.description && (
            <View className="mt-6 mb-14">
              <View className="flex-row items-center gap-3 mb-4">
                <View className="bg-secondary-300 rounded-full p-3 shadow-lg shadow-secondary-300">
                  <Icon
                    source="information"
                    size={22}
                    color={colors.white[300]}
                  />
                </View>
                <Text className="text-xl font-pbold text-black-600">
                  About Clinic
                </Text>
              </View>

              <View className="bg-white-200 rounded-2xl p-5 shadow-md border border-secondary-100/20">
                <Text
                  className="text-base font-osregular text-black-600 leading-6"
                  numberOfLines={showFullDescription ? undefined : 3}
                >
                  {ClinicData.description}
                </Text>
                {ClinicData.description.length > 120 && (
                  <TouchableOpacity
                    onPress={() => setShowFullDescription(!showFullDescription)}
                    className="mt-4 self-end"
                  >
                    <Text className="text-secondary-300 font-ossemibold">
                      {showFullDescription ? "Show Less" : "Read More"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </MotiView>
      </ScrollView>

      {/* Floating Action Buttons */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", stiffness: 100, delay: 300 }}
        className="absolute bottom-4 gap-2 flex-row self-center px-4 "
      >
        <CustomBtn
          title="Book Appointment"
          iconName="calendar-check"
          className="rounded-xl flex-1 "
          useGradient
          handlePress={() => {
            const params = {
              clinicId: ClinicData._id,
              doctorId: ClinicData.doctor._id,
            };
            router.push({
              pathname: "/appointments/book",
              params,
            });
          }}
        />

        <CustomBtn
          // title="View Reviews"
          iconName="comment-text-multiple-outline"
          className="rounded-xl"
          variant="outlined"
          borderColor={colors.secondary[300]}
          textColor={colors.secondary[300]}
          handlePress={() => {
            router.push(`/clinics/${id}/reviews`);
          }}
        />
      </MotiView>

      {/* Clinic Timing Sheet */}
      <ClinicTimingSheet
        visible={showTimingSheet}
        onDismiss={() => setShowTimingSheet(false)}
        timings={ClinicData.timing}
        open24hrs={ClinicData.open24hrs}
      />
    </View>
  );
};

export default ClinicScreen;
