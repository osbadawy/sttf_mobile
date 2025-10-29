import ParallaxScrollView from "@/components/ParallaxScrollView";
import DateField from "@/components/settings/DateField";
import DatePickerModal from "@/components/settings/DatePickerModal";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatDateDDMMYYYY = (d: Date): string => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

export default function BodyData() {
  const { t, isRTL } = useLocalization("components.body.body");
  const insets = useSafeAreaInsets();

  // read incoming params (optional)
  const params = useLocalSearchParams<{
    player_id?: string;
    dateISO?: string;
    weightKg?: string;
    bmi?: string;
    fatPct?: string;
    musclePct?: string;
  }>();

  // local state
  const [date, setDate] = useState<Date>(new Date());
  const [dateOpen, setDateOpen] = useState(false);

  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [muscle, setMuscle] = useState<string>("");

  // hydrate from params (if provided)
  useEffect(() => {
    if (params?.dateISO) {
      const d = new Date(params.dateISO as string);
      if (!isNaN(d.getTime())) setDate(d);
    }
    if (params?.weightKg != null) setWeight(String(params.weightKg));
    if (params?.bmi != null) setBmi(String(params.bmi));
    if (params?.fatPct != null) setFat(String(params.fatPct));
    if (params?.musclePct != null) setMuscle(String(params.musclePct));
  }, [params?.dateISO, params?.weightKg, params?.bmi, params?.fatPct, params?.musclePct]);

  const dateLabel = useMemo(() => formatDateDDMMYYYY(date), [date]);

  const onConfirm = () => {
    // TODO: call backend with parsed numbers
    const payload = {
      playerId: params.player_id ?? null,
      date: date.toISOString(),
      weightKg: Number(weight),
      bmi: Number(bmi),
      fatPct: Number(fat),
      musclePct: Number(muscle),
    };
    console.log("Submitting Body Data:", payload);
  };

  const cardClass =
    "flex-1 rounded-2xl bg-white border border-neutral-200 px-4 py-3 shadow-sm";

  return (
    <ParallaxScrollView
      headerProps={{
        title: "Body Data",
        showBackButton: true,
        showBGImage: false,
        showCalendarIcon: false,
        disableFutureDates: false,
      }}
      showNav={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View className="flex-1 px-4 pt-4 pb-4">
          {/* Date selector */}
          <View className="mb-5">
            <DateField
              label=""
              valueLabel={dateLabel}
              onPress={() => setDateOpen(true)}
              isRTL={isRTL}
            />
            <DatePickerModal
              title="Select Date"
              visible={dateOpen}
              onClose={() => setDateOpen(false)}
              date={date}
              onChange={(d) => setDate(d)}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              isRTL={isRTL}
            />
          </View>

          {/* Inputs grid */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className={cardClass}>
                <Text className="mb-2 text-xs text-neutral-500">{t("weight")}</Text>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  placeholder="Kg"
                  placeholderTextColor="#A3A3A3"
                  className="text-lg font-semibold text-black"
                />
              </View>

              <View className={cardClass}>
                <Text className="mb-2 text-xs text-neutral-500">BMI</Text>
                <TextInput
                  value={bmi}
                  onChangeText={setBmi}
                  keyboardType="decimal-pad"
                  placeholder="BMI"
                  placeholderTextColor="#A3A3A3"
                  className="text-lg font-semibold text-black"
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className={cardClass}>
                <Text className="mb-2 text-xs text-neutral-500">{t("fat")} %</Text>
                <TextInput
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="decimal-pad"
                  placeholder={t("fat%")}
                  placeholderTextColor="#A3A3A3"
                  className="text-lg font-semibold text-black"
                />
              </View>

              <View className={cardClass}>
                <Text className="mb-2 text-xs text-neutral-500">{t("muscle")} %</Text>
                <TextInput
                  value={muscle}
                  onChangeText={setMuscle}
                  keyboardType="decimal-pad"
                  placeholder={t("muscle%")}
                  placeholderTextColor="#A3A3A3"
                  className="text-lg font-semibold text-black"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Sticky confirm */}
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          className="px-4 pt-2"
        >
          <Pressable
            onPress={onConfirm}
            className="h-12 w-full items-center justify-center rounded-xl bg-emerald-700"
          >
            <Text className="text-white text-base font-semibold">{t("confirm")}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  );
}
