import CardWithTitle from "@/components/CardWithTitle";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";
import { PerformanceIcon } from "../icons";

interface PerformanceDataPoint {
  date: string;
  value: number;
}

interface PerformanceSectionProps {
  performance: number;
  performance14DaysHistory: PerformanceDataPoint[];
}

export default function PerformanceSection({
  performance,
  performance14DaysHistory,
}: PerformanceSectionProps) {
  const { t: tWellbeing } = useLocalization(
    "components.dashboard.wellbeingSection",
  );
  const { t, isRTL } = useLocalization("stats");

  const totalPerformance14Days = performance14DaysHistory.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );
  const numPerformance14Days =
    performance14DaysHistory.reduce((acc, curr) => (curr ? acc + 1 : acc), 0) ||
    1;
  const performance14Days = totalPerformance14Days / numPerformance14Days;

  const today = new Date(new Date().setUTCHours(0, 0, 0, 0))
    .toLocaleDateString("en-US", { day: "2-digit", month: "2-digit" })
    .replace("/", ".");

  // sort performance14DaysHistory by date
  let sortedPerformance14DaysHistory = performance14DaysHistory.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  sortedPerformance14DaysHistory = sortedPerformance14DaysHistory.map(
    (item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", { day: "2-digit" }),
    }),
  );

  return (
    <CardWithTitle
      title={tWellbeing("performance")}
      icon={<PerformanceIcon />}
      titleColor="text-black"
      arrow={false}
      isRTL={isRTL}
    >
      <View className="flex-row justify-between mb-4">
        <Text>
          <Text className="font-inter-semibold text-3xl">
            {performance ? Math.round(performance) + " " : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#4B4B4B]">
            {today}
          </Text>
        </Text>
        <Text>
          <Text className="font-inter-semibold text-3xl text-[#757575]">
            {performance14Days ? Math.round(performance14Days) + " " : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#969696]">
            {t("14DayAvg")}
          </Text>
        </Text>
      </View>

      {/* Bar Chart */}
      <View className="flex-row items-end justify-center h-[130px] px-5 relative">
        {sortedPerformance14DaysHistory.map((dataPoint, index) => {
          const isLatest = index === sortedPerformance14DaysHistory.length - 1;
          const height = (dataPoint.value / 100) * 100;

          return (
            <View key={index} className="items-center flex-1">
              <View
                className={`w-4 rounded-3xl ${isLatest ? "bg-performance" : "bg-performanceLight"}`}
                style={{
                  height: height,
                }}
              />
              <Text className="text-xs text-[#969696] mt-5 font-inter-light">
                {dataPoint.date}
              </Text>
            </View>
          );
        })}
        <View className="absolute bottom-[20px] w-full border-b-[2px] border-dotted border-[#BDBDBD]" />
      </View>
    </CardWithTitle>
  );
}
