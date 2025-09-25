import ActivityCard from "@/components/activities/ActivityCard";
import FilterDropdown from "@/components/activities/FilterDropdown";
import NewActvityDropdown from "@/components/activities/NewActvityDropdown";
import Button, { ButtonColor, ButtonSize } from "@/components/Button";
import { HeaderColor } from "@/components/Header";
import {
  ActivityFlameIcon,
  ActivityPageBg,
  Arrow,
  ThinPlusIcon,
} from "@/components/icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import {
  formatDate,
  getUniqueActivityTypes,
  seperateDataByDay,
} from "@/utils/activities";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ActivitiesPageProps {
  user_id?: string;
}

export default function ActivitiesPage({ user_id }: ActivitiesPageProps) {
  const { user } = useAuth();
  const { t, isRTL, currentLanguage } = useLocalization("activities");

  const useDateState = useState(new Date());
  const [date, setDate] = useDateState;
  const [data, setData] = useState<any[][]>([]);
  const [activityFilters, setActivityFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showNewActvityDropdown, setShowNewActvityDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // 14 days ago
          const startDate = new Date(date);
          startDate.setHours(0, 0, 0, 0);
          startDate.setDate(startDate.getDate() - 30);

          const params = new URLSearchParams({
            firebase_id: user_id || user.uid,
            start_date: startDate.toISOString(),
            end_date: date.toISOString(),
          });
          const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/player-activity?${params}`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });
          const data = await response.json();
          setData(seperateDataByDay(data));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [date, user]);

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
              {" 710 "}
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

          {data.map((day, index) => {
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
                {day.map((item, index) => {
                  if (
                    activityFilters.length > 0 &&
                    !activityFilters.includes(item.activity_type)
                  ) {
                    return null;
                  }
                  return (
                    <ActivityCard activity={item} key={index} />
                  );
                })}
              </View>
            );
          })}
        </View>
      </ParallaxScrollView>
      {showFilterDropdown && (
        <FilterDropdown
          uniqueActivityTypes={getUniqueActivityTypes(data)}
          activityFilters={activityFilters}
          setActivityFilters={setActivityFilters}
          setShowFilterDropdown={setShowFilterDropdown}
        />
      )}
      {showNewActvityDropdown && (
        <NewActvityDropdown
          setShowNewActvityDropdown={setShowNewActvityDropdown}
        />
      )}
    </>
  );
}
