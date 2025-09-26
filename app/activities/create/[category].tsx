import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { getActivityTypesInCategory } from "@/utils/activities";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";

export default function NewActivityPage() {
  const { category } = useLocalSearchParams();
  const categoryString = Array.isArray(category) ? category[0] : category;

  const { t, isRTL } = useLocalization("components.activities.newActivity");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const useDateState = useState(new Date());
  const [selectedActivityType, setSelectedActivityType] = useState<
    string | null
  >(null);

  const activityTypes = getActivityTypesInCategory(categoryString);

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("title"),
        showDateSelector: false,
        useDateState: useDateState,
        showBGImage: false,
        showCalendarIcon: false,
        customDescription: tActivityTypes(categoryString),
      }}
    >
      <Text>Hello World</Text>
    </ParallaxScrollView>
  );
}
