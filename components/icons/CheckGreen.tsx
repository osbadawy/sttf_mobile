import Svg, { Path, SvgProps } from "react-native-svg";
export function GreenCheckIcon(props: SvgProps) {
  return (
    <Svg width={10} height={8} fill="none" {...props}>
      <Path
        fill="#008C46"
        d="M9.686.717a1 1 0 0 1 0 1.414L4.509 7.31a1 1 0 0 1-1.414 0L.293 4.508a1 1 0 0 1 0-1.415l.424-.424a1 1 0 0 1 1.414 0l1.67 1.671L7.849.293a1 1 0 0 1 1.414 0l.424.424Z"
      />
    </Svg>
  );
}
