import { TableItemType } from "@/components/playerIndexPage/TableItem";
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from "react-native-svg";

interface ItemContainerProps {
  svgProps?: SvgProps;
  type: TableItemType;
  disabled?: boolean;
}
export default function ItemContainer({
  svgProps,
  type,
  disabled = false,
}: ItemContainerProps) {
  const colors = {
    workout: {
      color1: "#009FA0",
      color2: "#00BBBD",
      shadowColor: "#004646",
    },
    meal: {
      color1: "#F47B37",
      color2: "#F9A87B",
      shadowColor: "#893A0D",
    },
    daily: {
      color1: "#FABB00",
      color2: "#FFD659",
      shadowColor: "#654C00",
    },
    disabled: {
      color1: "#C6C6C6",
      color2: "#EFEFEF",
      shadowColor: "#929292",
    },
  };

  const color1 = disabled ? colors.disabled.color1 : colors[type].color1;
  const color2 = disabled ? colors.disabled.color2 : colors[type].color2;
  const shadowColor = disabled ? colors.disabled.shadowColor : colors[type].shadowColor;
  
  return (
    <Svg width={100} height={79} fill="none" {...svgProps}>
      <Path
        fill={shadowColor}
        d="M99.885 44C98.72 63.297 77.551 79 50 79 22.45 79 .115 63.33.115 44-1.881 10.944 22.449 9 50 9c27.55 0 51.881 1.944 49.885 35Z"
      />
      <Path
        fill="url(#a)"
        stroke="url(#b)"
        strokeWidth={6}
        d="M50 3c13.249 0 25.12 3.87 33.603 9.979C92.09 19.088 97 27.268 97 36c0 8.731-4.91 16.91-13.397 23.022C75.119 65.129 63.249 69 50 69c-13.249 0-25.12-3.87-33.602-9.978C7.91 52.91 3 44.732 3 36s4.91-16.91 13.398-23.021C24.88 6.87 36.75 3 50 3Z"
      />
      <Defs>
        <LinearGradient
          id="a"
          x1={50}
          x2={50}
          y1={0}
          y2={72}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={color1} />
          <Stop offset={1} stopColor={color2} />
        </LinearGradient>
        <LinearGradient
          id="b"
          x1={50}
          x2={50}
          y1={0}
          y2={72}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={color2} />
          <Stop offset={1} stopColor={color1} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
