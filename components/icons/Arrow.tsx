import { View } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

interface ArrowProps {
  className?: string;
  svgProps?: SvgProps;
  stroke?: string;
  strokeWidth?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number;
  height?: number;
}
export default function Arrow({
  className,
  stroke = "#000",
  strokeWidth = 2,
  svgProps,
  direction = "right",
  width = 22,
  height = 22,
}: ArrowProps) {
  const transform = []
  if (direction === "left") {
    transform.push({ rotate: "180deg" })
  } else if (direction === "up") {
    transform.push({ rotate: "-90deg" })
  } else if (direction === "down") {
    transform.push({ rotate: "90deg" })
  }


  return (
    <View className={className}>
      <Svg
        width={width}
        height={height}
        fill="none"
        {...svgProps}
        style={{
          transform: transform,
        }}
      >
        <Path
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={strokeWidth}
          d="M8.724 6.448 13.276 11l-4.552 4.552"
        />
      </Svg>
    </View>
  );
}
