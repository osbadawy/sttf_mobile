import Svg, { Path, SvgProps } from "react-native-svg";
const SvgComponent = (props: SvgProps) => (
  <Svg width={30} height={13} fill="none" {...props}>
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M30 9.982h-1.65V3.145H30v6.837ZM6.008 5.632h17.96V7.37H6.007V5.633ZM28.03 13h-3.098V0h3.098v13ZM5.04 13h-3.1V0h3.1v13ZM1.618 9.982H0V3.145h1.619v6.837Z"
      clipRule="evenodd"
    />
  </Svg>
);
export { SvgComponent as Strength };
