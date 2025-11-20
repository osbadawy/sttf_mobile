import colors from "@/colors.js";
import {
  HeartLine1,
  PerformanceIcon,
  StrainIcon,
  StressIcon,
} from "@/components/icons";
import TitleWithIcon from "@/components/TitleWithIcon";
import { useLocalization } from "@/contexts/LocalizationContext";
import {
  RelativePathString,
  router,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CIRCLE_RADIUS = 108;
const STROKE_WIDTH = 20;

const ProgressCircle = ({
  color,
  radiusOffset,
  animatedValue,
  cx,
}: {
  color: string;
  radiusOffset: number;
  animatedValue: Animated.Value;
  cx: number;
}) => {
  const circumference = 2 * Math.PI * (CIRCLE_RADIUS - radiusOffset);
  return (
    <AnimatedCircle
      stroke={color}
      fill="none"
      cx={cx}
      cy="200"
      r={CIRCLE_RADIUS - radiusOffset}
      strokeWidth={STROKE_WIDTH}
      strokeDasharray={circumference}
      strokeDashoffset={animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
        extrapolate: "clamp",
      })}
      strokeLinecap="round"
      transform={`rotate(-90 ${cx} 200)`}
    />
  );
};

const ProgressLabel = ({
  label,
  value,
  offset,
  icon,
}: {
  label: string;
  value: number;
  offset: number;
  icon: React.ReactNode;
}) => {
  let containerClassName = "items-center flex-1";
  if (offset !== 0) {
    containerClassName += " transform -translate-y-[21px]";
  }
  return (
    <View className={containerClassName}>
      {icon}
      <Text>
        <Text className="text-black text-4xl effra-semibold">{value}</Text>
        <Text className="text-black effra-normal">%</Text>
      </Text>
      <Text className="text-black text-xs effra-light">{label}</Text>
    </View>
  );
};

