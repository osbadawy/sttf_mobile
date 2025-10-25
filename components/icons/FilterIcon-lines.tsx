import * as React from "react";
import Svg, { Path } from "react-native-svg";

type SVGProps = React.ComponentProps<typeof Svg>;

const FilterIconLines: React.FC<SVGProps> = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <Path
      d="M16.6 9.58203H3.41797C3.14219 9.58203 2.91797 9.80546 2.91797 10.082C2.91797 10.3578 3.14219 10.582 3.41797 10.582H16.6C16.8758 10.582 17.1 10.3578 17.1 10.082C17.1 9.80546 16.8758 9.58203 16.6 9.58203Z"
      fill="black"
      stroke="black"
      strokeWidth={1.5}
    />
    <Path
      d="M16.6004 14.2158H9.90039C9.62461 14.2158 9.40039 14.44 9.40039 14.7158C9.40039 14.9924 9.62461 15.2158 9.90039 15.2158H16.6004C16.8762 15.2158 17.1004 14.9924 17.1004 14.7158C17.1004 14.44 16.8762 14.2158 16.6004 14.2158Z"
      fill="black"
      stroke="black"
      strokeWidth={1.5}
    />
    <Path
      d="M16.6004 4.78223H3.40039C3.12461 4.78223 2.90039 5.00566 2.90039 5.28223C2.90039 5.55801 3.12461 5.78223 3.40039 5.78223H16.6004C16.8762 5.78223 17.1004 5.55801 17.1004 5.28223C17.1004 5.00566 16.8762 4.78223 16.6004 4.78223Z"
      fill="black"
      stroke="black"
      strokeWidth={1.5}
    />
  </Svg>
);
export default FilterIconLines;