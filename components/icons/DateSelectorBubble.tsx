import * as React from "react";
import Svg, { Circle, Defs, G, Path } from "react-native-svg";

interface NavGlassBlurProps {
  width?: number;
  height?: number;
}

const DateSelectorBubble: React.FC<NavGlassBlurProps> = ({
  width = 336,
  height = 102,
}) => (
  <Svg
    width={56}
    height={82}
    viewBox="0 0 56 82"
    fill="none"
  >
    <G filter="url(#filter0_d_1837_682)">
      <Circle cx={28} cy={50} r={20} fill="#024F25" />
    </G>
    <Path
      d="M28 0C38.1797 0 42 7 42 13.7061C42 18.1941 39.9624 22.833 37.5874 27.345C36.8169 28.8087 37.0102 30.5827 37.9371 31.9527C41.631 37.4132 44 44.9182 44 50C44 58.8366 36.8366 66 28 66C19.1634 66 12 58.8366 12 50C12 44.9184 14.3684 37.4132 18.0621 31.9527C18.9888 30.5826 19.1822 28.8088 18.4118 27.345C16.037 22.833 14 18.1941 14 13.7061C14 7 17.8203 2.5188e-07 28 0Z"
      fill="#024F25"
    />
    <Defs></Defs>
  </Svg>
);
export default DateSelectorBubble;