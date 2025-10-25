import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponent = (props: SvgProps) => (
  <Svg width={32} height={32} fill="none" {...props}>
    <G clipPath="url(#a)" filter="url(#b)">
      <Path
        fill="#000"
        stroke="#F8F9F2"
        strokeWidth={0.35}
        d="M7.52 3.935c4.442-4.42 11.626-4.4 16.044.043l.044.043c4.42 4.443 4.4 11.627-.043 16.045-4.442 4.42-11.626 4.4-16.044-.043l-.045-.044C3.059 15.536 3.078 8.353 7.52 3.934Zm8.023-2.19C9.88 1.745 5.287 6.337 5.287 12c0 5.663 4.593 10.255 10.256 10.255 5.66-.007 10.248-4.594 10.255-10.255 0-5.663-4.592-10.255-10.255-10.255Zm-.001 14.75a1.985 1.985 0 1 1 0 3.97 1.985 1.985 0 0 1 0-3.97Zm-5.611-3.24a1.985 1.985 0 1 1 0 3.97 1.985 1.985 0 0 1 0-3.97Zm11.223 0a1.985 1.985 0 1 1 .001 3.97 1.985 1.985 0 0 1 0-3.97Zm-5.611-3.24a1.984 1.984 0 1 1 0 3.97 1.985 1.985 0 1 1 0-3.97Zm-5.612-3.24a1.985 1.985 0 1 1 .001 3.97 1.985 1.985 0 0 1-.001-3.97Zm11.223 0a1.984 1.984 0 1 1 .002 3.97 1.984 1.984 0 0 1-.002-3.97Zm-5.611-3.24a1.984 1.984 0 1 1 0 3.969 1.984 1.984 0 0 1 0-3.969Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M3.542 0h24v24h-24z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export { SvgComponent as Pickleball };
