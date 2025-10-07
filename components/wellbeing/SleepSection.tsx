import colors from "@/colors.js";
import CardWithTitle from "@/components/CardWithTitle";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";
import { VictoryContainer, VictoryPie } from "victory-native";
import { SleepIcon } from "../icons";

interface SleepSectionProps {
  rem: number;
  sws: number;
  light: number;
  awake: number;
  score: number;
}

export default function SleepSection({
  rem,
  sws,
  light,
  awake,
  score,
}: SleepSectionProps) {
  const { t, isRTL } = useLocalization("components.wellbeing.sleep");

  // Calculate percentages
  const total = rem + sws + light + awake;
  const remPercent = Math.round((rem / total) * 100);
  const swsPercent = Math.round((sws / total) * 100);
  const lightPercent = Math.round((light / total) * 100);
  const awakePercent = Math.round((awake / total) * 100);

  // Data for the pie chart
  const data = [
    { x: "REM", y: remPercent, color: colors.sleepRem }, // Purple
    { x: "SWS", y: swsPercent, color: colors.sleepSws }, // Dark blue
    { x: "Light", y: lightPercent, color: colors.sleepLight }, // Light blue
    { x: "Awake", y: awakePercent, color: colors.sleepAwake }, // Teal
  ].filter((item) => item.y > 0); // Only show segments with data

  return (
    <CardWithTitle
      title={t("title")}
      icon={<SleepIcon />}
      titleColor="text-sleep"
      isRTL={isRTL}
      arrow={false}
    >
      <View className="flex-row items-center justify-center py-4">
        {/* Pie Chart */}
        <View className="relative">
          <VictoryPie
            data={data}
            width={186}
            height={186}
            innerRadius={70}
            colorScale={data.map((item) => item.color)}
            padding={0}
            containerComponent={<VictoryContainer />}
            labels={() => null}
            style={{
              data: {
                strokeWidth: 0,
              },
            }}
          />
          {/* Center Score */}
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-4xl font-bold text-black">
              {score ? Math.round(score * 100) : "--"}
            </Text>
          </View>
        </View>

        {/* Legend */}
        <View className="ml-5" style={{ gap: 16 }}>
          {data.map((item, index) => (
            <View key={index} className="flex-row items-center">
              <Text>
                <Text
                  className="font-inter-medium text-base"
                  style={{ color: item.color }}
                >
                  {item.y}%{" "}
                </Text>
                <Text
                  className="font-inter-light text-xs"
                  style={{ color: item.color }}
                >
                  {t(item.x.toLowerCase())}
                </Text>
              </Text>
            </View>
          ))}
        </View>
      </View>
    </CardWithTitle>
  );
}
