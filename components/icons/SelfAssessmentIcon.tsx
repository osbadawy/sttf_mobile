import Svg, { Path, SvgProps } from "react-native-svg";
export default function SelfAssessmentIcon(props: SvgProps) {
  return (
    <Svg width={32} height={32} fill="none" {...props}>
      <Path
        fill="#000"
        d="m22.17 16.184-1.586-1.586-6.034 6.034-3.134-3.133-1.586 1.586 4.72 4.72 7.62-7.621Z"
      />
      <Path
        fill="#000"
        d="m15.207 1.929-3.79 3.79H4.781v21.315A3.37 3.37 0 0 0 8.148 30.4h15.706a3.37 3.37 0 0 0 3.365-3.365V5.719h-6.636l-3.79-3.79a1.12 1.12 0 0 0-1.585 0Zm6.963 8.277V7.962h2.805v19.073c0 .619-.503 1.122-1.123 1.122H8.148a1.123 1.123 0 0 1-1.123-1.123V7.962H9.83v2.244h12.34Z"
      />
    </Svg>
  );
}
