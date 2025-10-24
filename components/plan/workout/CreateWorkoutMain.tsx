import CustomButton, { ButtonColor } from "@/components/Button";
import { ClockIcon } from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import TimePicker from "@/components/TimePicker";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface CreateWorkoutMainProps {
  selectedActivity: string;
  setSelectedActivity: (activity: string | null) => void;
  t: (key: string) => string;
  tActivityTypes: (key: string) => string;
}

export default function CreateWorkoutMain({
  selectedActivity,
  setSelectedActivity,
  t,
  tActivityTypes,
}: CreateWorkoutMainProps) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const [time, setTime] = useState<Date>(d);
  const [activityName, setActivityName] = useState<string>("");
  const [activityDetails, setActivityDetails] = useState<string>("");

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
        onPress={() => {}}
        color={ButtonColor.primary}
      />
    </View>
  );
}
