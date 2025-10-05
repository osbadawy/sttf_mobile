import colors from "@/colors.js";
import CardWithTitle from "@/components/CardWithTitle";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useState } from "react";
import { Text, View } from "react-native";
import { VictoryBar, VictoryChart, VictoryStack } from "victory-native";
import { StrainIcon } from "../icons";

interface StrainSectionProps {
  strainToday?: number; //0 - 21
  strain14Days?: number;
}

export function StrainSectionLine({
  strainToday,
  strain14Days,
}: StrainSectionProps) {
  const strainScale = {
    low: 10 / 21,
    moderate: 4 / 21,
    high: 4 / 21,
    all_out: 4 / 21,
  };

  const [containerWidth, setContainerWidth] = useState(0);

  const getPositionOnLine = (value: number, offset: number) => {
    return Math.round((value / 21) * containerWidth) - offset;
  };
  return (
    <>
      <View
        className="w-full mt-2 relative justify-center"
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      >
        <VictoryChart
          horizontal
          height={4}
          width={containerWidth}
          padding={{ left: 0, right: 0, top: 0, bottom: 0 }}
          domain={{ x: [0, 1], y: [0, 100] }}
        >
          <VictoryStack>
            <VictoryBar
              data={[{ x: 1, y: strainScale.low * 100 }]}
              style={{ data: { fill: colors.strainLow } }}
              barWidth={16}
            />
            <VictoryBar
              data={[{ x: 1, y: strainScale.moderate * 100 }]}
              style={{ data: { fill: colors.strainModerate } }}
              barWidth={16}
            />
            <VictoryBar
              data={[{ x: 1, y: strainScale.high * 100 }]}
              style={{ data: { fill: colors.strainHigh } }}
              barWidth={16}
            />
            <VictoryBar
              data={[{ x: 1, y: strainScale.all_out * 100 }]}
              style={{ data: { fill: colors.strainAllOut } }}
              barWidth={16}
            />
          </VictoryStack>
        </VictoryChart>
        {strainToday && (
          <View
            className={`absolute bg-strain w-5 h-5 rounded-full border-background border-2 border-solid`}
            style={{ left: getPositionOnLine(strainToday, 8) }}
          />
        )}
        {strain14Days && (
          <View
            className={`absolute bg-[#3C3C3C] w-2 h-6 border-background border-2 border-solid`}
            style={{ left: getPositionOnLine(strain14Days, 1) }}
          />
        )}
      </View>
      <View className="relative flex flex-row w-full mt-2">
        <Text className="effra-light" style={{ opacity: 0.7 }}>
          0
        </Text>
        <Text
          className="absolute effra-light "
          style={{ left: getPositionOnLine(10, 8), opacity: 0.7 }}
        >
          10
        </Text>
        <Text
          className="absolute effra-light"
          style={{ left: getPositionOnLine(14, 8), opacity: 0.7 }}
        >
          14
        </Text>
        <Text
          className="absolute effra-light"
          style={{ left: getPositionOnLine(18, 8), opacity: 0.7 }}
        >
          18
        </Text>
        <Text
          className="absolute effra-light"
          style={{ left: getPositionOnLine(21, 10), opacity: 0.7 }}
        >
          21
        </Text>
      </View>
    </>
  );
}

export default function StrainSection({
  strainToday,
  strain14Days,
}: StrainSectionProps) {
  const { t: tStats, isRTL } = useLocalization("stats");
  const { t: tWellbeing } = useLocalization(
    "components.dashboard.wellbeingSection",
  );

  //in the form of 02.09 not 02/09
  const todaysDate = new Date()
    .toLocaleDateString("en-US", { day: "2-digit", month: "2-digit" })
    .replace("/", ".");

  return (
    <CardWithTitle
      title={tWellbeing("strain")}
      icon={<StrainIcon />}
      titleColor="text-black"
      arrow={false}
      isRTL={isRTL}
    >
      <View className="flex-row justify-between">
        <Text>
          <Text className="font-inter-semibold text-3xl">
            {strainToday + " "}
          </Text>
          <Text className="font-inter-light text-xs text-[#4B4B4B]">
            {todaysDate}
          </Text>
        </Text>
        <Text>
          <Text className="font-inter-semibold text-3xl text-[#757575]">
            {strain14Days + " "}
          </Text>
          <Text className="font-inter-light text-xs text-[#969696]">
            {tStats("14DayAvg")}
          </Text>
        </Text>
      </View>
      <StrainSectionLine
        strainToday={strainToday}
        strain14Days={strain14Days}
      />
    </CardWithTitle>
  );
}
