import colors from "@/colors.js";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

// Create animated SVG components
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface FeelingCircleProps {
  score: number;
  size: "small" | "large";
}

export default function FeelingCircle({ score, size }: FeelingCircleProps) {
  const { t } = useLocalization("components.activities.activityView.feelings");
  const animatedValue = useRef(new Animated.Value(0)).current;

  const feelings = ["veryBad", "bad", "moderate", "good", "veryGood"];

  const feelingsColors = [
    colors.red,
    colors.orange,
    colors.yellow,
    colors.blue,
    colors.green,
  ];

  // Calculate which feeling category the score falls into
  const feelingIndex = Math.min(
    Math.floor(score * feelings.length),
    feelings.length - 1,
  );
  const currentFeeling = feelings[feelingIndex];
  const currentColor = feelingsColors[feelingIndex];

  // SVG circle properties
  const width = size === "small" ? 140 : 200;
  const strokeWidth = size === "small" ? 18 : 26;
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke-dasharray and stroke-dashoffset for progress
  const progressOffset = circumference - score * circumference;

  // Animation effect - reset and animate every time component mounts
  useEffect(() => {
    // Reset to 0 first
    animatedValue.setValue(0);
    // Then animate to the target score
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [score, animatedValue]);

  // Interpolate the animated value to stroke-dashoffset
  const animatedStrokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference - score * circumference],
  });

  return (
    <View className="items-center justify-center">
      <AnimatedSvg width={width} height={width}>
        {/* Background circle */}
        <Circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke={currentColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeOpacity={0.1}
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke={currentColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${width / 2} ${width / 2})`}
        />
      </AnimatedSvg>
      {/* Text overlay */}
      <View
        className="absolute items-center justify-center"
        style={{
          width: width,
          height: width,
        }}
      >
        <Text
          className={`${size === "small" ? "text-base" : "text-2xl"} effra-semibold text-center`}
          style={{ color: currentColor }}
        >
          {t(currentFeeling)}
        </Text>
      </View>
    </View>
  );
}
