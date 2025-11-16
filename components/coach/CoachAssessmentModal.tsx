import colors from "@/colors.js";
import Modal from "@/components/Modal";
import { ArrowBig } from "@/components/icons";
import ProfilePictureDefaultIcon from "@/components/icons/ProfilePictureDefault";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { redirectToPlayerPage } from "@/utils/coachNavigation";
import Constants from "expo-constants";
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import CustomButton, { ButtonColor } from "../Button";
import CustomSlider from "../Slider";

interface CoachAssessmentModalProps {
  onClose: () => void;
  id: string;
  profilePicture: string;
  display_name: string;
  refetch: () => void;
}

export default function CoachAssessmentModal({
  onClose,
  id,
  profilePicture,
  display_name,
  refetch,
}: CoachAssessmentModalProps) {
  const [fitnessScore, setFitnessScore] = useState(3);
  const [readinessScore, setReadinessScore] = useState(3);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  console.log({ id });

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      setIsSaving(true);

      // Normalize scores from 0-5 range to 0-1 range
      const normalizedFitnessScore = fitnessScore / 5;
      const normalizedReadinessScore = readinessScore / 5;

      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/coach-assessment`;

      const body = {
        fitness_score: normalizedFitnessScore,
        readiness_score: normalizedReadinessScore,
        firebase_id: id,
      };

      const token = await user.getIdToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          `Failed to save assessment: ${errorData.message || response.statusText}`,
        );
      }

      // Success - close modal and refresh data
      refetch();
      onClose();
    } catch (error) {
      console.error("Error saving assessment:", error);
      Alert.alert("Error", "Failed to save assessment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const { t } = useLocalization("components.coach.coachDashboard");
  return (
    <Modal
      onClose={onClose}
      contentColor="#F8F9F2"
      outterColor="rgba(0, 0, 0, 0.2)"
      maxHeight="90%"
    >
      <View className="py-10">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {profilePicture !== undefined &&
              (profilePicture !== "" ? (
                <Image
                  source={{ uri: profilePicture }}
                  className="w-[40px] h-[40px] rounded-full mx-4"
                />
              ) : (
                <View className="w-[40px] h-[40px] rounded-full mx-4 items-center justify-center bg-[#E5E5E5]">
                  <ProfilePictureDefaultIcon />
                </View>
              ))}

            <View>
              <Text className="effra-base effra-semibold">
                {display_name ? display_name : "Player"}
              </Text>
              <Text className="effra-regular text-base">{t("profile")}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              redirectToPlayerPage(id, display_name, profilePicture)
            }
          >
            <ArrowBig direction="right" fill={colors.primary} strokeWidth={0} />
          </TouchableOpacity>
        </View>

        <View
          className="w-full border-b border-gray-300"
          style={{ marginTop: 30, marginBottom: 32 }}
        />

        <View className="flex-row items-center gap-2">
          <View className="w-[8px] h-[8px] rounded-full bg-yellow" />
          <Text className="text-base effra-semibold">{t("fitnessTitle")}</Text>
        </View>

        <CustomSlider
          value={fitnessScore}
          onChange={setFitnessScore}
          leftLabel={t("sliderLeft")}
          rightLabel={t("sliderRight")}
          showNumbersRow={false}
          maximumTrackTintColor={"gray"}
          showSlider={false}
        />

        <View style={{ marginTop: 64 }} />

        <View className="flex-row items-center gap-2">
          <View className="w-[8px] h-[8px] rounded-full bg-yellow" />
          <Text className="text-base effra-semibold">
            {t("readinessTitle")}
          </Text>
        </View>

        <CustomSlider
          value={readinessScore}
          onChange={setReadinessScore}
          leftLabel={t("sliderLeft")}
          rightLabel={t("sliderRight")}
          showNumbersRow={false}
          maximumTrackTintColor={"gray"}
          showSlider={false}
        />

        <View style={{ marginTop: 64 }} />

        <CustomButton
          title={t("save")}
          onPress={handleSave}
          color={ButtonColor.primary}
          disabled={isSaving}
        />
      </View>
    </Modal>
  );
}
