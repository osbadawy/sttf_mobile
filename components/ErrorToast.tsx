import { useLocalization } from "@/contexts/LocalizationContext";
import { RelativePathString, router, useLocalSearchParams, usePathname } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import ExclamationMarkIcon from "./icons/ExclamationMark";
import ReloadIcon from "./icons/Reload";

export default function ErrorToast() {
  const { t } = useLocalization("error");
  const pathname = usePathname() as RelativePathString;
  const params = useLocalSearchParams();
  return (
    <View
      className="self-center flex-row items-center justify-between bg-heart p-5 rounded-[24px] absolute"
      style={{ gap: 12, top: 80, zIndex: 100 }}
    >
      <View className="w-[20px] h-[20px] border-2 border-white rounded-full flex items-center justify-center">
        <ExclamationMarkIcon fill="white" scale={0.6} />
      </View>

      <Text className="effra-medium text-base text-white">
        {t("reloadMessage")}
      </Text>

      <TouchableOpacity
        className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center"
        onPress={() => {
          router.replace({ pathname, params });
        }}
      >
        <ReloadIcon />
      </TouchableOpacity>
    </View>
  );
}
