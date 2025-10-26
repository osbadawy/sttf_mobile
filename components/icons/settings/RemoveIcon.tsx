import * as React from "react";
import Svg, { Path } from "react-native-svg";

type SVGProps = React.ComponentProps<typeof Svg>;

const RemoveIcon: React.FC<SVGProps> = (props) => (
  <Svg
    width={13}
    height={3}
    fill="none"
    {...props}
  >
    <Path
      stroke="#FF4141"
      strokeWidth={2}
      d="M6.616 1H1.115a.125.125 0 0 0-.086.047.133.133 0 0 0 .017.184c.026.022.059.033.092.03h5.478m-.063 0h5.164a.123.123 0 0 0 .09-.038.13.13 0 0 0 .037-.092.135.135 0 0 0-.037-.093.125.125 0 0 0-.09-.037H6.553"
    />
  </Svg>
)
export default RemoveIcon