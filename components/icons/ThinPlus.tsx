import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";

interface ThinPlusIconProps {
  color?: string;
  scale?: number;
  svgProps?: SvgProps;
}
const ThinPlusIcon = ({ color = "#fff", svgProps }: ThinPlusIconProps) => (
  <Svg width={16} height={16} fill="none" {...svgProps}>
    <G stroke={color} clipPath="url(#a)">
      <Path d="M8.24 7.84H1.28a.16.16 0 0 0-.139.057.16.16 0 0 0 .14.263h6.96m-.08 0h6.56a.16.16 0 1 0 0-.32H8.16" />
      <Path d="M7.833 7.753v6.96a.16.16 0 0 0 .058.139.161.161 0 0 0 .262-.139v-6.96m0 .08v-6.56a.16.16 0 1 0-.32 0v6.56" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={color} d="M0 0h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default ThinPlusIcon;
