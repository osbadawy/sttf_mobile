import { useLocalization } from "@/contexts/LocalizationContext";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CheckIcon } from "../icons";
import DynamicActivityIcon from "../icons/activities";

export default function FilterDropdown({
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
  const { t, isRTL } = useLocalization("components.activities.filterDropdown");
  const { t: tActivityTypes } = useLocalization("components.activities.activityTypes");

  return (
    <TouchableOpacity
      className="bg-transparent w-screen h-screen absolute z-100"
      onPress={() => setShowFilterDropdown(false)}
    >
      <View
        className="bg-white absolute bottom-0 w-screen rounded-3xl px-12 pt-2 pb-12"
        style={{
          maxHeight: "70%",
        }}
      >
        <View
          className={`items-center justify-between py-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          <Text className="font-inter-regular text-base">{t("title")}</Text>
          <TouchableOpacity onPress={() => setActivityFilters([])}>
            <Text className="font-inter-regular text-base underline">
              {t("clear")}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full h-0 border-b border-gray-200" />
        <ScrollView>
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
                className={`border-b border-gray-200 h-[56px] items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}
              >
                <View className="flex-row items-center" style={{ gap: 10 }}>
                  <View className="w-10 h-7 items-center justify-center">
                    <DynamicActivityIcon activityType={activityType} />
                  </View>
                  <Text>{tActivityTypes(activityType)}</Text>
                </View>
                {isSelected && <CheckIcon />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
}
