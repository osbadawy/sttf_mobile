import Svg, { Path } from "react-native-svg";
const ReloadIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      fill="#000"
      stroke="#000"
      d="M2.575.892a.5.5 0 0 1 .501.5l.001.352.002.948.782-.537A7.099 7.099 0 1 1 1.06 10l-.013-.044-.002-.003a.501.501 0 0 1 .96-.294v.004l.02.07a6.096 6.096 0 1 0 3.062-7.145l.191.794-.014.147a.502.502 0 0 1-.043 1H2.575a.5.5 0 0 1-.5-.5V1.391l.01-.1a.5.5 0 0 1 .379-.389l.099-.011h.012Z"
    />
  </Svg>
);
export default ReloadIcon;
