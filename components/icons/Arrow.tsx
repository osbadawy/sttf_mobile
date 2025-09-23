import { View } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

interface ArrowProps {
  className?: string;
  svgProps?: SvgProps;
  stroke?: string;
  strokeWidth?: number;
  direction?: "left" | "right";
}
export default function Arrow({
  className,
  stroke = "#000",
  strokeWidth = 2,
  svgProps,
  direction = "right",
}: ArrowProps) {
  return (
    <View className={className}>
      <Svg
        width={22}
        height={22}
        fill="none"
        {...svgProps}
        style={{
          transform: direction === "left" ? [{ rotate: "180deg" }] : [],
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
