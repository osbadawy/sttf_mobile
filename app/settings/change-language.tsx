// app/settings/change-language.tsx (or screens/settings/ChangeLanguageScreen.tsx)
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, TouchableOpacity, View } from "react-native";
import CountryFlag from "react-native-country-flag";

type LangCode = "ar" | "en";
type ISOCode = "sa" | "gb";

export default function ChangeLanguageScreen() {
  const { switchLanguage, isRTL } = useLocalization("settings");
  const current: LangCode = isRTL ? "ar" : "en";

  const Divider = () => (
    <View className="mx-4 h-[1px] w-auto bg-neutral-200 opacity-60" />
  );

  const Row = ({
    code,
    label,
    isoCode,
  }: {
    code: LangCode;
    label: string;
    isoCode: ISOCode;
  }) => {
    const selected = current === code;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (!selected) switchLanguage(code);
        }}
        className="px-4 py-4 bg-transparent"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <CountryFlag isoCode={isoCode} size={20} />
            <Text className="text-base text-black">{label}</Text>
          </View>
          {selected ? <Text className="text-emerald-600 text-lg">✓</Text> : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ParallaxScrollView
      headerProps={{
        showDateSelector: false,
        showCalendarIcon: false,
        title: "App Language",
        showBGImage: false,
        showBackButton: true,
      }}
      showNav={false}
      error={false}
    >
      <Divider />
      <Row code="ar" label="Arabic" isoCode="sa" />
      <Divider />
      <Row code="en" label="English" isoCode="gb" />
      <Divider />
    </ParallaxScrollView>
  );
}
