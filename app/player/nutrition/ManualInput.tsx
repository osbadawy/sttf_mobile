import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import NutritionDataInput, { NutritionData } from "@/components/nutrition/NutritionDataInput";

const shadow = Platform.select({
  ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 4 },
});

type MealWhen = "Breakfast" | "Lunch" | "Dinner" | "snacks";
const WHEN_OPTIONS: MealWhen[] = ["Breakfast", "Lunch", "Dinner", "snacks"];

// Map internal values -> i18n keys
const WHEN_I18N_KEY: Record<MealWhen, string> = {
  Breakfast: "breakfast",
  Lunch: "lunch",
  Dinner: "dinner",
  snacks: "snacks",
};

export default function ManualInputDesign() {
  const { t } = useLocalization("components.nutrition.nutritionList");

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [mealName, setMealName] = useState("");
  const [whenValue, setWhenValue] = useState<MealWhen | null>(null);
  const [whenOpen, setWhenOpen] = useState(false);

  const [dataOpen, setDataOpen] = useState(false);
  const [nutrition, setNutrition] = useState<NutritionData>({});

  const canConfirm = Boolean(imageUri && mealName.trim() && whenValue);

  const handleAddPicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("camera permission title"), t("camera permission body"));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (uri) setImageUri(uri);

    try {
      setIsSending(true);
      // TODO upload
    } catch (e) {
      console.error(e);
      Alert.alert(t("upload failed title"), t("upload failed body"));
    } finally {
      setIsSending(false);
    }
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    router.push("/player/nutrition/NutritionDashboard");
  };

  const localizedWhen = (val: MealWhen | null) =>
    val ? t(WHEN_I18N_KEY[val]) : t("when"); // header label

  return (
    <ParallaxScrollView
      headerProps={{
        title: t("AddMealtitle"),
        showBackButton: true,
        showDateSelector: false,
        showBGImage: false,
        showCalendarIcon: false,
      }}
      showNav={false}
      backgroundColor="#F3F6EE"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 bg-[#E6E6E6] justify-between">
            {/* Header block */}
            <View className="py-10 px-4" style={{ backgroundColor: imageUri ? "#F3F6EE" : "#E6E6E6" }}>
              <View className="items-center mb-4 pt-6 w-full">
                {imageUri ? (
                  <Image source={{ uri: imageUri }} className="w-full h-64 rounded-xl" resizeMode="cover" style={shadow as object} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={82} color="#A3A3A3" />
                    <TouchableOpacity
                      onPress={handleAddPicture}
                      activeOpacity={0.9}
                      className="mt-4 rounded-md border border-emerald-600 px-8 py-2 bg-white"
                      style={{
                        ...(shadow as object),
                        shadowColor: "#008C46",
                        shadowOpacity: 0.18,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 6 },
                        opacity: isSending ? 0.6 : 1,
                      }}
                      disabled={isSending}
                    >
                      <View className="flex-row items-center">
                        <Text className="text-[#464646] font-normal text-lg">
                          {isSending ? t("uploading") : t("Add picture")}
                        </Text>
                        {!isSending && <Text className="text-[#464646] font-thin text-3xl ml-1">+</Text>}
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* Content area */}
            <View className="flex-1 px-4 pt-5 bg-[#F3F6EE]">
              {/* Name input (localized placeholder) */}
              <View className="w-full rounded-xl bg-white border border-[#E8E8E8] mb-3" style={shadow}>
                <TextInput
                  value={mealName}
                  onChangeText={setMealName}
                  placeholder={t("name of meal")}   // 👈 localized
                  placeholderTextColor="#A3A3A3"
                  className="px-4 py-3 text-[16px] text-neutral-900"
                  returnKeyType="done"
                />
              </View>

              {/* When dropdown (localized header + options) */}
              <View className="w-full rounded-xl bg-white border border-[#E8E8E8] mb-3" style={shadow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setWhenOpen((v) => !v)}
                  className="flex-row items-center justify-between px-4 py-3"
                >
                  <Text className={`text-[16px] ${whenValue ? "text-neutral-900" : "text-neutral-400"}`}>
                    {localizedWhen(whenValue)}
                  </Text>
                  <Ionicons name={whenOpen ? "chevron-up" : "chevron-down"} size={16} color="#111827" />
                </TouchableOpacity>

                {whenOpen && (
                  <View className="border-t border-[#E8E8E8]">
                    {WHEN_OPTIONS.map((opt, idx) => {
                      const isLast = idx === WHEN_OPTIONS.length - 1;
                      const isSelected = opt === whenValue;
                      return (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => {
                            setWhenValue(opt);
                            setWhenOpen(false);
                          }}
                          activeOpacity={0.9}
                          className={`px-4 py-3 ${!isLast ? "border-b border-[#F0F0F0]" : ""} ${
                            isSelected ? "bg-[#F7FBF7]" : ""
                          }`}
                        >
                          <View className="flex-row items-center justify-between">
                            <Text className="text-[16px] text-neutral-900">{t(WHEN_I18N_KEY[opt])}</Text>
                            {isSelected && <Ionicons name="checkmark" size={18} color="#10B981" />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Add Data toggle */}
              <TouchableOpacity
                onPress={() => setDataOpen((v) => !v)}
                activeOpacity={0.8}
                className="flex-row items-center justify-center my-2"
              >
                <Text className="text-base text-neutral-700">
                  {t("add macro")} <Text className="text-neutral-500">{dataOpen ? "▾" : "▸"}</Text>
                </Text>
              </TouchableOpacity>

              {dataOpen && <NutritionDataInput value={nutrition} onChange={setNutrition} />}
            </View>

            {/* Confirm button (kept simple) */}
            <View className="px-4 pb-6 bg-[#F3F6EE]">
              <TouchableOpacity
                onPress={handleConfirm}
                disabled={!canConfirm}
                activeOpacity={canConfirm ? 0.9 : 1}
                className={`h-14 rounded-xl items-center justify-center ${canConfirm ? "bg-green-600" : "bg-gray-300"}`}
              >
                <Text className="text-white text-lg font-semibold">
                  {t("confirm")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  );
}
