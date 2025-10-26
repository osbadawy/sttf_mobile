import * as React from "react";
import Svg, { Path } from "react-native-svg";

type SVGProps = React.ComponentProps<typeof Svg>;

const LogOutIcon: React.FC<SVGProps> = (props) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill="#FF4141"
      d="M16.873 7.128a.688.688 0 0 0-1.092.15c-.158.274-.089.628.133.852l3.139 3.146H13.25V5.748a2.865 2.865 0 0 0-2.856-2.866H5.56A2.863 2.863 0 0 0 2.7 5.747v12.448a2.863 2.863 0 0 0 2.86 2.866h4.834a2.865 2.865 0 0 0 2.857-2.866v-3.239a.694.694 0 0 0-.693-.694H6.57a.799.799 0 0 1 0-1.599h12.482l-3.158 3.169a.692.692 0 0 0 .49 1.183.677.677 0 0 0 .488-.202l4.345-4.353a.695.695 0 0 0 0-.983l-4.345-4.352v.003Z"
    />
  </Svg>
);
export default LogOutIcon;
