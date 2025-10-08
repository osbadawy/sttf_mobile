import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Text, View } from "react-native";
import CardWithTitle from "../CardWithTitle";
import { HeartLine3 } from "../icons";
import RadioSelect from "../RadioSelect";

interface HeartRateHistory {
  resting: number;
  max: number;
  day: string;
}

interface MaxAndRestingHeartRateSectionProps {
  p1Name: string;
  p2Name?: string;
  p1History: HeartRateHistory[];
  p2History?: HeartRateHistory[];
}

function Bar({
  item,
  highlightColor,
  maxVal,
  minVal,
  secondaryExists,
  opacity,
}: {
  item: HeartRateHistory;
  highlightColor: string;
  maxVal: number;
  minVal: number;
  secondaryExists: boolean;
  opacity: number;
}) {

  const barWidth = secondaryExists ? 3 : 5;
  const circleWidth = secondaryExists ? 11 : 13;

  // Calculate the maximum possible height to ensure height - yTranslate <= 200
  const maxPossibleHeight = 200 - Math.abs(minVal - item.resting - circleWidth - 10);
  const scaleFactor = Math.min(1, maxPossibleHeight / 200);
  
  const height = ((item.max - item.resting) / (maxVal - minVal)) * 200 * scaleFactor;
  const gradientColors = [highlightColor, colors.heartResting];

  const show = item.max !== 0 && item.resting !== 0;

  const yTranslate = minVal - item.resting - circleWidth - 10;


  return (
    <View
      style={{
        height: Math.round(height),
        transform: [{ translateY: yTranslate }],
        alignItems: "center",
        opacity: show ? opacity : 0,
      }}
    >
      {/* Top circle */}
      <View
        className={`rounded-full bg-white mb-[-1px] border-[3px] border-solid`}
        style={{
          borderColor: highlightColor,
          width: circleWidth,
          height: circleWidth,
        }}
      />

      {/* Gradient bar */}
      <LinearGradient
        colors={gradientColors as [string, string]}
        style={{
          width: barWidth,
          height: Math.round(height) - 8,
        }}
      />

      {/* Bottom circle */}
      <View
        className={`rounded-full bg-white mt-[-1px] border-[3px] border-solid`}
        style={{
          borderColor: colors.heartResting,
          width: circleWidth,
          height: circleWidth,
        }}
      />
    </View>
  );
}

function Graph({
  p1history,
  p2history,
  p1highlightColor,
  p2highlightColor,
  maxVal,
  minVal,
  secondaryExists = false,
  selectedPlayer,
}: {
  p1history: HeartRateHistory[];
  p2history: HeartRateHistory[];
  p1highlightColor: string;
  p2highlightColor: string;
  maxVal: number;
  minVal: number;
  secondaryExists?: boolean;
  selectedPlayer: number;
}) {
  const zip = (a: HeartRateHistory[], b: HeartRateHistory[]) => a.map((k, i) => [k, b[i]]);
  const history = zip(p1history, p2history);


  return (
      <View
      className="h-[200px] w-full flex-row flex justify-center items-end"
    >
      {history.map((items, index) => {
        const isLatest = index === history.length - 1;

        let p1_opacity = isLatest ? 1 : 0.3;
        let p2_opacity = 0;
        if (secondaryExists){
          p1_opacity = selectedPlayer === 0 ? 1 : 0.3;
          p2_opacity = selectedPlayer === 1 ? 1 : 0.3;
        }



        return (
        <View className={`flex-row h-[200px] justify-center items-end` }
        key={index} 
        style={{ 
          borderRightWidth: secondaryExists && !isLatest ? 0.5 : 0,
          borderRightColor: "#E8E8E8",
          paddingHorizontal: 5,
          gap: 3,
        }}
        >
          {
            secondaryExists && <Bar
            item={items[1]}
            highlightColor={p2highlightColor}
            maxVal={maxVal}
            minVal={minVal}
            secondaryExists={secondaryExists}
            opacity={p2_opacity}
          />
          }

          <Bar
            item={items[0]}
            highlightColor={p1highlightColor}
            maxVal={maxVal}
            minVal={minVal}
            secondaryExists={secondaryExists}
            opacity={p1_opacity}
          />
        </View>
        )
      })}
    </View>
  );
}

