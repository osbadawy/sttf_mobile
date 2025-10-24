import CustomButton, { ButtonColor } from "@/components/Button";
import { ClockIcon } from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import TimePicker from "@/components/TimePicker";
import Constants from "expo-constants";
import { User } from "firebase/auth";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

interface CreateWorkoutMainProps {
  players: string[];
  selectedActivity: string;
  setSelectedActivity: (activity: string | null) => void;
  t: (key: string) => string;
  tActivityTypes: (key: string) => string;
  category: "technical" | "strength" | "recovery";
  onClose: () => void;
  user: User | null;
}

export default function CreateWorkoutMain({
  players,
  selectedActivity,
  setSelectedActivity,
  t,
  tActivityTypes,
  category,
  onClose,
  user,
}: CreateWorkoutMainProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [activityName, setActivityName] = useState<string>("");
  const [activityDetails, setActivityDetails] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  const activity = selectedActivity === "custom" ? activityName : selectedActivity;

  const isButtonDisabled =
    disabled || time === null || activityDetails === "" || activity === "";

  async function onPressAdd() {
    if (user == null) {
      Alert.alert("Error", "User not found");
      return;
    }
    try {
      setDisabled(true);
    // Make post request
    const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/planned-activity`;
    const body = {
      users_assigned: players,
      start: time,
      category: category,
      activity_type: activity,
      is_custom: selectedActivity === "custom",
      notes: activityDetails,
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
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(`Failed to create activity: ${errorData.message}`);
    }
    onClose();
  } catch (error) {
    console.error("Error creating activity", error);
    Alert.alert("Error", "Failed to create activity");
  } finally {
    setDisabled(false);
  }
  }

  return (
    <View>
      <Text className="font-inter-regular text-base border-b border-gray-200 pb-2 pt-[24px]">
        {t("activitySelectionTitle")}
      </Text>

      <View className="flex-row items-center justify-between border-b border-gray-200 h-[56px]">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <DynamicActivityIcon activityType={selectedActivity} />
          <Text className="effra-medium text-base">
            {selectedActivity === "custom"
              ? t("custom")
              : tActivityTypes(selectedActivity)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setSelectedActivity(null)}>
          <Text className="effra-regular underline text-base text-primary">
            {t("edit")}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between border-b border-gray-200 h-[56px]">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <ClockIcon />
          <Text className="effra-medium text-base">{t("selectTime")}</Text>
        </View>
        <TimePicker value={time} onChange={setTime} />
      </View>

      {selectedActivity === "custom" && (
        <TextInput
          className="effra-regular text-base bg-white rounded-lg px-4 py-3"
          placeholder={t("nameOfActivity")}
          value={activityName}
          onChangeText={setActivityName}
          style={{
            boxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.08)",
            marginTop: 32,
          }}
        />
      )}

      <TextInput
        className="effra-regular text-base bg-white rounded-lg px-4 py-3"
        placeholder={t("details")}
        value={activityDetails}
        onChangeText={setActivityDetails}
        multiline={true}
        textAlignVertical="top"
        style={{
          boxShadow: "0px 2px 12px 0px rgba(0, 0, 0, 0.08)",
          height: 212,
          marginTop: 24,
          marginBottom: 40,
        }}
      />

      <CustomButton
        title={t("add")}
        onPress={onPressAdd}
        color={isButtonDisabled ? ButtonColor.white : ButtonColor.primary}
        disabled={isButtonDisabled}
      />
    </View>
  );
}
