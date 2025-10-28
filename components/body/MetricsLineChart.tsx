// components/body/MetricsLineChart.tsx
import { useMemo } from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg";

type ChartType = "Weight" | "Fat" | "BMI" | "Muscle";

type Props = {
  data: number[]; // daily values in order
  type: ChartType;
  width?: number; // optional, default 320
  height?: number; // optional, default 160
  style?: any; // container style
};

const GREEN = "#0E7A3E";
const GRID = "rgba(0,0,0,0.08)";

const Y_RANGES: Record<
  ChartType,
  { min: number; max: number; unit?: "%" | "" }
> = {
  Weight: { min: 0, max: 90, unit: "" },
  BMI: { min: 15, max: 32, unit: "" },
  Fat: { min: 0, max: 35, unit: "%" },
  Muscle: { min: 0, max: 100, unit: "%" },
};

export default function MetricsLineChart({
  data,
  type,
  width = 320,
  height = 160,
  style,
}: Props) {
  const PADDING_L = 36;
  const PADDING_R = 12;
  const PADDING_T = 12;
  const PADDING_B = 16;

  const innerW = width - PADDING_L - PADDING_R;
  const innerH = height - PADDING_T - PADDING_B;

  const { min: yMin, max: yMax } = Y_RANGES[type];

  const ticks = useMemo(() => {
    // 6 ticks (including 0 line like the mock)
    const steps = 6;
    const step = (yMax - yMin) / (steps - 1);
    return Array.from({ length: steps }, (_, i) => Math.round(yMin + i * step));
  }, [yMin, yMax]);

  const points = useMemo(() => {
    const n = Math.max(1, data.length);
    const dx = n === 1 ? 0 : innerW / (n - 1);

    return data.map((v, i) => {
      const x = PADDING_L + i * dx;
      const clamped = Math.min(yMax, Math.max(yMin, v));
      const t = (clamped - yMin) / (yMax - yMin); // 0..1
      const y = PADDING_T + innerH * (1 - t); // invert for SVG coords
      return { x, y };
    });
  }, [data, innerW, innerH, yMin, yMax]);

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height}>
        {/* outer top & bottom borders (as in mock) */}
        <Line
          x1={PADDING_L}
          y1={PADDING_T}
          x2={width - PADDING_R}
          y2={PADDING_T}
          stroke={GRID}
          strokeWidth={1}
        />
        <Line
          x1={PADDING_L}
          y1={height - PADDING_B}
          x2={width - PADDING_R}
          y2={height - PADDING_B}
          stroke={GRID}
          strokeWidth={1}
        />

        {/* horizontal grid */}
        {ticks.map((t, i) => {
          const y = PADDING_T + innerH - (innerH * (t - yMin)) / (yMax - yMin);
          return (
            <Line
              key={`h-${i}`}
              x1={PADDING_L}
              y1={y}
              x2={width - PADDING_R}
              y2={y}
              stroke={GRID}
              strokeWidth={1}
              strokeDasharray="4 6"
            />
          );
        })}

        {/* y-axis labels */}
        {ticks.map((t, i) => {
          const y = PADDING_T + innerH - (innerH * (t - yMin)) / (yMax - yMin);
          return (
            <SvgText
              key={`lbl-${i}`}
              x={PADDING_L - 6}
              y={y + 4}
              fontSize={10}
              fill="rgba(0,0,0,0.45)"
              textAnchor="end"
            >
              {t}
            </SvgText>
          );
        })}

        {/* green line */}
        {points.length > 1 && (
          <Polyline
            points={polylinePoints}
            stroke={GREEN}
            strokeWidth={2}
            fill="none"
            opacity={0.6}
          />
        )}

        {/* points with white fill + green stroke */}
        {points.map((p, idx) => (
          <Circle
            key={`pt-${idx}`}
            cx={p.x}
            cy={p.y}
            r={5}
            fill="#FFFFFF"
            stroke={GREEN}
            strokeWidth={2}
          />
        ))}
      </Svg>
    </View>
  );
}