export default function WellbeingSection({
  performance,
  strain,
  stress,
  animationDuration,
}: {
  performance: number;
  stress: number;
  strain: number;
  animationDuration: number;
}) {
  const { t, isRTL } =
    useLocalization("components.dashboard.wellbeingSection");
  const pathname = usePathname();
  const { player } = useLocalSearchParams();

  const windowWidth = Dimensions.get("window").width;
  const performanceRef = useRef(new Animated.Value(0)).current;
  const strainRef = useRef(new Animated.Value(0)).current;
  const stressRef = useRef(new Animated.Value(0)).current;

  const center = windowWidth / 2;

  useEffect(() => {
    const animateProgress = () => {
      Animated.parallel([
        Animated.timing(performanceRef, {
          toValue: performance,
          duration: animationDuration,
          useNativeDriver: false,
        }),
        Animated.timing(strainRef, {
          toValue: strain,
          duration: animationDuration,
          useNativeDriver: false,
        }),
        Animated.timing(stressRef, {
          toValue: stress,
          duration: animationDuration,
          useNativeDriver: false,
        }),
      ]).start();
    };

    const timer = setTimeout(animateProgress, 300);
    return () => clearTimeout(timer);
  }, [performance, strain, stress, animationDuration]);

  return (
    <TouchableOpacity
      className="flex-1 items-center"
      onPress={() =>
        router.push({
          pathname: `${pathname}/wellbeing` as RelativePathString,
          params: { player },
        })
      }
      activeOpacity={1}
    >
      <View className="w-full">
        <TitleWithIcon
          title={t("title")}
          titleColor="text-black"
          icon={<HeartLine1 />}
          isRTL={isRTL}
        />
      </View>

<Svg width={windowWidth} height={440}>
  {/* --- GRADIENT DEFS (added) --- */}
  <Defs>
    <LinearGradient
      id="outerShadowGradient"
      x1="0"
      y1="1"
      x2="0"
      y2="0"
      gradientUnits="objectBoundingBox"
    >
      <Stop offset="0" stopColor="rgba(242, 242, 242, 0.9)" />
      <Stop offset="1" stopColor="rgba(223, 223, 223, 0.15)" />
    </LinearGradient>
  </Defs>

    <Defs>
    <LinearGradient
      id="innerShadowGradient"
      x1="0"
      y1="1"
      x2="0"
      y2="0"
      gradientUnits="objectBoundingBox"
    >
      <Stop offset="1" stopColor="rgba(242, 242, 242, 0.9)" />
      <Stop offset="0" stopColor="rgba(223, 223, 223, 0.15)" />
    </LinearGradient>
  </Defs>

  {/* ---------- STATIC RINGS WITH INNER + OUTER SHADOW ---------- */}

  {/* OUTER RING */}
  <Circle
    cx={center}
    cy="200"
    r={CIRCLE_RADIUS}
    stroke={colors.performanceLight}
    strokeWidth={STROKE_WIDTH}
    fill="none"
  />

  {/* inner shadow */}
  <Circle
    cx={center}
    cy="200"
    r={CIRCLE_RADIUS - STROKE_WIDTH / 2}
    stroke="url(#innerShadowGradient)"
    strokeWidth={2}
    fill="none"
  />

  {/* outer gradient shadow (UPDATED HERE) */}
  <Circle
    cx={center}
    cy="200"
    r={CIRCLE_RADIUS + STROKE_WIDTH / 2}
    stroke="url(#outerShadowGradient)"
    strokeWidth={2}
    fill="none"
  />

  {/* --- MIDDLE RING --- */}
  <Circle
    cx={center}
    cy="200"
    r={CIRCLE_RADIUS - 28}
    stroke={colors.strainLight}
    strokeWidth={STROKE_WIDTH}
    fill="none"
  />

  {/* inner shadow */}
  <Circle
    cx={center}
    cy="200"
    r={CIRCLE_RADIUS - 28 - STROKE_WIDTH / 2}
    stroke="url(#innerShadowGradient)"
    strokeWidth={2}
    fill="none"
  />

  {/* outer gradient shadow */}
  <Circle
    cx={center}
    cy="200"
    r={CIRCLE_RADIUS - 28 + STROKE_WIDTH / 2}
    stroke="url(#outerShadowGradient)"
    strokeWidth={1}
    fill="none"
  />

  {/* --- INNER RING --- */}
  <Circle
    cx={center}
    cy="200"
    r={CIRCLE_RADIUS - 56}
    stroke={colors.stressLight}
    strokeWidth={STROKE_WIDTH}
    fill="none"
  />

  {/* inner shadow */}
  <Circle
    cx={center}
    cy="200"
    r={CIRCLE_RADIUS - 56 - STROKE_WIDTH / 2}
    stroke="url(#innerShadowGradient)"
    strokeWidth={2}
    fill="none"
  />

  {/* outer gradient shadow */}
  <Circle
    cx={center}
    cy="200"
    r={CIRCLE_RADIUS - 56 + STROKE_WIDTH / 2}
    stroke="url(#outerShadowGradient)"
    strokeWidth={2}
    fill="none"
  />

  {/* --- YOUR DASH RINGS (unchanged) --- */}
  <Circle
    cx={center}
    cy="200"
    r={143}
    stroke="#797979"
    strokeWidth={1}
    fill="none"
    strokeDasharray={8}
  />

  <View style={{ position: "absolute", zIndex: -1 }}>
    <Svg width={windowWidth} height={600}>
      <Circle
        cx={center}
        cy="200"
        r={300}
        stroke="#797979"
        strokeWidth={1}
        fill="none"
        strokeDasharray={8}
      />
    </Svg>
  </View>

  {/* --- YOUR FOREGROUND ANIMATED RINGS (unchanged) --- */}
  <ProgressCircle
    color={colors.performance}
    radiusOffset={0}
    animatedValue={performanceRef}
    cx={center}
  />
  <ProgressCircle
    color={colors.strain}
    radiusOffset={28}
    animatedValue={strainRef}
    cx={center}
  />
  <ProgressCircle
    color={colors.stress}
    radiusOffset={56}
    animatedValue={stressRef}
    cx={center}
  />
</Svg>;

      <View className="flex-row justify-between w-full items-center mt-5 absolute top-[360px]">
        <ProgressLabel
          label={t("performance")}
          value={Math.round(performance * 100)}
          offset={-21}
          icon={<PerformanceIcon />}
        />
        <ProgressLabel
          label={t("strain")}
          value={Math.round(strain * 100)}
          offset={0}
          icon={<StrainIcon />}
        />
        <ProgressLabel
          label={t("stress")}
          value={Math.round(stress * 100)}
          offset={-21}
          icon={<StressIcon />}
        />
      </View>
    </TouchableOpacity>
  );
}
