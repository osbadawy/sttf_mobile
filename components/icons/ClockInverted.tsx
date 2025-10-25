import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";
export default function ClockInvertedIcon(props: SvgProps) {
  return (
    <Svg width={18} height={18} fill="none" {...props}>
      <G clipPath="url(#a)">
        <Path
          fill="#45575E"
          d="M9 .45C4.282.45.45 4.284.45 9c0 4.716 3.833 8.55 8.55 8.55 4.715 0 8.55-3.834 8.55-8.55C17.55 4.284 13.714.45 9 .45Zm3.365 10.908a.822.822 0 0 1-.684.36.954.954 0 0 1-.486-.144l-2.682-1.89A.87.87 0 0 1 8.153 9V4.482a.845.845 0 1 1 1.692 0v4.086l2.322 1.638a.814.814 0 0 1 .198 1.152Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h18v18H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
