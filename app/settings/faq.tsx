import ParallaxScrollView from "@/components/ParallaxScrollView";
import FAQItem from "@/components/settings/FAQItem";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";
import { FAQ_DATA } from "../../utils/faqEntry";

export default function FAQ() {
  const { t, isRTL } = useLocalization("login");

  return (
    <ParallaxScrollView
      headerProps={{
        showDateSelector: false,
        showCalendarIcon: false,
        title: "FAQ",
        showBGImage: false,
        showBackButton: true,
      }}
      showNav={false}
    >
      <View className="w-full pt-2">
        {/* Top divider to match the mock */}
        <View className="h-px bg-neutral-200" />
        {FAQ_DATA.map((item) => (
          <FAQItem key={item.id} item={item} />
        ))}
      </View>

      <View className="w-full pt-2">
        <Text className="text-center text-sm text-neutral-500 mb-4">
          Cannot find the answer you are looking for? Contact our support team
          at support@covelant.com
        </Text>
      </View>
    </ParallaxScrollView>
  );
}
