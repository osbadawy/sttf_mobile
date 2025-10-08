import colors from "@/colors";
import CardWithTitle from "@/components/CardWithTitle";
import RadioSelect from "@/components/RadioSelect";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useState } from "react";
import { Text, View } from "react-native";
import { PerformanceIcon } from "../icons";

interface PerformanceDataPoint {
  date: string;
  value: number;
}

interface PerformanceSectionProps {
  p1Name: string;
  p1PerformanceHistory: PerformanceDataPoint[];
  p2Name?: string;
  p2PerformanceHistory?: PerformanceDataPoint[];
}

function Graph({
  history,
  isSecondary,
  secondaryExists,
  highlightColor,
}: {
  history: PerformanceDataPoint[];
  isSecondary: boolean;
  secondaryExists: boolean;
  highlightColor: string;
}) {
  let translation = 0;
  if (secondaryExists) {
    translation = isSecondary ? 3 : -130;
  }

  return (
    <View
      className="flex-row items-end justify-center h-[130px] px-5 w-full"
      style={{ transform: [{ translateY: translation }] }}
    >
      {history.map((dataPoint, index) => {
        const isLatest = index === history.length - 1;
        const height = (dataPoint.value / 100) * 100;

        let width = 16;
        let opacity = isLatest ? 1 : 0.5;
        if (secondaryExists) {
          width = !isSecondary ? 10 : 16;
          opacity = !isSecondary ? 1 : 0.5;
        }

        const boxShadow =
          secondaryExists && !isSecondary
            ? "0px 2px 4px 0px rgba(0, 0, 0, 0.6)"
            : undefined;

        return (
          <View key={index} className="items-center flex-1">
            <View
              className={`rounded-3xl`}
              style={{
                height: height,
                width: width,
                boxShadow: boxShadow,
                backgroundColor: highlightColor,
                opacity: opacity,
              }}
            />
            <Text
              className="text-xs text-[#969696] mt-5 font-inter-light"
              style={{ opacity: isSecondary ? 0 : 1 }}
            >
              {dataPoint.date}
            </Text>
          </View>
        );
      })}
      <View
        className="absolute bottom-[20px] w-full border-b-[2px] border-dotted border-[#BDBDBD]"
        style={{ opacity: isSecondary ? 0 : 1 }}
      />
    </View>
  );
}

export default function PerformanceSection({
  p1Name,
  p1PerformanceHistory,
  p2Name,
  p2PerformanceHistory,
}: PerformanceSectionProps) {
  const { t: tWellbeing } = useLocalization(
    "components.dashboard.wellbeingSection",
  );
  const { t, isRTL } = useLocalization("stats");
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);
  const p1Color = colors.performance;
  const p2Color = colors.performanceVeryLight;

  const today = new Date(new Date().setUTCHours(0, 0, 0, 0));

  function getAvgPerformance(performanceHistory: PerformanceDataPoint[]) {
    const totalPerformance14Days = performanceHistory.reduce(
      (acc, curr) => acc + curr.value,
      0,
    );
    const numPerformance14Days =
      performanceHistory.reduce((acc, curr) => (curr ? acc + 1 : acc), 0) || 1;

    return totalPerformance14Days / numPerformance14Days;
  }

  function sortPerformance14DaysHistory(
    performanceHistory: PerformanceDataPoint[],
  ) {
    const sortedHistory = performanceHistory.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return sortedHistory.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", { day: "2-digit" }),
    }));
  }

  const p1PerformanceToday = p1PerformanceHistory.find(
    (item) => item.date === today.toISOString(),
  );

  const p2PerformanceToday = p2PerformanceHistory?.find(
    (item) => item.date === today.toISOString(),
  );
  const performanceToday =
    selectedPlayer === 0 ? p1PerformanceToday : p2PerformanceToday;

  const p1AvgPerformance = getAvgPerformance(p1PerformanceHistory);
  const p2AvgPerformance = getAvgPerformance(p2PerformanceHistory || []);
  const avgPerformance =
    selectedPlayer === 0 ? p1AvgPerformance : p2AvgPerformance;

  const p1SortedPerformance14DaysHistory =
    sortPerformance14DaysHistory(p1PerformanceHistory);
  const p2SortedPerformance14DaysHistory = sortPerformance14DaysHistory(
    p2PerformanceHistory || [],
  );

  const primarySortedPerformance14DaysHistory =
    selectedPlayer === 0
      ? p1SortedPerformance14DaysHistory
      : p2SortedPerformance14DaysHistory;
  const secondarySortedPerformance14DaysHistory =
    selectedPlayer === 0
      ? p2SortedPerformance14DaysHistory
      : p1SortedPerformance14DaysHistory;

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
            {performanceToday
              ? Math.round(performanceToday.value) + " "
              : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#4B4B4B]">
            {today
              .toLocaleDateString("en-US", { day: "2-digit", month: "2-digit" })
              .replace("/", ".")}
          </Text>
        </Text>
        <Text>
          <Text className="font-inter-semibold text-3xl text-[#757575]">
            {avgPerformance ? Math.round(avgPerformance) + " " : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#969696]">
            {t("14DayAvg")}
          </Text>
        </Text>
      </View>

      {/* Bar Chart */}
      <View className="relative h-[130px] w-full">
        {p2Name && (
          <Graph
            history={secondarySortedPerformance14DaysHistory}
            isSecondary={true}
            secondaryExists={Boolean(p2Name)}
            highlightColor={selectedPlayer === 0 ? p2Color : p1Color}
          />
        )}
        <Graph
          history={primarySortedPerformance14DaysHistory}
          isSecondary={false}
          secondaryExists={Boolean(p2Name)}
          highlightColor={selectedPlayer === 0 ? p1Color : p2Color}
        />
      </View>

      {p2Name && p2PerformanceHistory && (
        <View className="mt-4">
          <RadioSelect
            p1Color={p1Color}
            p2Color={p2Color}
            items={[
              {
                name: p1Name,
                value: "0",
              },
              {
                name: p2Name!,
                value: "1",
              },
            ]}
            selectedItem={{
              name: p1Name,
              value: selectedPlayer.toString(),
            }}
            setSelectedItem={(item) => setSelectedPlayer(Number(item.value))}
          />
        </View>
      )}
    </CardWithTitle>
  );
}
