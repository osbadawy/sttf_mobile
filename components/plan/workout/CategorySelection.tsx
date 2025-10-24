import { ModalItem } from "@/components/SelectionModal";
import DynamicActivityIcon from "@/components/icons/activities";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";

interface CategorySelectionProps {
  setCategory: (category: "technical" | "strength" | "recovery") => void;
  t: (key: string) => string;
  isRTL: boolean;
}

export default function CategorySelection({
  setCategory,
  t,
  isRTL,
}: CategorySelectionProps) {
  const { t: tCategories } = useLocalization(
    "components.activities.activityTypes.categories",
  );

  const categories = ["technical", "strength", "recovery"];
  return (
    <View>
      <Text className="font-inter-regular text-base border-b border-gray-200 pb-4 pt-[24px]">
        {t("activitySelectionTitle")}
      </Text>
      {categories.map((category) => (
        <ModalItem
          key={category}
          item={{
            name: tCategories(category),
            value: category,
            icon: <DynamicActivityIcon activityType={category} />,
          }}
          isSelected={false}
          onPress={() =>
            setCategory(category as "technical" | "strength" | "recovery")
          }
          showIcons={true}
          isRTL={isRTL}
        />
      ))}
    </View>
  );
}
