import colors from "@/colors";
import ActivityCard from "@/components/activities/ActivityCard";
import CustomButton, { ButtonColor, ButtonSize } from "@/components/Button";
import { HeaderColor } from "@/components/Header";
import {
  ActivityFlameIcon,
  ActivityPageBg,
  ArrowBig,
  FilterIcon,
} from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SelectionModal from "@/components/SelectionModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlayerActivities } from "@/hooks/activities/usePlayerActivities";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getUniqueActivityTypes } from "@/utils/activities";
import { formatDate } from "@/utils/dateTimeHelpers";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ActivitiesPage() {
  const { user } = useAuth();
  const { t, isRTL, currentLanguage } = useLocalization("activities");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");
  const isCoachViewing = Object.keys(playerData).length > 0;

  const { userName, profilePicture, access } = useUserProfile();

  const useDateState = useState(new Date());
  const [date, setDate] = useDateState;

  const { data, dataRange, fetchAdditionalData, error } = usePlayerActivities({
    user_id: playerData.firebase_id || user?.uid || undefined,
    initialDaysBack: 14,
  });

  const categories = ["technical", "strength", "recovery"];
  const orderedData = Object.entries(data).sort(
    (a, b) => Number(b[0]) - Number(a[0]),
  );

  const [activityFilters, setActivityFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const beginningOfDay = new Date(date);
  beginningOfDay.setHours(0, 0, 0, 0);

  const getCalories = () => {
    if (data[beginningOfDay.getTime()]) {
      return data[beginningOfDay.getTime()].reduce((acc, item) => {
        if (item && item.score && item.score.kilojoule) {
          return acc + Math.round(item.score.kilojoule / 4.184);
        }
        return acc;
      }, 0);
    }
    return 0;
  };

  const calories = getCalories();

  // Watch for date changes and fetch data if needed
  useEffect(() => {
    if (dataRange.earliest && dataRange.latest) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      const earliestDate = new Date(dataRange.earliest);
      earliestDate.setHours(0, 0, 0, 0);

      const latestDate = new Date(dataRange.latest);
      latestDate.setHours(0, 0, 0, 0);

      // Check if selected date is outside the current data range
      if (selectedDate < earliestDate) {
        // Selected date is before our data range, fetch data from selected date to earliest
        const newEndDate = new Date(earliestDate);
        newEndDate.setDate(newEndDate.getDate() - 1);
        newEndDate.setHours(23, 59, 59, 999);

        fetchAdditionalData(selectedDate, newEndDate);
      } else if (selectedDate > latestDate) {
        // Selected date is after our data range, fetch data from latest to selected date
        const newStartDate = new Date(latestDate);
        newStartDate.setDate(newStartDate.getDate() + 1);
        newStartDate.setHours(0, 0, 0, 0);

        fetchAdditionalData(newStartDate, selectedDate);
      }
    }
  }, [date, dataRange, user]);

  return (
    <>
      <ParallaxScrollView
        headerProps={{
          name: (playerData.display_name as string) || userName || access,
          profilePicture:
            (playerData.profile_picture as string) || profilePicture,
          color: HeaderColor.BG,
          showDateSelector: true,
          useDateState: useDateState,
          showBGImage: false,
        }}
        error={Boolean(error)}
      >
        <View
          className={`px-4 py-0 z-10 relative ${isRTL ? "items-end" : "items-start"}`}
        >
          <Text
            className="effra-semibold text-2xl"
            style={{ paddingBottom: 87 }}
          >
            {t("title")}
          </Text>
          <ActivityPageBg
            style={{
              position: "absolute",
              right: -67,
              top: -32,
              transform: isRTL ? [{ rotateY: "180deg" }] : [],
            }}
          />
          <Text className="effra-light text-base pb-4">{t("burntToday")}</Text>

          <View className="flex-row items-center justify-start pb-10">
            <ActivityFlameIcon />
            <Text className="effra-semibold text-4xl">
              {" " + calories + " "}
              <Text className="effra-light text-base">Kcal</Text>
            </Text>
          </View>

          <CustomButton
            title={isCoachViewing ? t("manageWorkouts") : t("yourWorkouts")}
            onPress={() =>
              router.push({
                pathname: "/player/activities/plan" as RelativePathString,
                params: {
                  date: date.toISOString(),
                  player: JSON.stringify(playerData),
                },
              })
            }
            icon={<ArrowBig stroke={colors.red} direction="right" />}
            color={ButtonColor.red}
            size={ButtonSize.sm}
          />

          <View
            className={`w-full pb-2 pt-[120px] items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <Text className="effra-semibold text-2xl">
              {t("whoopDetected")}
            </Text>
            <TouchableOpacity
              className="flex-row items-center py-4 px-0"
              onPress={() => setShowFilterDropdown(true)}
              style={{ gap: 8 }}
            >
              <Text className="effra-light text-base">
                {t("filterActivities")}
              </Text>
              <FilterIcon />
            </TouchableOpacity>
          </View>

          {orderedData.map((_data, index) => {
            const day = _data[1];
            if (
              activityFilters.length > 0 &&
              !day.some((item: any) => {
                return activityFilters.includes(item.sport_name);
              })
            ) {
              return null;
            }
            return (
              <View key={index} className="w-full">
                <Text className="text-xs effra-light pb-5">
                  {formatDate(day[0].start, currentLanguage)}
                </Text>
                {day.map((item) => {
                  if (
                    activityFilters.length > 0 &&
                    !activityFilters.includes(item.sport_name)
                  ) {
                    return null;
                  }
                  return <ActivityCard activity={item} key={item.id} />;
                })}
              </View>
            );
          })}

          <View className="w-full items-center justify-center">
            <CustomButton
              title="Load More"
              onPress={() => {
                if (dataRange.earliest) {
                  // Calculate 14 days before the earliest date
                  const newEndDate = new Date(dataRange.earliest);
                  newEndDate.setDate(newEndDate.getDate() - 1);
                  newEndDate.setHours(23, 59, 59, 999);

                  const newStartDate = new Date(dataRange.earliest);
                  newStartDate.setDate(newStartDate.getDate() - 14);
                  newStartDate.setHours(0, 0, 0, 0);

                  fetchAdditionalData(newStartDate, newEndDate);
                }
              }}
              color={ButtonColor.white}
              size={ButtonSize.sm}
            />
          </View>
        </View>
      </ParallaxScrollView>
      {showFilterDropdown && (
        <SelectionModal
          title={t("filterActivities")}
          uniqueItems={getUniqueActivityTypes(data).map((activityType) => ({
            name: tActivityTypes(activityType),
            value: activityType,
            icon: <DynamicActivityIcon activityType={activityType} />,
          }))}
          selectedItems={activityFilters}
          setSelectedItems={setActivityFilters}
          setShowSelectionModal={setShowFilterDropdown}
        />
      )}
    </>
  );
}
