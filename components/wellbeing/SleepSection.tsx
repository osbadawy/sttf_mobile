import colors from "@/colors.js";
import CardWithTitle from "@/components/CardWithTitle";
import { useLocalization } from "@/contexts/LocalizationContext";
import { SleepStageSummary } from "@/schemas/whoop";
import { useState } from "react";
import { Text, View } from "react-native";
import { VictoryContainer, VictoryPie } from "victory-native";
import { SleepIcon } from "../icons";
import RadioSelect from "../RadioSelect";

interface SleepSectionProps {
  p1Name: string;
  p2Name?: string;
  p1Score?: number;
  p2Score?: number;
  p1StageSummary?: SleepStageSummary;
  p2StageSummary?: SleepStageSummary;
}

const defaultStageSummary: SleepStageSummary = {
  total_in_bed_time_milli: 0,
  total_awake_time_milli: 0,
  total_no_data_time_milli: 0,
  total_light_sleep_time_milli: 0,
  total_slow_wave_sleep_time_milli: 0,
  total_rem_sleep_time_milli: 0,
  sleep_cycle_count: 0,
  disturbance_count: 0,
};

export default function SleepSection({
  p1Name,
  p2Name,
  p1Score = 0,
  p2Score = 0,
  p1StageSummary = defaultStageSummary,
  p2StageSummary = defaultStageSummary,
}: SleepSectionProps) {
  const { t, isRTL } = useLocalization("components.wellbeing.sleep");
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);

  // Parse all p1StageSummary values as number
  for (const key in p1StageSummary) {
    p1StageSummary[key as keyof SleepStageSummary] = Number(
      p1StageSummary[key as keyof SleepStageSummary],
    );
  }

  // Parse all p2StageSummary values as number
  for (const key in p2StageSummary) {
    p2StageSummary[key as keyof SleepStageSummary] = Number(
      p2StageSummary[key as keyof SleepStageSummary],
    );
  }

  // Calculate percentages
  const p1_total =
    p1StageSummary.total_rem_sleep_time_milli +
    p1StageSummary.total_slow_wave_sleep_time_milli +
    p1StageSummary.total_light_sleep_time_milli +
    p1StageSummary.total_awake_time_milli;
  const p1_remPercent = Math.round(
    (p1StageSummary.total_rem_sleep_time_milli / p1_total) * 100,
  );
  const p1_swsPercent = Math.round(
    (p1StageSummary.total_slow_wave_sleep_time_milli / p1_total) * 100,
  );
  const p1_lightPercent = Math.round(
    (p1StageSummary.total_light_sleep_time_milli / p1_total) * 100,
  );
  const p1_awakePercent = Math.round(
    (p1StageSummary.total_awake_time_milli / p1_total) * 100,
  );

  const p2_total =
    p2StageSummary.total_rem_sleep_time_milli +
    p2StageSummary.total_slow_wave_sleep_time_milli +
    p2StageSummary.total_light_sleep_time_milli +
    p2StageSummary.total_awake_time_milli;
  const p2_remPercent = Math.round(
    (p2StageSummary.total_rem_sleep_time_milli / p2_total) * 100,
  );
  const p2_swsPercent = Math.round(
    (p2StageSummary.total_slow_wave_sleep_time_milli / p2_total) * 100,
  );
  const p2_lightPercent = Math.round(
    (p2StageSummary.total_light_sleep_time_milli / p2_total) * 100,
  );
  const p2_awakePercent = Math.round(
    (p2StageSummary.total_awake_time_milli / p2_total) * 100,
  );

  // Data for the pie chart
  const p1Data = [
    { x: "rem", y: p1_remPercent, color: colors.sleepRem }, // Purple
    { x: "sws", y: p1_swsPercent, color: colors.sleepSws }, // Dark blue
    { x: "light", y: p1_lightPercent, color: colors.sleepLight }, // Light blue
    { x: "awake", y: p1_awakePercent, color: colors.sleepAwake }, // Teal
  ];

  const p2Data = [
    { x: "rem", y: p2_remPercent, color: colors.sleepRem }, // Purple
    { x: "sws", y: p2_swsPercent, color: colors.sleepSws }, // Dark blue
    { x: "light", y: p2_lightPercent, color: colors.sleepLight }, // Light blue
    { x: "awake", y: p2_awakePercent, color: colors.sleepAwake }, // Teal
  ];

  // Check if all values are 0 and create a solid color chart if needed
  const p1HasData = p1Data.some((item) => item.y > 0);
  const p2HasData = p2Data.some((item) => item.y > 0);

  const p1ChartData = p1HasData
    ? p1Data.filter((item) => item.y > 0)
    : [{ x: "noData", y: 100, color: colors.sleep }]; // Show solid color when no data

  const p2ChartData = p2HasData
    ? p2Data.filter((item) => item.y > 0)
    : [{ x: "noData", y: 100, color: colors.sleepVeryLight }]; // Show solid color when no data

  const circle1Data = selectedPlayer === 0 ? p1ChartData : p2ChartData;
  const circle2Data = selectedPlayer === 0 ? p2ChartData : p1ChartData;

  const score = selectedPlayer === 0 ? p1Score : p2Score;

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
          <View>
            <VictoryPie
              data={circle1Data}
              width={186}
              height={186}
              innerRadius={70}
              colorScale={circle1Data.map((item) => item.color)}
              padding={0}
              containerComponent={<VictoryContainer />}
              labels={() => null}
              style={{
                data: {
                  strokeWidth: 0,
                },
              }}
              padAngle={1.5}
              cornerRadius={20}
            />

            {/* Center Score */}
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-4xl font-bold text-black">
                {score ? Math.round(score * 100) : "--"}
              </Text>
            </View>
          </View>

          {p2Name && (
            <View
              className="absolute"
              style={{ top: -10, left: -10, opacity: 0.4 }}
            >
              <VictoryPie
                data={circle2Data}
                width={206}
                height={206}
                innerRadius={98}
                colorScale={circle2Data.map((item) => item.color)}
                padding={0}
                containerComponent={<VictoryContainer />}
                labels={() => null}
                style={{
                  data: {
                    strokeWidth: 0,
                  },
                }}
                padAngle={1.5}
                cornerRadius={20}
              />
            </View>
          )}
        </View>

        {/* Legend */}
        <View className="ml-5" style={{ gap: 16 }}>
          {circle1Data.map((item, index) => {
            if (item.x === "noData") return null;
            return (
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
                    {t(item.x)}
                  </Text>
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      {p2Name && (
        <View className="mt-4">
          <RadioSelect
            p1Color={colors.sleep}
            p2Color={colors.sleepVeryLight}
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
