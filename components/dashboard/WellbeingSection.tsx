import colors from "@/colors.js";
import { PerformanceIcon, StrainIcon, StressIcon } from "@/components/icons";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CIRCLE_RADIUS = 108;
const STROKE_WIDTH = 20;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const ProgressCircle = ({ percentage, color, radiusOffset, animatedValue, cx }: { 
  percentage: number, 
  color: string, 
  radiusOffset: number,
  animatedValue: Animated.Value,
  cx: number
}) => {
  return (
    <AnimatedCircle
      stroke={color}
      fill="none"
      cx={cx}
      cy="200"
      r={CIRCLE_RADIUS - radiusOffset}
      strokeWidth={STROKE_WIDTH}
      strokeDasharray={CIRCUMFERENCE}
      strokeDashoffset={animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [CIRCUMFERENCE, CIRCUMFERENCE - (CIRCUMFERENCE * percentage) / 100],
        extrapolate: 'clamp',
      })}
      strokeLinecap="round"
      transform={`rotate(-90 ${cx} 200)`}
    />
  );
};

const ProgressLabel = ({label, value, offset, icon}: {label: string, value: number, offset: number, icon: React.ReactNode}) => {
  let containerClassName = "items-center flex-1"
  if (offset !== 0) {
    containerClassName += " transform -translate-y-[21px]"
  }
  return (
    <View className={containerClassName}>
      {icon}
      <Text className="text-black font-extrabold text-4xl">{value}%</Text>
      <Text className="text-black font-light text-sx">{label}</Text>
    </View>
  );
};

export default function WellbeingSection({performance, stress, strain}: {performance: number, stress: number, strain: number}) {
  const { t } = useLocalization('components.wellbeingSection');

  const windowWidth = Dimensions.get("window").width;
  // Create animated values for each progress circle
  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;
  const progress3 = useRef(new Animated.Value(0)).current;

  const center = windowWidth / 2;

  useEffect(() => {
    // Start animations with a slight delay between each circle
    const animateProgress = () => {
      Animated.parallel([
        Animated.timing(progress1, {
          toValue: performance,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(progress2, {
          toValue: stress,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(progress3, {
          toValue: strain,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]).start();
    };

    // Start animation after a short delay
    const timer = setTimeout(animateProgress, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center">
      <Svg width={windowWidth} height={600}>
        {/* Background Circles */}
        <Circle
          cx={center}
          cy="200"
          r={CIRCLE_RADIUS}
          stroke={colors.performanceLight}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={center}
          cy="200"
          r={CIRCLE_RADIUS - 28}
          stroke={colors.strainLight}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={center}
          cy="200"
          r={CIRCLE_RADIUS - 56}
          stroke={colors.stressLight}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        <Circle
          cx={center}
          cy="200"
          r={143}
          stroke="#797979"
          strokeWidth={1}
          fill="none"
          // dashes
          strokeDasharray={8}
        />

        <Circle
          cx={center}
          cy="200"
          r={300}
          stroke="#797979"
          strokeWidth={1}
          fill="none"
          // dashes
          strokeDasharray={8}
        />

        {/* Foreground Progress - Animated */}
        <ProgressCircle 
          percentage={performance} 
          color={colors.performance} 
          radiusOffset={0} 
          animatedValue={progress1}
          cx={center}
        />
        <ProgressCircle 
          percentage={strain} 
          color={colors.strain} 
          radiusOffset={28} 
          animatedValue={progress2}
          cx={center}
        />
        <ProgressCircle 
          percentage={stress} 
          color={colors.stress} 
          radiusOffset={56} 
          animatedValue={progress3}
          cx={center}
        />
      </Svg>

       <View className="flex-row justify-between w-full items-center mt-5 absolute top-[360px]">
         <ProgressLabel label={t('performance')} value={performance} offset={-21} icon={<PerformanceIcon />} />
         <ProgressLabel label={t('strain')} value={strain} offset={0} icon={<StrainIcon />} />
         <ProgressLabel label={t('stress')} value={stress} offset={-21} icon={<StressIcon />} />
       </View>
    </View>
  );
}
