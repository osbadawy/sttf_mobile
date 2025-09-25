import DynamicActivityIcon from "@/components/icons/activities";
import { useLocalization } from "@/contexts/LocalizationContext";
import { RelativePathString, router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface NewActvityDropdownProps {
  setShowNewActvityDropdown: (showNewActvityDropdown: boolean) => void;
}

export default function NewActvityDropdown({
  setShowNewActvityDropdown,
}: NewActvityDropdownProps) {
  const { t, isRTL } = useLocalization(
    "components.activities.newActivityDropdown",
  );

  const categories = ["technical", "strength", "recovery"];

  return (
    <TouchableOpacity
      className="bg-transparent w-screen h-screen absolute z-100"
      onPress={() => setShowNewActvityDropdown(false)}
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
        </View>

        <View className="w-full h-0 border-b border-gray-200" />
        <ScrollView>
          {categories.map((activityType) => {
            const onPress = () => {
              router.push(
                `/activities/create/${activityType}` as RelativePathString,
              );
            };
            return (
              <TouchableOpacity
                key={activityType}
                onPress={onPress}
                className={`border-b border-gray-200 h-[56px] items-center justify-between ${isRTL ? "flex-row-reverse" : "flex-row"}`}
              >
                <View className="flex-row items-center" style={{ gap: 20 }}>
                  <DynamicActivityIcon activityType={activityType} />
                  <Text>{t(activityType)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
}
