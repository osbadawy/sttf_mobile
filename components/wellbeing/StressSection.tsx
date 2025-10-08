import colors from "@/colors.js";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useState } from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import CardWithTitle from "../CardWithTitle";
import { StressIcon } from "../icons";
import RadioSelect from "../RadioSelect";

interface StressSectionProps {
  p1Name: string;
  p2Name?: string;
  p1StressToday: number;
  p2StressToday?: number;
  p1AvgStress: number;
  p2AvgStress?: number;
}

interface ArcProps {
  cx: number;
  cy: number;
  r: number;
  stroke: string;
  strokeWidth: number;
  strokeDasharray: number;
  strokeDashoffset: number;
}

export default function StressSection({
  p1Name,
  p2Name,
  p1StressToday,
  p2StressToday,
  p1AvgStress,
  p2AvgStress,
}: StressSectionProps) {
  const { t: tWellbeing } = useLocalization(
    "components.dashboard.wellbeingSection",
  );
  const { t, isRTL } = useLocalization("stats");
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);

  const todaysDate = new Date()
    .toLocaleDateString("en-US", { day: "2-digit", month: "2-digit" })
    .replace("/", ".");

  const c1_radius = 70 + 11;
  const c1_circumference = 2 * Math.PI * c1_radius;
  const c1_removeFromCircle = 0.25;
  const c1_stressPercentage =
    selectedPlayer === 0 ? p1StressToday / 10 : (p2StressToday || 0) / 10;
  const c1_centerX = 150;
  const c1_centerY = 150;

  const c2_radius = c1_radius + 23;
  const c2_circumference = 2 * Math.PI * c2_radius;
  const c2_removeFromCircle = 0.25;
  const c2_stressPercentage =
    selectedPlayer === 0 && p2Name
      ? (p2StressToday || 0) / 10
      : p1StressToday / 10;
  const c2_centerX = 150;
  const c2_centerY = 150;

  const stressToday = selectedPlayer === 0 ? p1StressToday : p2StressToday;
  const avgStress = selectedPlayer === 0 ? p1AvgStress : p2AvgStress;

  return (
    <CardWithTitle
      title={tWellbeing("stress")}
      icon={<StressIcon />}
      titleColor="text-black"
      arrow={false}
      isRTL={isRTL}
    >
      <View>
        <Text
          className={`font-inter-semibold text-2xl ${isRTL ? "text-right" : "text-left"}`}
        >
          {avgStress ? avgStress.toFixed(1) : "--"}
        </Text>
        <Text
          className={`w-full text-base ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("14DayAvg")}
        </Text>
      </View>
      <View className="flex w-full items-center">
        <Svg width={300} height={250}>
          <Circle
            cx={c1_centerX}
            cy={c1_centerY}
            r={c1_radius}
            stroke={
              selectedPlayer === 0 ? colors.stressBar : colors.stressVeryLight
            }
            strokeWidth={23}
            fill="none"
            strokeDasharray={c1_circumference}
            strokeDashoffset={c1_circumference * c1_removeFromCircle}
            strokeLinecap="round"
            transform={`rotate(135 ${c1_centerX} ${c1_centerY})`}
            opacity={0.2}
          />

          <Circle
            cx={c1_centerX}
            cy={c1_centerY}
            r={c1_radius}
            stroke={
              selectedPlayer === 0 ? colors.stressBar : colors.stressVeryLight
            }
            strokeWidth={23}
            fill="none"
            strokeDasharray={c1_circumference}
            strokeDashoffset={
              c1_circumference *
              (c1_removeFromCircle +
                (1 - c1_stressPercentage) * (1 - c1_removeFromCircle))
            }
            strokeLinecap="round"
            transform={`rotate(135 ${c1_centerX} ${c1_centerY})`}
          />

          {p2Name && (
            <>
              <Circle
                cx={c2_centerX}
                cy={c2_centerY}
                r={c2_radius}
                stroke={
                  selectedPlayer === 0
                    ? colors.stressVeryLight
                    : colors.stressBar
                }
                strokeWidth={4}
                fill="none"
                strokeDasharray={c2_circumference}
                strokeDashoffset={c2_circumference * c2_removeFromCircle}
                strokeLinecap="round"
                transform={`rotate(135 ${c2_centerX} ${c2_centerY})`}
                opacity={0.2}
              />

              <Circle
                cx={c2_centerX}
                cy={c2_centerY}
                r={c2_radius}
                stroke={
                  selectedPlayer === 0
                    ? colors.stressVeryLight
                    : colors.stressBar
                }
                strokeWidth={4}
                fill="none"
                strokeDasharray={c2_circumference}
                strokeDashoffset={
                  c2_circumference *
                  (c2_removeFromCircle +
                    (1 - c2_stressPercentage) * (1 - c2_removeFromCircle))
                }
                strokeLinecap="round"
                transform={`rotate(135 ${c2_centerX} ${c2_centerY})`}
              />
            </>
          )}

          {/* Center text */}
          <View
            style={{
              position: "absolute",
              left: c1_centerX - 50,
              top: c1_centerY - 30,
              width: 100,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="font-inter-semibold text-5xl pb-2">
              {stressToday ? stressToday.toFixed(1) : "--"}
            </Text>
            <Text className="font-inter-light text-xs text-[#969696]">
              {todaysDate}
            </Text>
          </View>
        </Svg>
      </View>
      {p2Name && (
        <View className="mt-4">
          <RadioSelect
            p1Color={colors.stressBar}
            p2Color={colors.stressVeryLight}
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
