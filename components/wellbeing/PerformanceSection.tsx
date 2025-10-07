import CardWithTitle from "@/components/CardWithTitle";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";
import { PerformanceIcon } from "../icons";

interface PerformanceDataPoint {
  date: string;
  value: number;
}

interface PerformanceSectionProps {
  p1PerformanceHistory: PerformanceDataPoint[];
  p2PerformanceHistory?: PerformanceDataPoint[];
}

export default function PerformanceSection({
  p1PerformanceHistory,
  p2PerformanceHistory
}: PerformanceSectionProps) {
  const { t: tWellbeing } = useLocalization(
    "components.dashboard.wellbeingSection",
  );
  const { t, isRTL } = useLocalization("stats");

  const today = new Date(new Date().setUTCHours(0, 0, 0, 0))

  function getAvgPerformance(performanceHistory: PerformanceDataPoint[]) {
    const totalPerformance14Days = performanceHistory.reduce(
      (acc, curr) => acc + curr.value,
      0,
    );
    const numPerformance14Days =
      performanceHistory.reduce((acc, curr) => (curr ? acc + 1 : acc), 0) ||
      1;

    return totalPerformance14Days / numPerformance14Days;
  }

  function sortPerformance14DaysHistory(performanceHistory: PerformanceDataPoint[]) {
    const sortedHistory = performanceHistory.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return sortedHistory.map(
      (item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", { day: "2-digit" }),
      }),
    );
  }

  const p1PerformanceToday = p1PerformanceHistory.find(
    (item) => item.date === today.toISOString(),
  );

  console.log(p1PerformanceHistory);
  console.log(today);
  
  const p2PerformanceToday = p2PerformanceHistory?.find(
    (item) => item.date === today.toISOString(),
  );

  const p1AvgPerformance = getAvgPerformance(p1PerformanceHistory);
  const p2AvgPerformance = getAvgPerformance(p2PerformanceHistory || []);

  const p1SortedPerformance14DaysHistory = sortPerformance14DaysHistory(p1PerformanceHistory);
  const p2SortedPerformance14DaysHistory = sortPerformance14DaysHistory(p2PerformanceHistory || []);

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
            {p1PerformanceToday ? Math.round(p1PerformanceToday.value) + " " : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#4B4B4B]">
            {today.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit" })
              .replace("/", ".")}
          </Text>
        </Text>
        <Text>
          <Text className="font-inter-semibold text-3xl text-[#757575]">
            {p1AvgPerformance ? Math.round(p1AvgPerformance) + " " : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#969696]">
            {t("14DayAvg")}
          </Text>
        </Text>
      </View>

      {/* Bar Chart */}
      <View className="flex-row items-end justify-center h-[130px] px-5 relative">
        {p1SortedPerformance14DaysHistory.map((dataPoint, index) => {
          const isLatest = index === p1SortedPerformance14DaysHistory.length - 1;
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
