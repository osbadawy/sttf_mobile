import { useLocalization } from "@/contexts/LocalizationContext";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useRef, useState } from "react";
import { Animated, PanResponder, Text, View } from "react-native";
import CameraInput from "./CameraInput";

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

  function handleImageCapture(uri: string) {
    setPhotoUri(uri);
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
          <View className="ml-auto items-center">
            <CameraInput onImageCapture={handleImageCapture} />

            {/* 👇 Right label: only show when swipe is NOT active */}
            {!isSwipeActive && (
              <Text className="mt-1 text-[13px] text-neutral-800">
                {t("tap here")}
              </Text>
            )}
          </View>

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
