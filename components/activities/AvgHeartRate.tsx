import colors from "@/colors";
import Card from "@/components/Card";
import HeartLine2 from "@/components/icons/HeartLine2";
import { useLocalization } from "@/contexts/LocalizationContext";
import { formatDuration } from "@/utils/dateTimeHelpers";
import { useState } from "react";
import { Text, View } from "react-native";

interface AvgHeartRateProps {
  averageHeartRate: number;
  zone1Milli: number;
  zone2Milli: number;
  zone3Milli: number;
  zone4Milli: number;
  zone5Milli: number;
}

function normalizeWithMinFraction(durations: number[], minFraction: number) {
  const n = durations.length;
  const total = durations.reduce((a, b) => a + b, 0);
  if (total === 0) return Array(n).fill(1 / n);

  // Step 1: calculate raw fractions
  let raw = durations.map((d) => d / total);

  // Step 2: mark which need boosting
  let remaining = 1 - n * minFraction;

  if (remaining < 0) {
    throw new Error("Not enough room: minFraction * n > 1");
  }

  // Step 3: find the total proportion of the items above the minimum
  let aboveMinTotal = raw.reduce(
    (sum, r) => sum + Math.max(0, r - minFraction),
    0,
  );

  // Step 4: distribute remaining space proportionally
  return raw.map((r) => {
    if (r <= minFraction) return minFraction;
    if (aboveMinTotal === 0) return minFraction;
    return minFraction + ((r - minFraction) / aboveMinTotal) * remaining;
  });
}

export default function AvgHeartRate({
  averageHeartRate,
  zone1Milli,
  zone2Milli,
  zone3Milli,
  zone4Milli,
  zone5Milli,
}: AvgHeartRateProps) {
  const [innerWidth, setInnerWidth] = useState(0);
  const { t, isRTL } = useLocalization("components.activities.activityView");

  const durations = [
    Number(zone1Milli),
    Number(zone2Milli),
    Number(zone3Milli),
    Number(zone4Milli),
    Number(zone5Milli),
  ];
  const totalDuration = durations.reduce(
    (acc, curr) => Number(acc) + Number(curr),
    0,
  );
  const normalizedPercentages = normalizeWithMinFraction(durations, 0.1);

  const zoneColors = [
    colors.green,
    colors.blue,
    colors.yellow,
    colors.orange,
    colors.red,
  ];

  return (
    <>
      <View
        className={`items-start justify-start pb-[30px] ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      >
        <View className="w-[30px]">
          <HeartLine2 />
        </View>
        <View
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setInnerWidth(width - 30);
          }}
          className="flex-1"
        >
          <Text
            className={`effra-medium text-2xl pb-10 px-1 w-full ${isRTL ? "text-right" : "text-left"}`}
          >
            {t("avgHrTitle")}
          </Text>

          <Text
            className={`font-inter-semibold text-5xl text-[#424242] ${isRTL ? "text-right" : "text-left"}`}
          >
            {Math.round(averageHeartRate) + " "}
            <Text className="font-inter-light text-base text-[#969696]">
              bpm
            </Text>
          </Text>

          <View
            className={`mt-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
            style={{ gap: 2 }}
          >
            {durations.map((duration, index) => {
              const normalizedPercentage = normalizedPercentages[index]; // Minimum 5%
              const barWidth = normalizedPercentage * innerWidth - 2;
              const percentage =
                totalDuration > 0
                  ? Math.round((duration / totalDuration) * 100)
                  : 0;
              const textOpacity = 1 - (4 - index) * 0.1;

              return (
                <View key={index} className="flex items-center justify-center">
                  <View
                    className="h-1 mb-2"
                    style={{
                      width: barWidth,
                      backgroundColor: zoneColors[index],
                      borderRadius: 4,
                    }}
                  />
                  <Text
                    className="font-inter-regular text-base"
                    style={{ opacity: textOpacity }}
                  >
                    {percentage}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        {[...durations].reverse().map((duration, _i) => {
          const index = 4 - _i;
          const percentage =
            totalDuration > 0
              ? Math.round((duration / totalDuration) * 100)
              : 0;
          const barWidth = (percentage / 100) * innerWidth;
          return (
            <Card key={index} className="px-8 py-4" style={{ gap: 4 }}>
              <View
                className={`flex-row justify-start items-center ${isRTL ? "flex-row-reverse" : "flex-row"}`}
              >
                <Text
                  className={`effra-medium text-base flex-1 ${isRTL ? "text-right" : "text-left"}`}
                >
                  {t(`zone${index + 1}`)}
                </Text>
                <Text
                  className={`font-inter-semibold text-base flex-1 ${isRTL ? "text-right" : "text-left"}`}
                  style={{ color: zoneColors[index] }}
                >
                  {percentage}%
                </Text>
              </View>

              <Text className="effra-medium text-base self-end">
                {formatDuration({ seconds: Math.round(duration / 1000) })}
              </Text>

              <View className="relative mt-2 h-1">
                <View
                  className="h-1 absolute border-inset"
                  style={{
                    width: innerWidth,
                    backgroundColor: zoneColors[index],
                    borderRadius: 4,
                    opacity: 0.1,
                    boxShadow: "inset 0 1px 1px 0",
                  }}
                />
                <View
                  className="h-1 absolute"
                  style={{
                    width: barWidth,
                    backgroundColor: zoneColors[index],
                    borderRadius: 4,
                  }}
                />
              </View>
            </Card>
          );
        })}
      </View>
    </>
  );
}
