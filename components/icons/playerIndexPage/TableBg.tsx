import Svg, {
  ClipPath,
  Defs,
  Ellipse,
  G,
  Path,
  SvgProps,
} from "react-native-svg";
export default function TableBg(props: SvgProps) {
  return (
    <Svg width={1102} height={706} fill="none" {...props}>
      <G clipPath="url(#a)">
        <Path
          fill="#008C46"
          fillRule="evenodd"
          d="M1102.04 706 699.364 5.019A9.999 9.999 0 0 0 690.693 0H411.351c-3.58 0-6.887 1.914-8.671 5.019L0 706h1102.04Zm-571.018 0 20-706 20 706h-40Z"
          clipRule="evenodd"
        />
        <Path fill="#fff" d="m551.022 0-20 706h40l-20-706Z" />
        <Path
          stroke="#fff"
          strokeWidth={12}
          d="M411.352 6H544.85l-19.661 694H10.365L407.883 8.008A4 4 0 0 1 411.352 6Zm279.341 0a4 4 0 0 1 3.469 2.008L1091.68 700H576.854L557.195 6h133.498ZM564.85 700h-27.656l13.827-488.104L564.85 700Z"
        />
        <Ellipse
          cx={550.5}
          cy={-23}
          fill="#333"
          fillOpacity={0.2}
          rx={60}
          ry={61.5}
          transform="rotate(90 550.5 -23)"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h1102v706H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
