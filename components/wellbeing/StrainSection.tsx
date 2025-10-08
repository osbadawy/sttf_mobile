import colors from "@/colors.js";
import CardWithTitle from "@/components/CardWithTitle";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useState } from "react";
import { Text, View } from "react-native";
import { VictoryBar, VictoryChart, VictoryStack } from "victory-native";
import { StrainIcon } from "../icons";
import RadioSelect from "../RadioSelect";

interface StrainSectionBaseProps {
  p1StrainToday?: number; //0 - 21
  p2StrainToday?: number; //0 - 21
  p1AvgStrain?: number;
  p2AvgStrain?: number;
}

interface StrainSectionProps extends StrainSectionBaseProps {
  p1Name: string;
  p2Name?: string;
}

interface StrainSectionLineProps extends StrainSectionBaseProps {
  selectedPlayer: number;
  secondaryExists: boolean;
}

interface StrainMarkerProps {
  left: number;
  marker: React.ReactNode;
  scale?: number;
}

function StrainMarker({ left, marker, scale = 1 }: StrainMarkerProps) {
  return (
    <>
      <View
        style={{
          left: left,
          position: "absolute",
          top: "50%",
          transform: [{ translateY: "-50%" }, { scale }],
        }}
      >
        {marker}
      </View>
    </>
  );
}

export function StrainSectionLine({
  p1StrainToday,
  p2StrainToday,
  p1AvgStrain,
  p2AvgStrain,
  selectedPlayer,
  secondaryExists,
}: StrainSectionLineProps) {
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

  const defaultMarker = (
    <View
      className={`bg-strain w-5 h-5 rounded-full border-background border-2 border-solid`}
    />
  );
  const defaultSecondaryMarker = (
    <View
      className={`bg-[#3C3C3C] w-2 h-6 border-background border-2 border-solid`}
    />
  );

  const p1ComparisonMarker = (
    <View className="bg-strainVeryLight w-[20px] h-[20px] rounded-full border-background border-[2px] items-center justify-center">
      <View
        className={`bg-strainVeryLight w-[12px] h-[12px] rounded-full border-background border-[2px]`}
      />
    </View>
  );
  const p2ComparisonMarker = (
    <View
      className={`bg-strain w-[20px] h-[20px] rounded-full border-background border-[2px]`}
    />
  );

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
        {!secondaryExists && p1StrainToday && (
          <StrainMarker
            left={getPositionOnLine(p1StrainToday, 8)}
            marker={defaultMarker}
          />
        )}
        {!secondaryExists && p1AvgStrain && (
          <StrainMarker
            left={getPositionOnLine(p1AvgStrain, 1)}
            marker={defaultSecondaryMarker}
          />
        )}

        {secondaryExists && (
          <StrainMarker
            left={getPositionOnLine(p1StrainToday || 0, 10)}
            marker={p1ComparisonMarker}
            scale={selectedPlayer === 0 ? 1 : 0.75}
          />
        )}
        {secondaryExists && (
          <StrainMarker
            left={getPositionOnLine(p2StrainToday || 0, 10)}
            marker={p2ComparisonMarker}
            scale={selectedPlayer === 1 ? 1 : 0.75}
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
  p1Name,
  p2Name,
  p1StrainToday,
  p2StrainToday,
  p1AvgStrain,
  p2AvgStrain,
}: StrainSectionProps) {
  const { t: tStats, isRTL } = useLocalization("stats");
  const { t: tWellbeing } = useLocalization(
    "components.dashboard.wellbeingSection",
  );

  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);

  const strainToday = selectedPlayer === 0 ? p1StrainToday : p2StrainToday;
  const avgStrain = selectedPlayer === 0 ? p1AvgStrain : p2AvgStrain;

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
            {strainToday ? strainToday + " " : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#4B4B4B]">
            {todaysDate}
          </Text>
        </Text>
        <Text>
          <Text className="font-inter-semibold text-3xl text-[#757575]">
            {avgStrain ? avgStrain + " " : "-- "}
          </Text>
          <Text className="font-inter-light text-xs text-[#969696]">
            {tStats("14DayAvg")}
          </Text>
        </Text>
      </View>
      <StrainSectionLine
        p1StrainToday={p1StrainToday}
        p2StrainToday={p2StrainToday}
        p1AvgStrain={p1AvgStrain}
        p2AvgStrain={p2AvgStrain}
        selectedPlayer={selectedPlayer}
        secondaryExists={Boolean(p2Name && p2AvgStrain)}
      />

      {p2Name && (
        <View className="mt-4">
          <RadioSelect
            p1Color={colors.strain}
            p2Color={colors.strainVeryLight}
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
