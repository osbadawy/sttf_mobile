import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";

export default function NutritionDashboard() {
    const { t } = useLocalization("components.nutrition.nutritionList");


    return (
        <ParallaxScrollView
          headerProps={{
            title: t("nutritionDashboard"),
            showBackButton: true,
            showDateSelector: false,
            showBGImage: false,
            showCalendarIcon: true,
          }}
        >
            <View className="p-5">
                <Text className="text-2xl font-semibold text-left">{t("header")}</Text>
            </View>
        </ParallaxScrollView>
    );
}