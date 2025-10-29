// app/player/body/[player_id]/body-data.tsx (or wherever you want it)
// If you prefer a different path, keep the component export as default.

import CustomButton, { ButtonColor } from "@/components/Button";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import DateField from "@/components/settings/DateField";
import DatePickerModal from "@/components/settings/DatePickerModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { clearBodyCompositionLatestCache } from "@/hooks/useBodyCompositionLatest";
import { clearBodyCompositionsCache } from "@/hooks/useBodyCompositions";
import Constants from "expo-constants";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  const { t, isRTL } = useLocalization("components.body");
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { player } = useLocalSearchParams();
  const playerData = JSON.parse((player as string) || "{}");

  // date state
  const [date, setDate] = useState<Date>(new Date());
  const [dateOpen, setDateOpen] = useState(false);

  // inputs
  const [weight, setWeight] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [muscle, setMuscle] = useState<string>("");

  const dateLabel = useMemo(() => formatDateDDMMYYYY(date), [date]);
  const [disableConfirm, setDisableConfirm] = useState(false);

  const onConfirm = async () => {
    // TODO: call backend with parsed numbers
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      setDisableConfirm(true);
      const payload = {
        day: date,
        firebase_id: playerData.firebase_id || user.uid,
        weight_kg: Number(weight),
        body_fat_percentage: Number(fat),
        muscle_mass_percentage: Number(muscle),
      };
      console.log({ payload });
      const response = await fetch(
        `${Constants.expoConfig?.extra?.BACKEND_URL}/body-composition`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        Alert.alert("Error", "Failed to submit body data");
        return;
      }

      // Clear caches to trigger refetch on the body page
      clearBodyCompositionLatestCache();
      clearBodyCompositionsCache();

      router.replace(`/player/body` as RelativePathString);
    } catch (error) {
      Alert.alert("Error", "Failed to submit body data");
    } finally {
      setDisableConfirm(false);
    }
  };

  // shared card style
  const cardClass =
    "flex-1 rounded-2xl bg-white border border-neutral-200 px-4 py-3 shadow-sm";

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("body"),
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
          {/* Date selector (top) */}
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

          {/* Inputs grid: 2 x 2 */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className={cardClass}>
                <Text className="mb-2 text-xs text-neutral-500">Kg</Text>
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
                <Text className="mb-2 text-xs text-neutral-500">
                  {t("fat %")}
                </Text>
                <TextInput
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="decimal-pad"
                  placeholder="Fat %"
                  placeholderTextColor="#A3A3A3"
                  className="text-lg font-semibold text-black"
                />
              </View>

              <View className={cardClass}>
                <Text className="mb-2 text-xs text-neutral-500">
                  {t("muscle %")}
                </Text>
                <TextInput
                  value={muscle}
                  onChangeText={setMuscle}
                  keyboardType="decimal-pad"
                  placeholder="Muscle %"
                  placeholderTextColor="#A3A3A3"
                  className="text-lg font-semibold text-black"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Sticky confirm button */}
        <CustomButton
          title="Confirm"
          onPress={onConfirm}
          disabled={disableConfirm}
          color={ButtonColor.primary}
        />
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  );
}
