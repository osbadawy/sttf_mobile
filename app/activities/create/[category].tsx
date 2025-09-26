import Button, { ButtonColor, ButtonSize } from "@/components/Button";
import { Arrow } from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SelectionModal from "@/components/SelectionModal";
import TimePicker from "@/components/TimePicker";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { getActivityTypesInCategory } from "@/utils/activities";
import Constants from "expo-constants";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function NewActivityPage() {
  const { category } = useLocalSearchParams();
  const categoryString = Array.isArray(category) ? category[0] : category;
  const activityTypes = getActivityTypesInCategory(categoryString);
  const [disableButton, setDisableButton] = useState(false);

  const { t, isRTL } = useLocalization("components.activities.newActivity");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );
  const useDateState = useState(new Date());
  const [selectedActivityType, setSelectedActivityType] = useState<
    string | null
  >(activityTypes[0]);
  const [showActivityTypeModal, setShowActivityTypeModal] = useState(false);

  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const duration = endTime.getTime() - startTime.getTime();
  // Min Duration is 5 mins
  const minDuration = 5 * 60 * 1000;

  const { user } = useAuth();

  const onPress = async () => {
    if (duration >= minDuration && user) {
      setDisableButton(true);
      const body = {
        activity_type: selectedActivityType,
        started_at: startTime.toISOString(),
        ended_at: endTime.toISOString(),
        firebase_id: user.uid,
      };

      const response = await fetch(
        `${Constants.expoConfig?.extra?.BACKEND_URL}/player-activity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        router.push("/activities" as RelativePathString);
      } else {
        const errorData = await response.json();
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          requestBody: body,
        });
      }
    }
  };

  return (
    <>
      <ParallaxScrollView
        headerProps={{
          title: t("title"),
          showDateSelector: false,
          useDateState: useDateState,
          showBGImage: false,
          showCalendarIcon: false,
          customDescription: tActivityTypes(categoryString),
          backLink: "activities" as RelativePathString,
        }}
      >
        <View
          className="flex-1 flex-col justify-between pb-[60px]"
          style={{ gap: 36 }}
        >
          <View className="flex-1" style={{ gap: 36 }}>
            <TouchableOpacity
              className="flex-row items-center justify-between rounded-3xl bg-white px-8 py-4"
              onPress={() => setShowActivityTypeModal(true)}
              activeOpacity={0.7}
              style={{ boxShadow: "0px 2px 4px 0px #00000018" }}
            >
              <Text className="effra-regular text-base">
                {selectedActivityType
                  ? tActivityTypes(selectedActivityType)
                  : t("selectActivityType")}
              </Text>
              <Arrow direction="down" />
            </TouchableOpacity>

            <View
              className="p-8 space-y-6 bg-white rounded-3xl"
              style={{ boxShadow: "0px 2px 4px 0px #00000018", gap: 32 }}
            >
              {/* Start Time Picker */}
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-base effra-medium text-black mb-2">
                    {t("startTime")}
                  </Text>
                  <Text className="text-xs font-inter-light text-black">
                    {t("workoutStart")}
                  </Text>
                </View>
                <TimePicker value={startTime} onChange={setStartTime} />
              </View>

              {/* End Time Picker */}
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-base effra-medium text-black mb-2">
                    {t("endTime")}
                  </Text>
                  <Text className="text-xs font-inter-light text-black">
                    {t("workoutEnd")}
                  </Text>
                </View>
                <TimePicker value={endTime} onChange={setEndTime} />
              </View>
            </View>
            {duration < minDuration && (
              <Text className="text-sm font-inter-light text-red-500 text-center">
                {t("minDurationError")}
              </Text>
            )}
          </View>

          <View className="px-8">
            <Button
              title={t("add")}
              onPress={onPress}
              color={ButtonColor.primary}
              size={ButtonSize.lg}
              disabled={disableButton || duration < minDuration}
            />
          </View>
        </View>
      </ParallaxScrollView>

      {showActivityTypeModal && (
        <SelectionModal
          title={t("selectActivityType")}
          uniqueItems={activityTypes.map((activityType) => ({
            name: tActivityTypes(activityType),
            value: activityType,
            icon: <DynamicActivityIcon activityType={activityType} />,
          }))}
          selectedItems={selectedActivityType ? [selectedActivityType] : []}
          setSelectedItems={(items) => {
            if (items.length > 0) {
              setSelectedActivityType(items[0]);
            }
            setShowActivityTypeModal(false);
          }}
          setShowSelectionModal={setShowActivityTypeModal}
          customOnPress={(item) => {
            setSelectedActivityType(item.value);
            setShowActivityTypeModal(false);
          }}
          showIcons={true}
          showClearButton={false}
        />
      )}
    </>
  );
}
