import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import useLoadingAndDialog from "../../components/Utility/useLoadingAndDialog";
import {
  ActivityIndicator,
  Appbar,
  Card,
  Divider,
  Icon,
  ProgressBar,
  Surface,
} from "react-native-paper";
import colors from "../../constants/colors";
import CustomBtn from "./../../components/CustomBtn.jsx";
import { useToastSate, useUserDataState } from "./../../atoms/store";
import { apiUrl } from "../../components/Utility/Repeatables";
import { cssInterop } from "nativewind";

cssInterop(Appbar.Header, {
  className: { target: "style" },
});

cssInterop(Card, {
  className: { target: "style" },
});

cssInterop(Card.Content, {
  className: { target: "style" },
});

const ResultScreen = () => {
  const [UserData] = useUserDataState();
  const { resultId } = useLocalSearchParams();
  const [result, setResult] = useState(null);
  const { IsLoading, setIsLoading } = useLoadingAndDialog();
  const [setToast] = useToastSate();

  useEffect(() => {
    if (resultId) {
      fetchResult();
    }
  }, [resultId]);

  const fetchResult = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v/self-test/results/${resultId}`,
        {
          headers: {
            Authorization: `Bearer ${UserData?.authToken}`,
          },
        }
      );
      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching result:", error.response?.data || error);
      setToast({
        message:
          error.response?.data?.errors?.[0]?.msg || "Failed to fetch result",
        visible: true,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Low":
        return "#4CAF50"; // Green
      case "Moderate":
        return "#FFC107"; // Yellow
      case "High":
        return "#FF9800"; // Orange
      case "Severe":
        return "#F44336"; // Red
      default:
        return "#9E9E9E"; // Grey
    }
  };

  return (
    <SafeAreaView className="h-full bg-white-300">
      <Appbar.Header mode="center-aligned" className="mt-[-25px] bg-white-300">
        <Appbar.BackAction
          onPress={() => {
            router.back();
          }}
        />
        <Appbar.Content
          title={
            <Text className="text-xl font-psemibold text-black-200">
              Test Result
            </Text>
          }
        />
      </Appbar.Header>

      {IsLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.accent["DEFAULT"]} />
          <Text className="mt-4 font-pmedium text-gray-600">
            Loading results...
          </Text>
        </View>
      ) : result ? (
        <ScrollView className="flex-1 px-4">
          {/* Result Summary Card */}
          <Card className="mb-4 rounded-xl overflow-hidden">
            <Card.Content className="p-4">
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 rounded-full bg-secondary-200 items-center justify-center mr-3">
                  <Icon
                    source="check-circle"
                    size={28}
                    color="#FFFFFF"
                    // style={{ margin: 0 }}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-pbold text-black-300">
                    {result.categoryId?.name || "Self Test"}
                  </Text>
                  <Text className="text-sm font-pregular text-gray-600">
                    Assessment completed
                  </Text>
                </View>
              </View>

              <Text className="text-base font-pregular mb-4 text-gray-700">
                {result.categoryId?.description || "Test result analysis"}
              </Text>

              {/* Score Section */}
              <View className="bg-white-100 p-4 rounded-xl shadow-sm mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="font-pmedium text-gray-700">Your Score</Text>
                  <Text className="font-pbold text-lg">
                    {result.totalScore} / {result.maxPossibleScore}
                  </Text>
                </View>
                <ProgressBar
                  progress={
                    result.percentage && !isNaN(result.percentage)
                      ? Math.min(result.percentage / 100, 1)
                      : 0
                  }
                  color={getSeverityColor(result.severity)}
                  className="h-3 rounded-full mb-2"
                />
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="font-pregular text-sm text-gray-600">
                    {result.percentage && !isNaN(result.percentage)
                      ? result.percentage.toFixed(1)
                      : "0"}
                    %
                  </Text>
                  <View className="flex-row items-center">
                    <View
                      className="w-3 h-3 rounded-full mr-1"
                      style={{
                        backgroundColor: getSeverityColor(result.severity),
                      }}
                    />
                    <Text
                      className="font-pmedium text-sm"
                      style={{ color: getSeverityColor(result.severity) }}
                    >
                      {result.severity} Severity
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Answers Section */}
          <Card className="mb-4 rounded-xl overflow-hidden">
            <Card.Content className="p-4">
              <Text className="text-lg font-pbold mb-4 text-black-300">
                Your Answers
              </Text>

              {result.answers.map((answer, index) => (
                <Surface
                  key={index}
                  className="mb-4 rounded-lg overflow-hidden bg-white-100"
                  elevation={1}
                >
                  <View className="p-3">
                    <View className="flex-row mb-2">
                      <View className="w-7 h-7 bg-secondary-200 rounded-full items-center justify-center mr-2">
                        <Text className="font-pbold text-white-100 text-sm">
                          {index + 1}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-pmedium text-black-300">
                          {answer.questionText}
                        </Text>
                      </View>
                    </View>

                    <View className="bg-gray-100 p-3 rounded-lg mt-1">
                      <Text className="font-pregular text-gray-700">
                        <Text className="font-pmedium">Answer: </Text>
                        {Array.isArray(answer.selectedOptions)
                          ? answer.selectedOptions.join(", ")
                          : answer.selectedOptions}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Text className="font-pmedium text-gray-700">
                          Points:{" "}
                        </Text>
                        <View className="bg-secondary-100 px-2 py-1 rounded-full ml-1">
                          <Text className="font-pbold text-secondary-200">
                            {answer.points}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Surface>
              ))}
            </Card.Content>
          </Card>

          <View className="mb-8 flex-row">
            <CustomBtn
              title="Back to Tests"
              iconName="arrow-left"
              iconFirst={true}
              handlePress={() => router.push("/(Self-Test)/Self-Test")}
              className="flex-1"
            />
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center px-4">
          <Icon
            source="alert-circle"
            size={64}
            color={colors.accent["DEFAULT"]}
          />
          <Text className="text-lg font-pmedium text-center mt-4 mb-2">
            No result found
          </Text>
          <Text className="text-sm font-pregular text-center text-gray-600 mb-6">
            The test result you're looking for could not be found. Please try
            again.
          </Text>
          <CustomBtn
            title="Back to Tests"
            iconName="arrow-left"
            iconFirst={true}
            handlePress={() => router.push("/(Self-Test)/Self-Test")}
            className="w-full"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ResultScreen;
