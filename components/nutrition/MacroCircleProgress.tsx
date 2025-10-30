// components/nutrition/MacroCircleProgress.tsx
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

export type MacroCircleProps = {
  totalCarbs?: number;
  totalProteins?: number;
  totalFats?: number;
  carbs?: number; // current
  protein?: number; // current
  fats?: number; // current
  size?: number; // px (outer)
  strokeWidth?: number; // ring thickness
  trackColor?: string;
  carbsColor?: string;
  proteinColor?: string;
  fatsColor?: string;
};

const deg2rad = (deg: number): number => (deg * Math.PI) / 180;

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  sweepFlag: 0 | 1,
): string {
  const start = {
    x: cx + r * Math.cos(deg2rad(startDeg)),
    y: cy + r * Math.sin(deg2rad(startDeg)),
  };
  const end = {
    x: cx + r * Math.cos(deg2rad(endDeg)),
    y: cy + r * Math.sin(deg2rad(endDeg)),
  };
  const largeArc = Math.abs(endDeg - startDeg) % 360 > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${end.x} ${end.y}`;
}

function dashForHalf(L_half: number, p: number): [number, number] {
  const clamped = Math.max(0, Math.min(1, p));
  const filled = clamped * L_half;
  return [filled, L_half - filled];
}

function pointOnCircle(
  cx: number,
  cy: number,
  r: number,
  deg: number,
): { x: number; y: number } {
  return {
    x: cx + r * Math.cos(deg2rad(deg)),
    y: cy + r * Math.sin(deg2rad(deg)),
  };
}

// Simple requestAnimationFrame tween
function useAnimatedValue(target: number, duration = 650): number {
  const [value, setValue] = useState<number>(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(0);
  const toRef = useRef<number>(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // start a new tween from current value to target
    fromRef.current = value;
    toRef.current = target;
    startRef.current = null;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const next = fromRef.current + (toRef.current - fromRef.current) * eased;
      setValue(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

export default function MacroCircleProgress({
  totalCarbs = 280,
  totalProteins = 150,
  totalFats = 132,
  carbs = 115,
  protein = 60,
  fats = 24,
  size = 220,
  strokeWidth = 22,
  trackColor = "#E5E7EB",
  carbsColor = "#FABB00", // Grain
  proteinColor = "#009FA0", // Protein
  fatsColor = "#F47B37", // Fat
}: MacroCircleProps) {
  const half = size / 2;
  const r = half - strokeWidth / 2;

  // Each segment is 120°, centered at these angles:
  const seg = { span: 120, halfSpan: 60, centers: [60, 180, 300] };

  // Target progress (0..1)
  const pCarbsTarget =
    totalCarbs > 0 ? Math.min(1, Math.max(0, carbs / totalCarbs)) : 0;
  const pProteinTarget =
    totalProteins > 0 ? Math.min(1, Math.max(0, protein / totalProteins)) : 0;
  const pFatsTarget =
    totalFats > 0 ? Math.min(1, Math.max(0, fats / totalFats)) : 0;

  // Animated progress
  const pCarbs = useAnimatedValue(pCarbsTarget);
  const pProtein = useAnimatedValue(pProteinTarget);
  const pFats = useAnimatedValue(pFatsTarget);

  const L_half = r * deg2rad(seg.halfSpan);

  const goalSum = totalCarbs + totalProteins + totalFats;
  const currentSum = carbs + protein + fats;
  const centerPct = goalSum > 0 ? Math.round((currentSum / goalSum) * 100) : 0;

  const markerOuterR = Math.max(3.5, strokeWidth * 0.28);
  const markerInnerR = markerOuterR * 0.45;

  const renderCategory = (centerDeg: number, fillColor: string, p: number) => {
    const startDeg = centerDeg - seg.halfSpan;
    const endDeg = centerDeg + seg.halfSpan;

    // Full track for this 120° slice
    const track = arcPath(half, half, r, startDeg, endDeg, 1);

    // Halves (center -> edges)
    const rightHalf = arcPath(half, half, r, centerDeg, endDeg, 1);
    const leftHalf = arcPath(half, half, r, centerDeg, startDeg, 0);

    const dash = dashForHalf(L_half, p);

    // Marker positions at the CURRENT filled ends (if p > 0)
    const rightAngle = centerDeg + p * seg.halfSpan;
    const leftAngle = centerDeg - p * seg.halfSpan;
    const rightPos = pointOnCircle(half, half, r, rightAngle);
    const leftPos = pointOnCircle(half, half, r, leftAngle);

    return (
      <G key={`seg-${centerDeg}`}>
        {/* Track */}
        <Path
          d={track}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />

        {/* Filled halves (symmetric) */}
        <Path
          d={rightHalf}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={dash}
        />
        <Path
          d={leftHalf}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={dash}
        />

        {/* End markers (only draw if we have some progress) */}
        {p > 0 && (
          <>
            <Circle
              cx={rightPos.x}
              cy={rightPos.y}
              r={markerOuterR}
              fill={fillColor}
            />
            <Circle
              cx={rightPos.x}
              cy={rightPos.y}
              r={markerInnerR}
              fill="#FFFFFF"
            />
            <Circle
              cx={leftPos.x}
              cy={leftPos.y}
              r={markerOuterR}
              fill={fillColor}
            />
            <Circle
              cx={leftPos.x}
              cy={leftPos.y}
              r={markerInnerR}
              fill="#FFFFFF"
            />
          </>
        )}
      </G>
    );
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        {renderCategory(seg.centers[2], carbsColor, pCarbs)}
        {renderCategory(seg.centers[0], proteinColor, pProtein)}
        {renderCategory(seg.centers[1], fatsColor, pFats)}
      </Svg>

      {/* Center percentage */}
      <View
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
        pointerEvents="none"
      >
        <Text
          style={{
            fontSize: 52,
            fontWeight: "700",
            color: "#374151",
            lineHeight: 56,
          }}
        >
          {centerPct}
          <Text style={{ fontSize: 28, fontWeight: "500", color: "#6B7280" }}>
            %
          </Text>
        </Text>
      </View>
    </View>
  );
}
