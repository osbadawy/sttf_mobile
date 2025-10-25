import { ModalItem } from "@/components/SelectionModal";
import { Text, View } from "react-native";

interface CategorySelectionProps {
  setCategory: (category: "breakfast" | "lunch" | "dinner" | "snack") => void;
  t: (key: string) => string;
  isRTL: boolean;
}

export default function CategorySelection({
  setCategory,
  t,
  isRTL,
}: CategorySelectionProps) {
  const categories = ["breakfast", "lunch", "dinner", "snack"];
  return (
    <View>
      <Text className="font-inter-regular text-base border-b border-gray-200 pb-4 pt-[24px]">
        {t("mealSelectionTitle")}
      </Text>
      {categories.map((category) => (
        <ModalItem
          key={category}
          item={{
            name: t(category),
            value: category,
            icon: null, // TODO: Add meal category icons
          }}
          isSelected={false}
          onPress={() =>
            setCategory(category as "breakfast" | "lunch" | "dinner" | "snack")
          }
          showIcons={false}
          isRTL={isRTL}
        />
      ))}
    </View>
  );
}
