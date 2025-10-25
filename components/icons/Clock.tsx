import Svg, { Path, SvgProps } from "react-native-svg";

export default function ClockIcon(props: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        fill="#000"
        stroke="#000"
        strokeWidth={0.5}
        d="M15.15 10.95h-2.1v-4.2a1.05 1.05 0 1 0-2.1 0V12A1.05 1.05 0 0 0 12 13.05h3.15a1.05 1.05 0 1 0 0-2.1ZM12 1.5A10.5 10.5 0 1 0 22.5 12 10.512 10.512 0 0 0 12 1.5Zm0 18.9a8.4 8.4 0 1 1 8.4-8.4 8.41 8.41 0 0 1-8.4 8.4Z"
      />
    </Svg>
  );
}
