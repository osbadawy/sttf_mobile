import { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, View } from "react-native";
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

const ProgressLabel = ({label, offset, iconSource}: {label: string, offset: number, iconSource: any}) => {
  return (
    <View style={styles.labelContainer}>
      <Image source={iconSource} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default function WellbeingChart({performance, stress, strain}: {performance: number, stress: number, strain: number}) {
  const windowWidth = Dimensions.get("window").width;
  // Create animated values for each progress circle
  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;
  const progress3 = useRef(new Animated.Value(0)).current;

  const center = windowWidth / 2;

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
      <Svg width={windowWidth} height={600}>
        {/* Background Circles */}
        <Circle
          cx={center}
          cy="200"
          r={CIRCLE_RADIUS}
          stroke="#CDEDDD"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={center}
          cy="200"
          r={CIRCLE_RADIUS - 28}
          stroke="#E5F5F5"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={center}
          cy="200"
          r={CIRCLE_RADIUS - 56}
          stroke="#FFEBDF"
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
          color="#22c55e" 
          radiusOffset={0} 
          animatedValue={progress1}
          cx={center}
        />
        <ProgressCircle 
          percentage={stress} 
          color="#06b6d4" 
          radiusOffset={28} 
          animatedValue={progress2}
          cx={center}
        />
        <ProgressCircle 
          percentage={strain} 
          color="#f97316" 
          radiusOffset={56} 
          animatedValue={progress3}
          cx={center}
        />
      </Svg>

       <View style={styles.labels}>
         <ProgressLabel label="Performance" offset={-21} iconSource={require("../../assets/icons/Performance.svg")} />
         <ProgressLabel label="Stress" offset={0} iconSource={require("../../assets/icons/stress.svg")} />
         <ProgressLabel label="Strain" offset={-21} iconSource={require("../../assets/icons/strain.svg")} />
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    position: "absolute",
    top: 380,
  },
  labelContainer: {
    alignItems: "center",
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    marginVertical: 4,
    textAlign: "center",
    color: "#000",
  },
  labelOffset: {
    transform: [{ translateY: -21 }],
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
