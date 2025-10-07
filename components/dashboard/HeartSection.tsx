import Card from "@/components/Card";
import { HeartBg, HeartLine2 } from "@/components/icons";
import TitleWithIcon from "@/components/TitleWithIcon";
import { useLocalization } from "@/contexts/LocalizationContext";
import {
  RelativePathString,
  router,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface HeartSectionProps {
  dailyAvg: number;
  max: number;
  resting: number;
}

export default function HeartSection({
  dailyAvg,
  max,
  resting,
}: HeartSectionProps) {
  const { t, isRTL } = useLocalization("components.dashboard.heartSection");
  const pathname = usePathname();
  const { player } = useLocalSearchParams();

  return (
    <TouchableOpacity
      className="mt-11"
      onPress={() =>
        router.push({
          pathname: `${pathname}/heart` as RelativePathString,
          params: {
            player,
          },
        })
      }
    >
      <TitleWithIcon
        title={t("title")}
        icon={<HeartLine2 />}
        titleColor="text-black"
        isRTL={isRTL}
      />
      <View className="flex-row w-full mt-6 relative justify-center">
        <Card className="relative mr-3 z-10 p-4" style={{ flex: 3 }}>
          <Text className="effra-normal">{t("dailyAvg")}</Text>
          <View className="items-center justify-center flex-1">
            <HeartBg className="absolute top-0 left-0" />
            <View className="absolute">
              <Text className="effra-semibold text-3xl">{dailyAvg}</Text>
              <Text className="effra-normal">bpm</Text>
            </View>
          </View>
        </Card>
        <Card className="z-10 p-4" style={{ flex: 2 }}>
          <Text className="effra-normal">{t("max")}</Text>
          <Text className="pb-5">
            <Text className="effra-semibold text-2xl">{max}</Text>
            <Text className="effra-normal">bpm</Text>
          </Text>
          <Text className="effra-normal">{t("resting")}</Text>
          <Text>
            <Text className="effra-semibold text-2xl">{resting}</Text>
            <Text className="effra-normal">bpm</Text>
          </Text>
        </Card>
        <Card className="absolute top-7 w-[80vw] h-full" />
      </View>
    </TouchableOpacity>
  );
}
