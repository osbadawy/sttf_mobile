import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { PlannedActivity } from "@/schemas/PlannedActivity";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import { PlayerSelfAssessment } from "@/schemas/PlayerSelfAssessment";
import { formatTime } from "@/utils/dateTimeHelpers";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowBig } from "../icons";
import ClockIcon from "../icons/Clock";
import CaloriesIcon from "../icons/nutrition/CaloriesIcon";
import SmallTrophyIcon from "../icons/playerDayPlan/SmallTrophyIcon";
import XIcon from "../icons/XIcon";
import Modal from "../Modal";
import CustomSlider from "../Slider";
import ActivityModalContent from "./ActivityModalContent";
import AssessmentModalContent from "./AssessmentModalContent";
import MealModalContent from "./MealModalContent";

const InfoCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <View
      className="bg-white rounded-[8px] h-68px items-center justify-center px-4"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
      }}
    >
      <View className="flex-row items-center" style={{ gap: 8 }}>
        {icon}
        <Text className="text-3xl effra-semibold">{value}</Text>
      </View>
      <Text className="text-base effra-regular" style={{ opacity: 0.6 }}>
        {title}
      </Text>
    </View>
  );
};

export interface TableItemModalContentProps {
  type: "meal" | "activity" | "assessment";
  category: string;
  data: PlannedActivity | GetMealsResponse | PlayerSelfAssessment | null;
  isComplete: boolean;
  isFutureEvent: boolean;
}

interface TableItemModalProps {
  content: TableItemModalContentProps | null;
  onClose: () => void;
  onRefetch: () => void;
}

export default function TableItemModal({
  content,
  onClose,
  onRefetch,
}: TableItemModalProps) {
  const [score, setScore] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLocalization("components.dayPlan");
  const { user } = useAuth();

  if (!content) return null;
  const { type, category, data, isComplete, isFutureEvent } = content;

  let modalContent = {
    subtitle: "",
    title: "",
    icon: null as React.ReactNode,
    color: "gray",
    contentElement: null as React.ReactNode,
    selfAssessmentText: "",
    points: null as number | null,
    startTime: null as Date | null,
    calories: null as number | null,
    onComplete: async () => false,
  };

  if (type === "activity") {
    modalContent = ActivityModalContent({
      activity: data as PlannedActivity,
      category,
      user,
      score,
      onClose,
      onRefetch,
    });
  } else if (type === "meal") {
    modalContent = MealModalContent({
      meal: data as GetMealsResponse,
      category,
      onImageCapture: setImageUrl,
      user,
      imageUrl,
      onClose,
      onRefetch,
      isComplete,
      isFutureEvent,
    });
  } else if (type === "assessment") {
    modalContent = AssessmentModalContent({
      assessment: data as PlayerSelfAssessment,
      category,
      user,
      score,
      onClose,
      onRefetch,
    });
  }

  const {
    subtitle,
    title,
    icon,
    color,
    contentElement,
    selfAssessmentText,
    points,
    startTime,
    calories,
    onComplete,
  } = modalContent;

  const handleComplete = async () => {
    setIsSubmitting(true);
    await onComplete();
    setIsSubmitting(false);
  };

  // Determine if the Complete button should be disabled
  const isButtonDisabled = (() => {
    if (type === "activity") {
      // Activity requires a score > 0
      return score === 0;
    } else if (type === "meal") {
      // Meal requires an image
      return imageUrl === null;
    } else if (type === "assessment") {
      // Assessment requires a score > 0
      return score === 0;
    }
    return false;
  })();

  return (
    <Modal
      onClose={onClose}
      maxHeight={"100%"}
      contentColor={"#F8F9F2"}
      outterColor={"rgba(0, 0, 0, 0.2)"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-10">
          <View className="flex-row items-center justify-between">
            <Text style={{ color }} className="text-base effra-semibold pb-3">
              {subtitle}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <XIcon />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center" style={{ gap: 12 }}>
            {icon}
            <Text className="text-2xl effra-semibold">{title}</Text>
          </View>

          <View className="pt-0 pb-4">{contentElement}</View>

          {selfAssessmentText && !isComplete && !isFutureEvent && (
            <View>
              <View
                className="w-full border-b border-gray-300"
                style={{ marginVertical: 12 }}
              />
              <Text className="text-base effra-semibold pb-3">
                {t("selfAssessment")}
              </Text>
              <Text
                className="text-base effra-regular"
                style={{ opacity: 0.6 }}
              >
                {selfAssessmentText}
              </Text>
              <CustomSlider
                value={score}
                onChange={setScore}
                leftLabel={t("sliderLeft")}
                rightLabel={t("sliderRight")}
                showNumbersRow={false}
                maximumTrackTintColor={"gray"}
                showSlider={false}
              />

              <View
                className="w-full border-b border-gray-300"
                style={{ marginTop: 50, marginBottom: 40 }}
              />
            </View>
          )}

          <View
            className="flex-row items-center pb-4"
            style={{
              gap: calories ? 0 : 12,
              justifyContent: calories ? "space-between" : "flex-start",
            }}
          >
            <InfoCard
              title={t("points")}
              value={points ? points.toString() : "--"}
              icon={<SmallTrophyIcon />}
            />
            <InfoCard
              title={t("startTime")}
              value={
                startTime
                  ? formatTime({ date: startTime, includeSeconds: false })
                  : "--"
              }
              icon={<ClockIcon />}
            />
            {calories && (
              <InfoCard
                title={t("calories")}
                value={calories ? calories.toString() : "--"}
                icon={<CaloriesIcon />}
              />
            )}
          </View>

          {!isFutureEvent && !isComplete && (
            <TouchableOpacity
              className="rounded-[8px] px-4 py-4 items-center justify-center flex-row"
              style={{
                shadowColor: "#000",
                shadowOpacity: isButtonDisabled ? 0 : 0.06,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
                elevation: isButtonDisabled ? 0 : 3,
                backgroundColor: isButtonDisabled ? "#D1D5DB" : color,
                gap: 12,
                opacity: isButtonDisabled ? 0.6 : 1,
              }}
              onPress={handleComplete}
              disabled={isSubmitting || isButtonDisabled}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white text-lg effra-regular">
                    {t("complete")}
                  </Text>
                  <ArrowBig stroke={isButtonDisabled ? "#D1D5DB" : color} />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
}
