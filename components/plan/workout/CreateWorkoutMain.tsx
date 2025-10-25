import colors from "@/colors";
import CustomButton, { ButtonColor } from "@/components/Button";
import DateSelector from "@/components/DateSelector";
import {
  Arrow,
  ClockIcon,
  ProfilePictureDefaultIcon,
  TrashIcon,
} from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import CustomSwitch from "@/components/Switch";
import TimePicker from "@/components/TimePicker";
import Constants from "expo-constants";
import { User } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

interface CreateWorkoutMainProps {
  players: string[];
  selectedActivity: string;
  setSelectedActivity: (activity: string | null) => void;
  t: (key: string) => string;
  tActivityTypes: (key: string) => string;
  category: "technical" | "strength" | "recovery";
  onClose: () => void;
  user: User | null;
  onActivityCreated?: () => void;
  date: Date;
  onOpenPlayersSelection: () => void;
  editingActivity?: any; // Activity being edited
  originalPlayers?: string[]; // Original players for deletion
  onDeleteActivity?: (activity: any) => void;
}

export default function CreateWorkoutMain({
  date,
  players,
  selectedActivity,
  setSelectedActivity,
  t,
  tActivityTypes,
  category,
  onClose,
  user,
  onActivityCreated,
  onOpenPlayersSelection,
  editingActivity,
  originalPlayers = [],
  onDeleteActivity,
}: CreateWorkoutMainProps) {
  const [time, setTime] = useState<Date | null>(
    editingActivity
      ? (() => {
          const activityTime = new Date(editingActivity.start);
          // Extract time components and create a new date in local timezone
          const hours = activityTime.getHours();
          const minutes = activityTime.getMinutes();
          const localTime = new Date();
          localTime.setHours(hours, minutes, 0, 0);
          return localTime;
        })()
      : null,
  );
  const [activityName, setActivityName] = useState<string>(
    editingActivity?.is_custom ? editingActivity.activity_type : "",
  );
  const [activityDetails, setActivityDetails] = useState<string>(
    editingActivity?.notes || "",
  );
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isRecurring, setIsRecurring] = useState<boolean>(
    editingActivity?.recurrence_patterns?.length > 0 || false,
  );
  const [recurranceEndDate, setRecurranceEndDate] = useState<Date | null>(
    editingActivity?.recurrence_patterns?.[0]?.end || null,
  );

  const activity =
    selectedActivity === "custom" ? activityName : selectedActivity;

  const isButtonDisabled =
    disabled || time === null || activityDetails === "" || activity === "";

  const recurranceDaysOptions = [
    { label: "Mo", value: "mon" },
    { label: "Tu", value: "tue" },
    { label: "We", value: "wed" },
    { label: "Th", value: "thu" },
    { label: "Fr", value: "fri" },
    { label: "Sa", value: "sat" },
    { label: "Su", value: "sun" },
  ];

  const [recurranceDays, setRecurranceDays] = useState<string[]>([]);

  // Helper function to delete player assignments
  async function deletePlayerAssignment(
    activityId: string,
    playerIds: string[],
    user: any,
  ) {
    const deleteUrl = `${Constants.expoConfig?.extra?.BACKEND_URL}/planned-activity`;
    const deleteBody = {
      id: activityId,
      users_assigned: playerIds,
      day: date,
    };

    const token = await user.getIdToken();
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error deleting player assignments:", errorData);
      throw new Error(`Failed to remove players: ${errorData.message}`);
    }
  }

  async function onPressAdd() {
    if (user == null) {
      Alert.alert("Error", "User not found");
      return;
    }
    try {
      setDisabled(true);
      // Create a new date with local time
      const dateWithTime = new Date(date);
      if (time) {
        // Use local time from the time picker
        dateWithTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
      }

      const isEditing = !!editingActivity;
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/planned-activity`;

      // Handle player removals for editing
      if (isEditing) {
        // Find players that were removed
        const removedPlayers = originalPlayers.filter(
          (playerId) => !players.includes(playerId),
        );

        // Make a single DELETE request for all removed players
        if (removedPlayers.length > 0) {
          await deletePlayerAssignment(
            editingActivity.id,
            removedPlayers,
            user,
          );
        }
      }

      const body: any = {
        users_assigned: players,
        start: dateWithTime,
        category: category,
        activity_type: activity,
        is_custom: selectedActivity === "custom",
        notes: activityDetails,
      };

      // Add id for editing
      if (isEditing) {
        body.id = editingActivity.id;
        body.day = date;
      }

      if (isRecurring && recurranceDays.length > 0) {
        body.recurrance = {
          start: dateWithTime,
          recurring_days: recurranceDays,
        };

        if (recurranceEndDate) {
          body.recurrance.end = recurranceEndDate;
        }
      }

      const token = await user.getIdToken();

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
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
        throw new Error(
          `Failed to ${isEditing ? "update" : "create"} activity: ${errorData.message}`,
        );
      }
      onActivityCreated?.(); // Call the callback to refresh the activities list
      onClose();
    } catch (error) {
      console.error(
        `Error ${editingActivity ? "updating" : "creating"} activity`,
        error,
      );
      Alert.alert(
        "Error",
        `Failed to ${editingActivity ? "update" : "create"} activity`,
      );
    } finally {
      setDisabled(false);
    }
  }

  return (
    <View>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200">
        <Text className="font-inter-regular text-base pb-2 pt-[24px]">
          {t("activitySelectionTitle")}
        </Text>
        <TouchableOpacity onPress={() => onDeleteActivity?.(editingActivity)}>
          <TrashIcon />
        </TouchableOpacity>
      </View>

      {/* Activity Selection */}
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

      {/* Time Selection */}
      <View className="flex-row items-center justify-between border-b border-gray-200 h-[56px]">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <ClockIcon />
          <Text className="effra-medium text-base">{t("selectTime")}</Text>
        </View>
        <TimePicker value={time} onChange={setTime} />
      </View>

      {/* Players Selection */}
      <View className="flex-row items-center justify-between border-b border-gray-200 h-[56px]">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <ProfilePictureDefaultIcon fill={"black"} />
          <Text className="effra-medium text-base">{t("players")}</Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center"
          style={{ gap: 4 }}
          onPress={onOpenPlayersSelection}
        >
          <Text className="effra-regular text-base" style={{ opacity: 0.6 }}>
            {players.length} {t("players")}
          </Text>
          <Arrow />
        </TouchableOpacity>
      </View>

      {/* Recurring Selection */}
      <View className="border-b border-gray-200">
        <View className="flex-row items-center justify-between h-[56px]">
          <Text className="effra-medium text-base">{t("recurring")}</Text>
          <CustomSwitch
            value={isRecurring}
            onValueChange={(v) => {
              if (!v) {
                setRecurranceDays([]); // reset the recurrance days
              }
              setIsRecurring(v);
            }}
          />
        </View>

        {isRecurring && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row items-center" style={{ gap: 12 }}>
                <TouchableHighlight
                  underlayColor={colors.primaryLight}
                  onPress={() => {
                    setRecurranceDays(
                      recurranceDaysOptions.map((option) => option.value),
                    );
                  }}
                  className="px-6 py-2 bg-white rounded-lg"
                >
                  <Text className="effra-medium text-base">
                    {t("everyDay")}
                  </Text>
                </TouchableHighlight>

                {recurranceDaysOptions.map(({ label, value }) => {
                  const isSelected = recurranceDays.includes(value);
                  return (
                    <TouchableHighlight
                      underlayColor={colors.primaryLight}
                      key={value}
                      onPress={() => {
                        if (isSelected) {
                          setRecurranceDays(
                            recurranceDays.filter((d) => d !== value),
                          );
                        } else {
                          setRecurranceDays([...recurranceDays, value]);
                        }
                      }}
                      className={`items-center justify-center rounded-lg ${isSelected ? "bg-primary" : "bg-white"}`}
                      style={{
                        width: 36,
                        height: 36,
                      }}
                    >
                      <Text
                        className={`effra-medium text-base ${isSelected ? "text-white" : "text-primary"}`}
                      >
                        {label}
                      </Text>
                    </TouchableHighlight>
                  );
                })}
              </View>
            </ScrollView>
            <View style={{ paddingVertical: 24 }}>
              <DateSelector
                value={recurranceEndDate}
                onChange={setRecurranceEndDate}
              />
            </View>
          </View>
        )}
      </View>

      {/* Custom Activity Name */}
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

      {/* Activity Details */}
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

      {/* Save Button */}
      <CustomButton
        title={editingActivity ? t("save") : t("add")}
        onPress={onPressAdd}
        color={isButtonDisabled ? ButtonColor.white : ButtonColor.primary}
        disabled={isButtonDisabled}
      />
    </View>
  );
}
