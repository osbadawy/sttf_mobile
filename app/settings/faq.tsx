import ParallaxScrollView from "@/components/ParallaxScrollView";
import FAQItem from "@/components/settings/FAQItem";
import { View } from "react-native";
import { FAQ_DATA } from "../../utils/faqEntry";

export default function FAQ() {
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
    </ParallaxScrollView>
  );
}
