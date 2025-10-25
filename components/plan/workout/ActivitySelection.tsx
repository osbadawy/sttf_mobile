import { ModalItem } from "@/components/SelectionModal";
import DynamicActivityIcon from "@/components/icons/activities";
import { getActivityTypesInCategory } from "@/utils/activities";
import { Text, View } from "react-native";

interface ActivitySelectionProps {
  category: "technical" | "strength" | "recovery";
  setSelectedActivity: (activity: string | null) => void;
  t: (key: string) => string;
  isRTL: boolean;
  tActivityTypes: (key: string) => string;
}

export default function ActivitySelection({
  category,
  setSelectedActivity,
  t,
  isRTL,
  tActivityTypes,
}: ActivitySelectionProps) {
  const allActivities = getActivityTypesInCategory(category);

  const onClick = (activity: string) => {
    setSelectedActivity(activity);
  };

  return (
    <View>
      <Text className="font-inter-regular text-base border-b border-gray-200 pb-4 pt-[24px]">
        {t("activitySelectionTitle")}
      </Text>

      <Text className="font-inter-semibold text-base pt-[28px] pb-2">
        {t("makeYourOwn")}
      </Text>
      <ModalItem
        item={{
          name: t("custom"),
          value: "custom",
          icon: <DynamicActivityIcon activityType="custom" />,
        }}
        isSelected={false}
        onPress={() => onClick("custom")}
        showIcons={true}
        isRTL={isRTL}
        isFirstItem={true}
      />

      <Text className="font-inter-semibold text-base pt-10 pb-2">
        {t("selectFromList")}
      </Text>
      {allActivities.map((activity, index) => (
        <ModalItem
          key={activity}
          item={{
            name: tActivityTypes(activity),
            value: activity,
            icon: <DynamicActivityIcon activityType={activity} />,
          }}
          isSelected={false}
          onPress={() => onClick(activity)}
          showIcons={true}
          isRTL={isRTL}
          isFirstItem={index === 0}
        />
      ))}
    </View>
  );
}
