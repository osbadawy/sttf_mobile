import colors from "@/colors";
import CardWithTitle from "@/components/CardWithTitle";
import { HeartLine2 } from "@/components/icons";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";

interface Data {
  date: Date;
  avg: number;
  hrv: number;
}

export default function AverageHeartRateSection({ data }: { data: Data[] }) {
  const { t: tHeart } = useLocalization("components.heart");
  const { t, isRTL } = useLocalization("stats");
  const [containerWidth, setContainerWidth] = useState(300); // Default fallback width

  const today = data[data.length - 1];

  const totalHr = data.reduce((acc, curr) => acc + (curr.avg || 0), 0);
  const numHr = data.reduce((acc, curr) => (curr ? acc + 1 : acc), 0) || 1;
  const avgHr = totalHr / numHr;

  const totalHrv = data.reduce((acc, curr) => acc + (curr.hrv || 0), 0);
  const numHrv = data.reduce((acc, curr) => (curr ? acc + 1 : acc), 0) || 1;
  const avgHrv = totalHrv / numHrv;

  // Use actual dates for x-axis to show proper time spacing
  const chartData = data.map((item) => {
    const date = new Date(item.date);
    return {
      x: date.getTime(), // Use timestamp for x-axis
      y: Math.round(item.avg || 0),
    };
  });

  const xValues = chartData
    .map((d) => d.x)
    .filter((x) => !isNaN(x) && isFinite(x));

  return (
    <CardWithTitle
      title={tHeart("avgTitle")}
      icon={<HeartLine2 />}
      titleColor="text-black"
      arrow={false}
      isRTL={isRTL}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      <View className="flex-row justify-start mb-4">
        <Text style={{ width: "50%" }}>
          <Text className="font-inter-semibold text-3xl">
            {today ? Math.round(today.avg) + " " : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#4B4B4B]">bpm</Text>
        </Text>
        <Text style={{ width: "50%" }}>
          <Text className="font-inter-semibold text-3xl text-[#757575]">
            {avgHr ? Math.round(avgHr) + " " : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#969696]">
            {t("14DayAvg")}
          </Text>
        </Text>
      </View>

      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 20, y: 30 }}
        padding={{ left: 40, right: 40, top: 10, bottom: 40 }}
        width={containerWidth}
        style={{
          parent: {
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
          },
        }}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "none" },
            ticks: { stroke: "none" },
            tickLabels: { opacity: 0.5 },
            grid: { stroke: "#e0e0e0", strokeWidth: 1, strokeDasharray: "2,2" },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: "none" },
            ticks: { stroke: "none" },
            tickLabels: { opacity: 0.5 },
            grid: { stroke: "#e0e0e0", strokeWidth: 1 },
          }}
          tickFormat={(t) => {
            // Convert timestamp back to date and show month-day
            try {
              const date = new Date(t);
              const month = (date.getMonth() + 1).toString().padStart(2, "0");
              const day = date.getDate().toString().padStart(2, "0");
              return `${month}.${day}`;
            } catch {
              return `${Math.round(t)}`;
            }
          }}
          tickCount={4}
        />
        <VictoryLine
          data={chartData.filter(
            (d) => !isNaN(d.x) && !isNaN(d.y) && isFinite(d.x) && isFinite(d.y),
          )}
          style={{ data: { stroke: colors.heartLight, strokeWidth: 3 } }}
        />
        {xValues.length > 0 && (
          <VictoryLine
            data={[
              {
                x: Math.min(...xValues),
                y: Math.round(avgHr || 0),
              },
              {
                x: Math.max(...xValues),
                y: Math.round(avgHr || 0),
              },
            ]}
            style={{
              data: {
                stroke: colors.heart,
                strokeWidth: 2,
                strokeDasharray: "5,5",
                strokeLinecap: "round",
                opacity: 0.2,
              },
            }}
          />
        )}
        <VictoryScatter
          data={chartData.filter(
            (d) => !isNaN(d.x) && !isNaN(d.y) && isFinite(d.x) && isFinite(d.y),
          )}
          style={{
            data: { fill: "#FFFFFF", stroke: colors.heart, strokeWidth: 3 },
          }}
          size={8}
        />
      </VictoryChart>

      <View className="flex-row justify-start pt-8">
        <View style={{ width: "50%" }}>
          <Text className="effra-medium text-base pb-3">{tHeart("hrv")}</Text>
          <Text className="font-inter-semibold text-3xl">
            {today ? Math.round(today.hrv) + " " : "-- "}
            <Text className="font-inter-light text-base text-[#4B4B4B]">
              ms
            </Text>
          </Text>
        </View>
        <View style={{ width: "50%" }}>
          <Text className="effra-medium text-base pb-3">
            {tHeart("hrv") + " "}
            <Text className="effra-light text-base">{t("14DayAvg")}</Text>
          </Text>
          <Text className="font-inter-semibold text-3xl text-[#757575]">
            {avgHrv ? Math.round(avgHrv) + " " : "-- "}
            <Text className="font-inter-light text-base text-[#969696]">
              ms
            </Text>
          </Text>
        </View>
      </View>
    </CardWithTitle>
  );
}
