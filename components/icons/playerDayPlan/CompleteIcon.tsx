import Svg, { Defs, G, Path, SvgProps } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
export default function CompleteIcon(props: SvgProps) {
  return (
    <Svg width={58} height={44} fill="none" {...props}>
      <G filter="url(#a)">
        <Path
          fill="#494949"
          d="M48.774 11.215a2 2 0 0 1 0 3.142L24.51 33.477a2 2 0 0 1-2.476 0L8.763 23.024a2 2 0 0 1 0-3.142l2.267-1.787a2 2 0 0 1 2.476 0l9.765 7.694 20.76-16.36a2 2 0 0 1 2.476 0l2.267 1.787Z"
        />
      </G>
      <G filter="url(#b)">
        <Path
          fill="#fff"
          d="M48.774 8.215a2 2 0 0 1 0 3.142L24.51 30.477a2 2 0 0 1-2.476 0L8.763 20.024a2 2 0 0 1 0-3.142l2.267-1.787a2 2 0 0 1 2.476 0l9.765 7.694 20.76-16.36a2 2 0 0 1 2.476 0l2.267 1.787Z"
        />
      </G>
      <Defs></Defs>
    </Svg>
  );
}
