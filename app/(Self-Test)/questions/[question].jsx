import {
  View,
  Text,
  ScrollView,
  Button,
  Animated,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import useLoadingAndDialog from "../../../components/Utility/useLoadingAndDialog";
import {
  ActivityIndicator,
  Appbar,
  Checkbox,
  Chip,
  RadioButton,
  ProgressBar,
  Card,
  Surface,
  IconButton,
} from "react-native-paper";
import colors from "../../../constants/colors";
import CustomBtn from "./../../../components/CustomBtn.jsx";
import { useToastSate, useUserDataState } from "./../../../atoms/store";
import { apiUrl } from "../../../components/Utility/Repeatables";
import CustomInput from "../../../components/ReUsables/CustomInput";
import { cssInterop } from "nativewind";
cssInterop(Checkbox.Item, {
  className: { target: "style" },
});
cssInterop(RadioButton.Item, {
  className: { target: "style" },
});
cssInterop(Appbar.Header, {
  className: { target: "style" },
});
cssInterop(Card, {
  className: { target: "style" },
});
cssInterop(Card.Content, {
  className: { target: "style" },
});
cssInterop(Surface, {
  className: { target: "style" },
});
cssInterop(ProgressBar, {
  className: { target: "style" },
});
const QuestionScreen = () => {
  const { categoryId, title } = useLocalSearchParams();
  const [UserData, setUserData] = useUserDataState();

  const [Questions, setQuestions] = useState([]);
  const [CurrentPage, setCurrentPage] = useState(0);
  const QuestionsPerPage = 1; // Changed to 1 question per page for better UX
  const { IsLoading, setIsLoading } = useLoadingAndDialog();
  const [Toast, setToast] = useToastSate(false);

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Get screen dimensions
  const screenWidth = Dimensions.get("window").width;

  const getQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v/self-test/questions/by-category?id=${categoryId}`
      );
      setQuestions(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error.response.data);
    }
    setIsLoading(false);
  };

  // Animation functions
  const animateQuestion = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    getQuestion();
  }, []);

  // Animate when page changes
  useEffect(() => {
    if (Questions.length > 0) {
      animateQuestion();
    }
  }, [CurrentPage, Questions]);

  const [SelectedOptions, setSelectedOptions] = useState({});
  const [ShowResult, setShowResult] = useState(false);

  const handleOptionSelect = (question, option) => {
    setSelectedOptions((prev) => {
      const updatedOptions = { ...prev };
      if (question.answerType === "Text") {
        updatedOptions[question._id] = {
          questionId: question._id,
          selectedOptions: option,
        };
      } else if (question.answerType === "Select One") {
        updatedOptions[question._id] = {
          questionId: question._id,
          selectedOptions: option,
        };
      } else if (question.answerType === "Select Any") {
        if (!updatedOptions[question._id]) {
          updatedOptions[question._id] = {
            questionId: question._id,
            selectedOptions: [],
          };
        }
        const currentOptions = updatedOptions[question._id].selectedOptions;

        if (currentOptions.includes(option)) {
          updatedOptions[question._id].selectedOptions = currentOptions.filter(
            (opt) => opt !== option
          );
        } else {
          updatedOptions[question._id].selectedOptions.push(option);
        }
      }
      return updatedOptions;
    });
  };

  const handleNextPage = () => {
    if ((CurrentPage + 1) * QuestionsPerPage >= Questions.length) {
      // Check if all questions have been answered
      const currentQuestions = Questions.map((q) => q._id);
      const answeredQuestions = Object.keys(SelectedOptions);
      const allAnswered = currentQuestions.every((qId) =>
        answeredQuestions.includes(qId)
      );

      if (allAnswered) {
        setShowResult(true);
      } else {
        setToast({
          message: "Please answer all questions",
          visible: true,
          type: "error",
        });
      }
    } else {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleSubmitResult = async () => {
    try {
      setIsLoading(true);
      // Convert the selected options to the format expected by the API
      const answers = Object.values(SelectedOptions);

      const result = await axios.post(
        `${apiUrl}/api/v/self-test/results`,
        {
          userId: UserData._id,
          categoryId,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${UserData?.authToken}`,
          },
        }
      );

      console.log(result.data)

      if (result.data.success) {
        setToast({
          message: "Test submitted successfully",
          visible: true,
          type: "success",
        });

        // Navigate to results page with the result data
        router.push({
          pathname: "/(Self-Test)/result",
          params: { resultId: result.data.data.id },
        });
      }
    } catch (error) {
      console.error("Error submitting test:", error.response?.data || error);
      setToast({
        message:
          error.response?.data?.errors?.[0]?.msg || "Failed to submit test",
        visible: true,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("SelectedOptions", Object.keys(SelectedOptions));

  if (ShowResult) {
    return (
      <SafeAreaView className="h-full bg-white-300">
        <Appbar.Header
          mode="center-aligned"
          className="mt-[-25px] bg-white-300"
        >
          <Appbar.BackAction
            onPress={() => {
              setShowResult(false);
            }}
          />
          <Appbar.Content
            title={
              <Text className="text-xl font-psemibold text-black-200">
                Review Your Answers
              </Text>
            }
          />
        </Appbar.Header>

        <View className="px-4 py-2">
          <Card className="mb-4 rounded-xl overflow-hidden">
            <Card.Content className="p-4">
              <Text className="text-lg font-pbold mb-2 text-secondary-200">
                {title} Assessment
              </Text>
              <Text className="text-sm font-pregular text-gray-600 mb-4">
                Please review your answers before submitting. You can go back to
                make changes if needed.
              </Text>

              <ProgressBar
                progress={1}
                color={colors.accent["DEFAULT"]}
                // className="h-2 rounded-full mb-4"
              />
            </Card.Content>
          </Card>
        </View>

        <ScrollView className="flex-1 px-4">
          {Questions.map((question, i) => {
            const answer = SelectedOptions[question._id];
            if (!answer) return null;

            return (
              <Card
                className="mb-4 rounded-xl overflow-hidden"
                key={question._id}
              >
                <Card.Content className="p-4 bg-white-100 ">
                  <View className="flex-row mb-2">
                    <View className="w-7 h-7 bg-secondary-200 rounded-full items-center justify-center mr-2">
                      <Text className="font-pbold text-white-100">{i + 1}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-pbold text-lg text-black-300">
                        {question.text}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-gray-100 p-3 rounded-lg mt-2">
                    <Text className="font-pmedium text-gray-800">
                      Your answer:
                    </Text>
                    <Text className="font-pregular text-black-300 mt-1">
                      {Array.isArray(answer.selectedOptions)
                        ? answer.selectedOptions.join(", ")
                        : answer.selectedOptions}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            );
          })}

          <View className="mb-8 mt-2">
            <CustomBtn
              title="Submit Assessment"
              iconName="check"
              handlePress={handleSubmitResult}
              loading={IsLoading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // console.log(((CurrentPage + 1) / Questions.length).toFixed(2))

  return (
    <SafeAreaView className="h-full bg-white-300">
      <ScrollView contentContainerClassName="w-full flex-grow">
        <Appbar.Header
          mode="center-aligned"
          // safeAreaInsets={{ bottom }}
          elevated={true}
          // elevation={3}
          className=" mt-[-25px] bg-white-300 "
        >
          <Appbar.BackAction
            onPress={() => {
              router.back();
            }}
          />
          <Appbar.Content
            title={
              <Text className="text-xl font-psemibold text-black-200 capitalize ">
                {title}
                {" -test"}
              </Text>
            }
          />
          {/* <Appbar.Action icon="calendar" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} /> */}
        </Appbar.Header>
        {IsLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={colors.accent["DEFAULT"]} />
            <Text className="mt-4 font-pmedium text-gray-600">
              Loading questions...
            </Text>
          </View>
        ) : (
          <View className="flex-1 px-4 pt-2">
            {/* Progress Bar */}
            <View className="mb-6">
              <View className="flex-row justify-between mb-2">
                <Text className="font-pmedium text-gray-700">
                  Question {CurrentPage + 1} of {Questions.length}
                </Text>
                <Text className="font-pmedium text-gray-700">
                  {Questions.length > 0
                    ? Math.round(((CurrentPage + 1) / Questions.length) * 100)
                    : 0}
                  %
                </Text>
              </View>
              <ProgressBar
                progress={
                  Questions.length > 0
                    ? (CurrentPage + 1) / Questions.length
                    : 0
                }
                color={colors.accent["DEFAULT"]}
                className="h-2 rounded-full"
              />
            </View>

            {Questions &&
              Questions.slice(
                CurrentPage * QuestionsPerPage,
                (CurrentPage + 1) * QuestionsPerPage
              ).map((Question) => {
                return (
                  <Animated.View
                    key={Question._id}
                    style={{
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    }}
                    className="w-full"
                  >
                    <Card className="mb-4 rounded-xl bg-white-300 shadow-sm overflow-hidden">
                      <Card.Content className="p-4">
                        <View className="mb-4">
                          <Text className="text-xl font-pbold text-black-300 mb-1">
                            {Question.text}
                          </Text>
                          <Text className="text-sm font-pregular text-gray-500">
                            {Question.answerType === "Select One"
                              ? "Select one option"
                              : Question.answerType === "Select Any"
                              ? "Select all that apply"
                              : "Enter your answer"}
                          </Text>
                        </View>

                        <View className="mt-2">
                          {Question.answerType !== "Text" ? (
                            Question.options.map((option, i) => {
                              if (Question.answerType === "Select One") {
                                const isSelected =
                                  SelectedOptions[Question._id]
                                    ?.selectedOptions === option.text;
                                return (
                                  <Surface
                                    key={i}
                                    className={`mb-3 rounded-lg overflow-hidden ${
                                      isSelected
                                        ? "bg-secondary-100"
                                        : "bg-white-100"
                                    }`}
                                    elevation={1}
                                  >
                                    <RadioButton.Item
                                      label={option.text}
                                      value={option.text}
                                      onPress={() =>
                                        handleOptionSelect(
                                          Question,
                                          option.text
                                        )
                                      }
                                      color={colors.accent["DEFAULT"]}
                                      status={
                                        isSelected ? "checked" : "unchecked"
                                      }
                                      labelStyle={{
                                        fontFamily: "OpenSans-Regular",
                                      }}
                                    />
                                  </Surface>
                                );
                              }

                              const isSelected = SelectedOptions[
                                Question._id
                              ]?.selectedOptions?.includes(option.text);
                              return (
                                <Surface
                                  key={i}
                                  className={`mb-3 rounded-lg overflow-hidden ${
                                    isSelected
                                      ? "bg-secondary-100"
                                      : "bg-white-100"
                                  }`}
                                  elevation={1}
                                >
                                  <Checkbox.Item
                                    label={option.text}
                                    value={option.text}
                                    status={
                                      isSelected ? "checked" : "unchecked"
                                    }
                                    onPress={() =>
                                      handleOptionSelect(Question, option.text)
                                    }
                                    color={colors.accent["DEFAULT"]}
                                    labelStyle={{
                                      fontFamily: "OpenSans-Regular",
                                    }}
                                  />
                                </Surface>
                              );
                            })
                          ) : (
                            <View className="w-full px-2 py-2">
                              <CustomInput
                                placeholder="Enter your answer here"
                                value={
                                  SelectedOptions[Question._id]
                                    ?.selectedOptions || ""
                                }
                                handleChange={(text) =>
                                  handleOptionSelect(Question, text)
                                }
                                multiline={true}
                                numberOfLines={4}
                              />
                            </View>
                          )}
                        </View>
                      </Card.Content>
                    </Card>
                  </Animated.View>
                );
              })}
          </View>
        )}
      </ScrollView>
      {/* Navigation Buttons */}
      <View className="flex-row justify-around w-full mt-4 mb-6">
        <CustomBtn
          title="Previous"
          iconName="chevron-left"
          iconFirst={true}
          handlePress={handlePreviousPage}
          disabled={CurrentPage === 0}
        />
        <CustomBtn
          title={CurrentPage + 1 >= Questions.length ? "Review" : "Next"}
          iconName={
            CurrentPage + 1 >= Questions.length ? "check" : "chevron-right"
          }
          handlePress={handleNextPage}
        />
      </View>
    </SafeAreaView>
  );
};

export default QuestionScreen;
