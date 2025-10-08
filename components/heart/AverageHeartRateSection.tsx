import colors from "@/colors";
import CardWithTitle from "@/components/CardWithTitle";
import { HeartLine2 } from "@/components/icons";
import { useLocalization } from "@/contexts/LocalizationContext";
import { getAvgValue } from "@/utils/data";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";
import RadioSelect from "../RadioSelect";

interface Data {
  date: Date;
  avg: number;
  hrv: number;
}

interface AverageHeartRateSectionProps {
  p1Name: string;
  p2Name?: string;
  p1Data: Data[];
  p2Data?: Data[];
}

export default function AverageHeartRateSection({
  p1Data,
  p2Data,
  p1Name,
  p2Name,
}: AverageHeartRateSectionProps) {
  const { t: tHeart } = useLocalization("components.heart");
  const { t, isRTL } = useLocalization("stats");

  const [selectedPlayer, setSelectedPlayer] = useState<any>(0);

  const p1Color = colors.heart;
  const p2Color = colors.yellow;

  const [containerWidth, setContainerWidth] = useState(300); // Default fallback width

  const p1Latest = p1Data[p1Data.length - 1];
  const p2Latest = p2Data?.[p2Data.length - 1];
  const latest = selectedPlayer === 0 ? p1Latest : p2Latest;

  const p1AvgHr = getAvgValue(p1Data, ["avg"]);
  const p1AvgHrv = getAvgValue(p1Data, ["hrv"]);

  // Calculate averages for p2Data if available
  const p2AvgHr = p2Data ? getAvgValue(p2Data, ["avg"]) : null;
  const p2AvgHrv = p2Data ? getAvgValue(p2Data, ["hrv"]) : null;

  // Use actual dates for x-axis to show proper time spacing
  const p1ChartData = p1Data.map((item) => {
    const date = new Date(item.date);
    return {
      x: date.getTime(), // Use timestamp for x-axis
      y: Math.round(item.avg || 0),
    };
  });

  const p2ChartData =
    p2Data?.map((item) => {
      const date = new Date(item.date);
      return {
        x: date.getTime(), // Use timestamp for x-axis
        y: Math.round(item.avg || 0),
      };
    }) || [];

  // Combine x values from both datasets for proper domain calculation
  const allXValues = [...p1ChartData, ...p2ChartData]
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
            {latest ? Math.round(latest.avg) + " " : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#4B4B4B]">bpm</Text>
        </Text>
        <Text style={{ width: "50%" }}>
          <Text className="font-inter-semibold text-3xl text-[#757575]">
            {(selectedPlayer === 0 ? p1AvgHr : p2AvgHr)
              ? Math.round((selectedPlayer === 0 ? p1AvgHr : p2AvgHr) || 0) +
                " "
              : "-- "}
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
        {/* Player 1 line */}
        <VictoryLine
          data={p1ChartData.filter(
            (d) => !isNaN(d.x) && !isNaN(d.y) && isFinite(d.x) && isFinite(d.y),
          )}
          style={{
            data: {
              stroke: p1Color,
              strokeWidth: 3,
              opacity: selectedPlayer === 0 ? 1 : 0.25,
            },
          }}
        />
        {/* Player 2 line */}
        {p2Data && p2ChartData.length > 0 && (
          <VictoryLine
            data={p2ChartData.filter(
              (d) =>
                !isNaN(d.x) && !isNaN(d.y) && isFinite(d.x) && isFinite(d.y),
            )}
            style={{
              data: {
                stroke: p2Color,
                strokeWidth: 3,
                opacity: selectedPlayer === 1 ? 1 : 0.25,
              },
            }}
          />
        )}
        {/* Player 1 scatter points */}
        <VictoryScatter
          data={p1ChartData.filter(
            (d) => !isNaN(d.x) && !isNaN(d.y) && isFinite(d.x) && isFinite(d.y),
          )}
          style={{
            data: {
              fill: "#FFFFFF",
              stroke: p1Color,
              strokeWidth: 3,
              opacity: selectedPlayer === 0 ? 1 : 0.25,
            },
          }}
          size={8}
        />
        {/* Player 2 scatter points */}
        {p2Data && p2ChartData.length > 0 && (
          <VictoryScatter
            data={p2ChartData.filter(
              (d) =>
                !isNaN(d.x) && !isNaN(d.y) && isFinite(d.x) && isFinite(d.y),
            )}
            style={{
              data: {
                fill: "#FFFFFF",
                stroke: p2Color,
                strokeWidth: 3,
                opacity: selectedPlayer === 1 ? 1 : 0.25,
              },
            }}
            size={8}
          />
        )}

        {allXValues.length > 0 && (
          <VictoryLine
            data={[
              {
                x: Math.min(...allXValues),
                y: Math.round((selectedPlayer === 0 ? p1AvgHr : p2AvgHr) || 0),
              },
              {
                x: Math.max(...allXValues),
                y: Math.round((selectedPlayer === 0 ? p1AvgHr : p2AvgHr) || 0),
              },
            ]}
            style={{
              data: {
                stroke: selectedPlayer === 0 ? p1Color : p2Color,
                strokeWidth: 2,
                strokeDasharray: "5,5",
                strokeLinecap: "round",
                opacity: 0.2,
              },
            }}
          />
        )}
      </VictoryChart>

      <View className="flex-row justify-start pt-8">
        <View style={{ width: "50%" }}>
          <Text className="effra-medium text-base pb-3">{tHeart("hrv")}</Text>
          <Text className="font-inter-semibold text-3xl">
            {latest ? Math.round(latest.hrv) + " " : "-- "}
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
            {(selectedPlayer === 0 ? p1AvgHrv : p2AvgHrv)
              ? Math.round((selectedPlayer === 0 ? p1AvgHrv : p2AvgHrv) || 0) +
                " "
              : "-- "}
            <Text className="font-inter-light text-base text-[#969696]">
              ms
            </Text>
          </Text>
        </View>
      </View>

      {p2Name && (
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
              value: selectedPlayer ? selectedPlayer.toString() : "0",
            }}
            setSelectedItem={(item) => setSelectedPlayer(Number(item.value))}
          />
        </View>
      )}
    </CardWithTitle>
  );
}
