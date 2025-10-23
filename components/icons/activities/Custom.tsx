import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const SvgComponent = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill="#000"
      d="m20.018 6.75-4.98-5.018a.763.763 0 0 0-.255-.172.658.658 0 0 0-.21-.06H4.5a.75.75 0 0 0-.75.75v19.5a.75.75 0 0 0 .75.75h15a.75.75 0 0 0 .75-.75V7.178a.673.673 0 0 0-.045-.21.758.758 0 0 0-.188-.218Zm-4.77-2.685 2.437 2.437h-2.437V4.065ZM5.25 21V3h8.498v4.252a.75.75 0 0 0 .75.75h4.252V21H5.25Z"
    />
    <Path
      fill="#000"
      d="M15.697 13.335H8.302a.75.75 0 1 0 0 1.5h7.395a.75.75 0 1 0 0-1.5ZM15.697 17.085H8.302a.75.75 0 1 0 0 1.5h7.395a.75.75 0 1 0 0-1.5ZM15.697 9.585H8.302a.75.75 0 1 0 0 1.5h7.395a.75.75 0 1 0 0-1.5Z"
    />
  </Svg>
);
export { SvgComponent as Custom };
