import ParallaxScrollView from "@/components/ParallaxScrollView";
import FAQItem, { type FAQEntry } from "@/components/settings/FAQItem";
import { View } from "react-native";

const FAQ_DATA: FAQEntry[] = [
  {
    id: "1",
    question: "How do I log a training session or match?",
    answer:
      "Go to the Training tab, tap the + button, and choose Session or Match. Fill in the details like duration, intensity, and notes, then tap Save.",
  },
  {
    id: "2",
    question: "How do I log my meals properly?",
    answer:
      "Open the Meals tab, tap + to add a meal, then select items from your plan or search. Adjust portions and confirm. You can also add photos for better tracking.",
  },
  {
    id: "3",
    question: "Can my coach see what I have planned?",
    answer:
      "Yes. Your coach can view your planned sessions and meals once they are scheduled. You can adjust sharing in Settings → Privacy if needed.",
  },
];

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
