import DynamicActivityIcon from "@/components/icons/activities";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePlayerActivities } from "@/hooks/activities/usePlayerActivities";
import {
  getAllActivityTypes,
  getUniqueActivityTypes,
} from "@/utils/activities";
import {
  RelativePathString,
  router,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

function SportSelectionItem({
  playerActivityId,
  activityType,
  firstItem,
}: {
  playerActivityId: string;
  activityType: string;
  firstItem: boolean;
}) {
  let pathname = usePathname();
  pathname = pathname.split("/").slice(0, -1).join("/");

  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );
  if (activityType === "activity") {
    return null;
  }
  return (
    <TouchableOpacity
      className={`flex-row items-center gap-2 border-b border-gray-200 py-5 ${firstItem ? "border-t" : ""}`}
      onPress={() => {
        router.push(
          `${pathname}/?activityType=${activityType}` as RelativePathString,
        );
      }}
    >
      <View className="w-10 h-10 items-center justify-center">
        <DynamicActivityIcon activityType={activityType} />
      </View>
      <Text>{tActivityTypes(activityType)}</Text>
    </TouchableOpacity>
  );
}

export default function SportSelectionPage() {
  const { playerActivityId } = useLocalSearchParams();
  const playerActivityIdString = Array.isArray(playerActivityId)
    ? playerActivityId[0]
    : playerActivityId;

  const { t } = useLocalization("components.activities.selfAssessment");
  const useDateState = useState(new Date());

  const { data: activities14Days } = usePlayerActivities({
    initialDaysBack: 14,
  });

  const allActivities = getAllActivityTypes();
  const recentlyUsedActivities = getUniqueActivityTypes(activities14Days);

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("sportTitle"),
        showDateSelector: false,
        useDateState: useDateState,
        showBGImage: false,
        showCalendarIcon: false,
        showBackButton: true,
      }}
    >
      {/* TODO: Insert Search Bar */}

      <Text className="effra-semibold text-2xl pb-5">{t("recentlyUsed")}</Text>
      <View>
        {recentlyUsedActivities.map((activity, index) => {
          return (
            <SportSelectionItem
              playerActivityId={playerActivityIdString}
              activityType={activity}
              key={activity}
              firstItem={index === 0}
            />
          );
        })}
      </View>

      <Text className="effra-semibold text-2xl pb-5">{t("allActivities")}</Text>
      <View>
        {allActivities.map((activity, index) => (
          <SportSelectionItem
            playerActivityId={playerActivityIdString}
            activityType={activity}
            key={activity}
            firstItem={index === 0}
          />
        ))}
      </View>
    </ParallaxScrollView>
  );
}
