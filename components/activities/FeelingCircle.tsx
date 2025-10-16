import colors from "@/colors.js";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

// Create animated SVG components
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface FeelingPointsCircleProps {
  score: number;
  maxScore: number;
}

export default function FeelingCircle({
  score,
  maxScore,
}: FeelingPointsCircleProps) {
  const { t } = useTranslation();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const scoresColors = [
    colors.red,
    colors.orange,
    colors.yellow,
    colors.blue,
    colors.green,
  ];

  // Calculate which feeling category the score falls into
  const feelingIndex = Math.min(
    Math.floor((score / maxScore) * scoresColors.length),
    scoresColors.length - 1,
  );
  const currentColor = scoresColors[feelingIndex];

  // SVG circle properties
  const width = 140;
  const strokeWidth = 18;
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke-dasharray and stroke-dashoffset for progress
  const progressRatio = score / maxScore;
  const progressOffset = circumference - progressRatio * circumference;

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
    inputRange: [0, maxScore],
    outputRange: [circumference, circumference - progressRatio * circumference],
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
          className={`text-5xl effra-semibold text-center`}
          style={{ color: currentColor }}
        >
          {score}
        </Text>
      </View>
    </View>
  );
}