export default function MaxAndRestingHeartRateSection({
  p1Name,
  p2Name,
  p1History,
  p2History,
}: MaxAndRestingHeartRateSectionProps) {
  const { t: tHeart } = useLocalization("components.heart");
  const { t, isRTL } = useLocalization("stats");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(0);

  const p1Color = colors.heart;
  const p2Color = colors.yellow;

  if (!p2History || p2History.length === 0) {
    p2History = p1History.map(item => ({
      ...item,
      max: 0,
      resting: 0,
    }));
  }
  
  const p1FliteredHistory = p1History.filter((item) => item.max !== 0 && item.resting !== 0);
  const p2FliteredHistory = p2History?.filter((item) => item.max !== 0 && item.resting !== 0);

  const minP1Val = p1FliteredHistory
    .map((item) => item.resting)
    .reduce((a, b) => Math.min(a, b), Infinity);
  const minP2Val = p2FliteredHistory
    ?.map((item) => item.resting)
    .reduce((a, b) => Math.min(a, b), Infinity);
  const minVal = Math.min(minP1Val, minP2Val);

  const maxP1Val = p1FliteredHistory
    .map((item) => item.max)
    .reduce((a, b) => Math.max(a, b), -Infinity);
  const maxP2Val = p2FliteredHistory
    ?.map((item) => item.max)
    .reduce((a, b) => Math.max(a, b), -Infinity);
  const maxVal = Math.max(maxP1Val, maxP2Val);

  const latestP1 = p1History[p1History.length - 1];
  const latestP2 = p2History[p2History.length - 1];
  const latest = selectedPlayer === 0 ? latestP1 : latestP2;

  const p1AverageMax =
    p1History.map((item) => item.max).reduce((a, b) => a + b, 0) /
    p1History.length;

  const p1AverageResting =
    p1History.map((item) => item.resting).reduce((a, b) => a + b, 0) /
    p1History.length;

  if(p2Name){
    p1History = p1History.slice(-7);
    p2History = p2History.slice(-7);
  }

  return (
    <CardWithTitle
      title={tHeart("maxRestingTitle")}
      icon={<HeartLine3 />}
      titleColor="text-black"
      arrow={false}
      isRTL={isRTL}
      className="px-6"
    >
      <View className="flex-row justify-start pt-8">
        <View style={{ width: "50%" }}>
          <Text className="effra-medium text-base pb-3">{t("max")}</Text>
          <Text className="font-inter-semibold text-3xl">
            {latest ? `${latest["max"].toString()} ` : "-- "}
            <Text className="font-inter-light text-base text-[#4B4B4B]">
              bpm
            </Text>
          </Text>
        </View>
        <View style={{ width: "50%" }}>
          <Text className="effra-medium text-base pb-3">{t("resting")}</Text>
          <Text className="font-inter-semibold text-3xl text-[#757575]">
            {latest ? `${latest["resting"].toString()} ` : "-- "}
            <Text className="font-inter-light text-base text-[#969696]">
              bpm
            </Text>
          </Text>
        </View>
      </View>

      <Graph
        p1history={p1History}
        p2history={p2History}
        p1highlightColor={p1Color}
        p2highlightColor={p2Color}
        maxVal={maxVal}
        minVal={minVal}
        secondaryExists={Boolean(p2Name)}
        selectedPlayer={selectedPlayer}
      />


      <View className="mb-6 mt-10 w-full border-b-[2px] border-dotted border-[#BDBDBD]" />

      <Text
        className={` effra-medium text-base pb-3 ${isRTL ? "text-right" : "text-left"}`}
      >
        {t("14DayAvg")}
      </Text>
      <View className="flex-row justify-start mb-4">
        <Text style={{ width: "50%" }}>
          <Text className="font-inter-semibold text-3xl">
            {Math.round(p1AverageMax) + " "}
          </Text>
          <Text className="font-inter-light text-xs text-[#4B4B4B]">bpm</Text>
        </Text>
        <Text style={{ width: "50%" }}>
          <Text className="font-inter-semibold text-3xl text-[#757575]">
            {Math.round(p1AverageResting) + " "}
          </Text>
          <Text className="font-inter-light text-xs text-[#969696]">bpm</Text>
        </Text>
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
