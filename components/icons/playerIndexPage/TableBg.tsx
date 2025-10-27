import Svg, { Path, SvgProps } from "react-native-svg";
export default function TableBg(props: SvgProps) {
  return (
    <Svg width={393} height={569} fill="none" {...props}>
      <Path
        fill="#008C46"
        fillRule="evenodd"
        d="M509 292 345.337 5.046A10 10 0 0 0 336.65 0H57.35a10 10 0 0 0-8.687 5.046L-115 292v414h624V292ZM177 647 197 0l20 647h-40Z"
        clipRule="evenodd"
      />
      <Path fill="#fff" d="m197 0-20 647h40L197 0Z" />
      <Path
        stroke="#fff"
        strokeWidth={12}
        d="M57.35 6h133.462l-19.809 640.814-.191 6.186h52.376l-.191-6.186L203.188 6H336.65a4 4 0 0 1 3.475 2.019L503 293.59V700h-612V293.591L53.875 8.019A4 4 0 0 1 57.35 6Zm153.462 635h-27.624L197 194.19 210.812 641Z"
      />
    </Svg>
  );
}
