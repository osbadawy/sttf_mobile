import Svg, { Path, SvgProps } from "react-native-svg";

interface AnalyticsIconProps {
  svgProps?: SvgProps;
  color?: string;
}

export default function AnalyticsIcon({
  svgProps,
  color = "#45575E",
}: AnalyticsIconProps) {
  return (
    <Svg width={28} height={28} fill="none" {...svgProps}>
      <Path
        fill={color}
        d="M14 6.35c0-.746.608-1.36 1.345-1.249a9 9 0 1 1-4.962.658c.683-.3 1.43.135 1.624.855.194.72-.242 1.449-.904 1.792a6.3 6.3 0 1 0 4.237-.562C14.61 7.686 14 7.096 14 6.35Z"
      />
      <Path
        fill={color}
        d="M14 1.4c0-.773.628-1.407 1.398-1.33A14 14 0 1 1 .07 15.398C-.007 14.628.627 14 1.4 14s1.391.63 1.487 1.396a11.2 11.2 0 1 0 12.51-12.509C14.628 2.791 14 2.173 14 1.4Z"
      />
    </Svg>
  );
}
