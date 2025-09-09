import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, FeComposite, FeFlood, FeGaussianBlur, Filter } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CIRCLE_RADIUS = 108;
const STROKE_WIDTH = 20;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const ProgressCircle = ({ percentage, color, radiusOffset, animatedValue }: { 
  percentage: number, 
  color: string, 
  radiusOffset: number,
  animatedValue: Animated.Value 
}) => {
  return (
    <AnimatedCircle
      stroke={color}
      fill="none"
      cx="200"
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
      transform="rotate(-90 200 200)"
    />
  );
};

export default function WellbeingChart({performance, stress, strain}: {performance: number, stress: number, strain: number}) {
  // Create animated values for each progress circle
  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;
  const progress3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations with a slight delay between each circle
    const animateProgress = () => {
      Animated.sequence([
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
    <View style={styles.container}>
      <Svg width={400} height={400}>
        <Defs>
            <Filter id="inset-shadow">
            <FeFlood flood-color="#00000040"/>
            <FeComposite operator="out" in2="SourceGraphic"/>
            <FeGaussianBlur stdDeviation="4"/>
            <FeComposite operator="atop" in2="SourceGraphic"/>
            </Filter>
        </Defs>


        {/* Background Circles */}
        <Circle
          cx="200"
          cy="200"
          r={CIRCLE_RADIUS}
          stroke="#CDEDDD"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          filter="url(#inset-shadow)"
        />
        <Circle
          cx="200"
          cy="200"
          r={CIRCLE_RADIUS - 28}
          stroke="#E5F5F5"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          filter="url(#inset-shadow)"
        />
        <Circle
          cx="200"
          cy="200"
          r={CIRCLE_RADIUS - 56}
          stroke="#FFEBDF"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          filter="url(#inset-shadow)"
        />

        {/* Foreground Progress - Animated */}
        <ProgressCircle 
          percentage={performance} 
          color="#22c55e" 
          radiusOffset={0} 
          animatedValue={progress1}
        />
        <ProgressCircle 
          percentage={stress} 
          color="#06b6d4" 
          radiusOffset={28} 
          animatedValue={progress2}
        />
        <ProgressCircle 
          percentage={strain} 
          color="#f97316" 
          radiusOffset={56} 
          animatedValue={progress3}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  labels: {
    marginTop: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
});
