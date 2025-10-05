import ActivityCard from "@/components/activities/ActivityCard";
import Button, { ButtonColor, ButtonSize } from "@/components/Button";
import { HeaderColor } from "@/components/Header";
import {
  ActivityFlameIcon,
  ActivityPageBg,
  Arrow,
  ThinPlusIcon,
} from "@/components/icons";
import DynamicActivityIcon from "@/components/icons/activities";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SelectionModal from "@/components/SelectionModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlayerActivities } from "@/hooks/activities/usePlayerActivities";
import { formatDate, getUniqueActivityTypes } from "@/utils/activities";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ActivitiesPageProps {
  user_id?: string;
}

export default function ActivitiesPage({ user_id }: ActivitiesPageProps) {
  const { user } = useAuth();
  const { t, isRTL, currentLanguage } = useLocalization("activities");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const useDateState = useState(new Date());
  const [date, setDate] = useDateState;

  const { data, dataRange, fetchAdditionalData } = usePlayerActivities({
    user_id,
    initialDaysBack: 14,
  });

  const categories = ["technical", "strength", "recovery"];
  const orderedData = Object.entries(data).sort(
    (a, b) => Number(b[0]) - Number(a[0]),
  );

  const [activityFilters, setActivityFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showNewActvityDropdown, setShowNewActvityDropdown] = useState(false);

  const beginningOfDay = new Date(date);
  beginningOfDay.setHours(0, 0, 0, 0);

  const getCalories = () => {
    if (data[beginningOfDay.getTime()]) {
      return data[beginningOfDay.getTime()].reduce((acc, item) => {
        if (
          item &&
          item.workout &&
          item.workout.score &&
          item.workout.score.kilojoule
        ) {
          return acc + Math.round(item.workout.score.kilojoule / 4.184);
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
  }, [date, dataRange, user, user_id]);

  return (
    <>
      <ParallaxScrollView
        headerProps={{
          name: "User",
          color: HeaderColor.BG,
          showDateSelector: true,
          useDateState: useDateState,
          showBGImage: false,
        }}
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
          <Button
            title={t("addActivity")}
            onPress={() => {
              setShowNewActvityDropdown(true);
            }}
            icon={<ThinPlusIcon />}
            color={ButtonColor.activity}
            size={ButtonSize.sm}
          />

          <View
            className={`w-full pb-2 pt-[120px] items-center flex-row ${isRTL ? "justify-start" : "justify-end"}`}
            style={{ gap: 4 }}
          >
            <TouchableOpacity
              className="flex-row items-center py-4 px-0"
              onPress={() => setShowFilterDropdown(true)}
            >
              <Text className="effra-light text-base">
                {t("allActivities")}
              </Text>
              <Arrow direction="down" strokeWidth={1.4} />
            </TouchableOpacity>
          </View>

          {orderedData.map((_data, index) => {
            const day = _data[1];
            if (
              activityFilters.length > 0 &&
              !day.some((item: any) =>
                activityFilters.includes(item.activity_type),
              )
            ) {
              return null;
            }
            return (
              <View key={index} className="w-full">
                <Text className="text-xs effra-light pb-5">
                  {formatDate(day[0].started_at, currentLanguage)}
                </Text>
                {day.map((item) => {
                  if (
                    activityFilters.length > 0 &&
                    !activityFilters.includes(item.activity_type)
                  ) {
                    return null;
                  }
                  return (
                    <ActivityCard
                      activity={item}
                      key={item.id}
                      // onPress={() => {
                      //   router.push(`/activities/${item.id}`);
                      // }}
                    />
                  );
                })}
              </View>
            );
          })}

          <View className="w-full items-center justify-center">
            <Button
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
      {showNewActvityDropdown && (
        <SelectionModal
          title={t("selectCategory")}
          uniqueItems={categories.map((category) => ({
            name: tActivityTypes("categories." + category),
            value: category,
          }))}
          setShowSelectionModal={setShowNewActvityDropdown}
          customOnPress={(item) => {
            router.push(`/activities/create/${item.value}`);
          }}
          showIcons={false}
        />
      )}
    </>
  );
}
