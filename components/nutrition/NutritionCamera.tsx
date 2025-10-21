import { useLocalization } from "@/contexts/LocalizationContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NutritionCameraProps {
  /** Called when user successfully swipes to confirm; passes the taken photo URI (or null). */
  onConfirm: (photoUri: string | null) => void;
  /** If true, the swipe pill is invisible but remains swipeable (default: true). */
  hideSwipePill?: boolean;
}

export default function NutritionCamera({
  onConfirm,
  hideSwipePill = true,
}: NutritionCameraProps) {
  const { t, isRTL } = useLocalization("components.nutrition.nutritionList");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [containerH, setContainerH] = useState(0);
  const chevronOpacities = [0.1, 0.28, 0.42, 0.58, 0.75];
  const chevronSize = Math.max(28, containerH * 1);
  const isSwipeActive = !!photoUri;

  // Swipe-to-confirm
  const translateX = useRef(new Animated.Value(0)).current;
  const threshold = 120;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !!photoUri, // disabled until photo exists
        onPanResponderMove: (_, { dx }) => {
          if (!photoUri) return;
          if (dx >= 0) translateX.setValue(Math.min(dx, threshold + 40));
        },
        onPanResponderRelease: (_, { dx }) => {
          if (!photoUri) return;
          if (dx > threshold) {
            Animated.timing(translateX, {
              toValue: threshold + 40,
              duration: 160,
              useNativeDriver: true,
            }).start(() => {
              onConfirm(photoUri); // hand control back to parent
              // reset handle for next time (in case component stays mounted)
              translateX.setValue(0);
            });
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [photoUri],
  );

  async function openCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      console.warn("Camera permission not granted");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  return (
    <View className="">
      <View
        className="relative overflow-hidden rounded-3xl bg-white"
        onLayout={(e) => setContainerH(e.nativeEvent.layout.height)}
      >
        {/* chevrons unchanged */}
        <View className="absolute inset-0 flex-row items-center justify-center pointer-events-none">
          {chevronOpacities.map((op, i) => (
            <Ionicons
              key={i}
              name="chevron-forward"
              size={chevronSize}
              color="#3C6B67"
              style={{
                opacity: op,
                marginHorizontal: -35,
                transform: [{ scaleX: 0.3 }],
              }}
            />
          ))}
        </View>

        {/* Content row */}
        <View className="flex-row items-center justify-between px-4 py-5">
          {/* 👇 Left message: only show when swipe is active */}
          {isSwipeActive ? (
            <View className="flex-row items-baseline">
              <Text className="text-[18px] font-medium text-neutral-500">
                {t("swipe to")}
              </Text>
              <Text className="text-[18px] font-semibold text-emerald-600">
                {t("confirm")}
              </Text>
            </View>
          ) : (
            <View /> // keep layout tidy when inactive
          )}

          {/* Camera button / preview */}
          <TouchableOpacity
            onPress={openCamera}
            className="ml-auto items-center"
          >
            <View className="rounded-full p-1">
              <View
                className="size-12 rounded-full items-center justify-center bg-white overflow-hidden"
                style={{
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: "#D1D5DB",
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 16,
                  shadowOffset: { width: 2, height: 2 },
                  elevation: 2,
                }}
              >
                {photoUri ? (
                  <Image
                    source={{ uri: photoUri }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="camera-outline" size={20} color="#546E7A" />
                )}
              </View>
            </View>

            {/* 👇 Right label: only show when swipe is NOT active */}
            {!isSwipeActive && (
              <Text className="mt-1 text-[13px] text-neutral-800">
                {t("tap here")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Swipe pill (logic unchanged) — only visible when swipe is active AND not hidden */}
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              transform: [{ translateX }],
              opacity: hideSwipePill || !isSwipeActive ? 0 : 1,
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-emerald-600"
          >
            <Text className="text-white font-medium">Swipe to Confirm</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
