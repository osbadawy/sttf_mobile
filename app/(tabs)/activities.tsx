import colors from "@/colors";
import Button, { ButtonColor, ButtonSize } from "@/components/Button";
import { HeaderColor } from "@/components/Header";
import {
  ActivityFlameIcon,
  ActivityPageBg,
  Arrow,
  CheckIcon,
  ThinPlusIcon,
} from "@/components/icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

function seperateDataByDay(data: any) {
  const date_seperated_data: any[][] = [];
  let last_date = new Date();

  for (const item of data) {
    const date = new Date(item.started_at);
    date.setHours(0, 0, 0, 0);
    if (date < last_date) {
      last_date = date;
      date_seperated_data.push([]);
    }
    date_seperated_data[date_seperated_data.length - 1].push(item);
  }
  return date_seperated_data;
}

function formatDate(_date: Date, _locale: string = "en-US") {
  const date = new Date(_date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day_of_week = date.toLocaleDateString(_locale, { weekday: "short" });
  return `${day_of_week}, ${day}.${month}`;
}

function formatDuration(started_at: string, ended_at: string): string {
  const totalSeconds = Math.floor(
    (new Date(ended_at).getTime() - new Date(started_at).getTime()) / 1000,
  );
  return [
    Math.floor(totalSeconds / 3600),
    Math.floor((totalSeconds % 3600) / 60),
    totalSeconds % 60,
  ]
    .map((n) => n.toString().padStart(2, "0"))
    .join(":");
}

function getUniqueActivityTypes(data: any[][]) {
  const activityTypes = new Set<string>();
  for (const day of data) {
    for (const activity of day) {
      activityTypes.add(activity.activity_type);
    }
  }
  return Array.from(activityTypes);
}

function FilterDropdown({
  uniqueActivityTypes,
  activityFilters,
  setActivityFilters,
  setShowFilterDropdown,
}: {
  uniqueActivityTypes: string[];
  activityFilters: string[];
  setActivityFilters: (activityFilters: string[]) => void;
  setShowFilterDropdown: (showFilterDropdown: boolean) => void;
}) {
  return (
    <TouchableOpacity
      className="bg-transparent w-screen h-screen absolute z-100"
      onPress={() => setShowFilterDropdown(false)}
    >
      <View className="bg-white absolute bottom-0 w-screen rounded-3xl px-12 pt-2 pb-12">
        <View className="flex-row items-center justify-between py-3">
          <Text className="font-inter-regular text-base">
            Filter Activities
          </Text>
          <TouchableOpacity onPress={() => setActivityFilters([])}>
            <Text className="font-inter-regular text-base underline">
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full h-0 border-b border-gray-200" />
        {uniqueActivityTypes.map((activityType) => {
          const isSelected = activityFilters.includes(activityType);
          const onPress = () => {
            if (isSelected) {
              setActivityFilters(
                activityFilters.filter((filter) => filter !== activityType),
              );
            } else {
              setActivityFilters([...activityFilters, activityType]);
            }
          };
          return (
            <TouchableOpacity
              key={activityType}
              onPress={onPress}
              className="border-b border-gray-200 flex-row h-[56px] items-center justify-between"
            >
              <Text>{activityType}</Text>
              {isSelected && <CheckIcon />}
            </TouchableOpacity>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}

function ActivityCard({ activity, isRTL }: { activity: any; isRTL: boolean }) {
  const duration = formatDuration(activity.started_at, activity.ended_at);
  const needsAction =
    !activity.activity_type || activity.activity_type === "activity";

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between pb-10 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      disabled={!needsAction}
    >
      <View
        className="w-[56px] h-[56px] rounded-full bg-white"
        style={{
          boxShadow: needsAction ? `0 0 8px 0 ${colors.stress}` : "none",
        }}
      />
      <View className="flex-1 pl-4">
        <Text className="text-base effra-medium">
          {activity.activity_type}{" "}
        </Text>
        {needsAction ? (
          <Text
            className={`text-base effra-light ${needsAction ? "text-stress" : ""}`}
          >
            Assessment Needed
          </Text>
        ) : (
          <Text className="text-base effra-light">{duration}</Text>
        )}
      </View>

      <Arrow
        direction={isRTL ? "left" : "right"}
        stroke={needsAction ? colors.stress : "black"}
      />
    </TouchableOpacity>
  );
}

interface ActivitiesPageProps {
  user_id?: string;
}

export default function ActivitiesPage({ user_id }: ActivitiesPageProps) {
  const { user } = useAuth();
  const { isRTL, currentLanguage } = useLocalization();

  const useDateState = useState(new Date());
  const [date, setDate] = useDateState;
  const [data, setData] = useState<any[][]>([]);
  const [activityFilters, setActivityFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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

  console.log(activityFilters);

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
        <View className="items-start px-4 py-0 z-10 relative">
          <Text
            className="effra-semibold text-2xl"
            style={{ paddingBottom: 87 }}
          >
            Your Activity
          </Text>
          <ActivityPageBg
            style={{ position: "absolute", right: -67, top: -32 }}
          />
          <Text className="effra-light text-base pb-4">Burnt Today</Text>

          <View className="flex-row items-center justify-start pb-10">
            <ActivityFlameIcon />
            <Text className="effra-semibold text-4xl">
              {" 710 "}
              <Text className="effra-light text-base">Kcal</Text>
            </Text>
          </View>
          <Button
            title="Add Activity"
            onPress={() => {}}
            icon={<ThinPlusIcon />}
            color={ButtonColor.activity}
            size={ButtonSize.sm}
          />

          <View
            className="w-full pb-2 items-center flex-row justify-end"
            style={{ paddingTop: 120, gap: 4 }}
          >
            <TouchableOpacity
              className="flex-row items-center justify-end p-4 pr-0"
              onPress={() => setShowFilterDropdown(true)}
            >
              <Text className="effra-light text-base">All Activities</Text>
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
                    <ActivityCard activity={item} key={index} isRTL={isRTL} />
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
    </>
  );
}
