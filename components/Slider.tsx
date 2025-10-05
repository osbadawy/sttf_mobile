import colors from "@/colors.js";
import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";
import {
  HappyFaceIcon,
  NeutralFaceIcon,
  SadFaceIcon,
  VeryHappyFaceIcon,
  VerySadFaceIcon,
} from "./icons/faces";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
}

export default function CustomSlider({
  value,
  onChange,
  leftLabel,
  rightLabel,
}: SliderProps) {
  const iconColors = [
    colors.red,
    colors.orange,
    colors.yellow,
    colors.blue,
    colors.green,
  ];

  const icons = [
    VerySadFaceIcon,
    SadFaceIcon,
    NeutralFaceIcon,
    HappyFaceIcon,
    VeryHappyFaceIcon,
  ];

  // Calculate which icon is closest to the current value
  const getClosestIconIndex = () => {
    const iconPositions = [1, 3, 5, 7, 9]; // Positions for each icon (1-2, 3-4, 5-6, 7-8, 9-10)
    let closestIndex = 0;
    let minDistance = Math.abs(value - iconPositions[0]);

    for (let i = 1; i < iconPositions.length; i++) {
      const distance = Math.abs(value - iconPositions[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    return closestIndex;
  };

  const closestIconIndex = getClosestIconIndex();
  const activeColor = iconColors[closestIconIndex];

  return (
    <View className="px-5 py-5">
      {/* Icons Row */}
      <View className="flex-row justify-between items-center mb-2 px-3">
        {icons.map((IconComponent, index) => {
          const isActive = index === closestIconIndex;
          const scale = isActive ? 1.5 : 1; // Scale factor instead of pixel size
          const iconFill = isActive ? iconColors[index] : "#B0B8B7";

          return (
            <View key={index} className="items-center justify-center">
              <View style={{ transform: [{ scale }] }}>
                <IconComponent fill={iconFill} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Numbers Row */}
      <View className="flex-row justify-between items-center px-4">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <Text
            key={num}
            className={"font-inter-regular text-base"}
            style={{
              color: num === Math.round(value) ? activeColor : "#B0B8B7",
            }}
          >
            {num}
          </Text>
        ))}
      </View>

      {/* Slider */}
      <View className="mb-3 h-10 justify-center">
        <Slider
          className="w-full h-10"
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor={activeColor}
          maximumTrackTintColor="#E5F5F5"
          thumbTintColor={activeColor}
        />
      </View>

      {/* Labels Row */}
      <View className="flex-row justify-between items-center px-4">
        <Text className="text-base effra-light" style={{ opacity: 0.6 }}>
          {leftLabel}
        </Text>
        <Text className="text-base effra-light" style={{ opacity: 0.6 }}>
          {rightLabel}
        </Text>
      </View>
    </View>
  );
}
