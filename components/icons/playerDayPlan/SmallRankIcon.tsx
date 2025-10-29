import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from "react-native-svg";
export default function SmallRankIcon(props: SvgProps) {
  return (
    <Svg width={18} height={16} fill="none" {...props}>
      <Path
        fill="url(#a)"
        d="M6.166 7c-1.93 0-3.5-1.57-3.5-3.5S4.237 0 6.167 0s3.5 1.57 3.5 3.5S8.096 7 6.166 7Zm0-6a2.503 2.503 0 0 0-2.5 2.5c0 1.378 1.122 2.5 2.5 2.5 1.379 0 2.5-1.122 2.5-2.5S7.545 1 6.166 1Z"
      />
      <Path
        fill="url(#b)"
        d="M6.166 1a2.503 2.503 0 0 0-2.5 2.5c0 1.378 1.122 2.5 2.5 2.5 1.379 0 2.5-1.122 2.5-2.5S7.545 1 6.166 1Z"
      />
      <Path
        fill="url(#c)"
        d="M9.97 16H2.03A2.031 2.031 0 0 1 0 13.97c0-3.308 2.692-6 6-6s6 2.692 6 6c0 1.12-.91 2.03-2.03 2.03ZM6 8.97c-2.757 0-5 2.243-5 5A1.03 1.03 0 0 0 2.029 15H9.97A1.03 1.03 0 0 0 11 13.97c0-2.757-2.243-5-5-5Z"
      />
      <Path
        fill="url(#d)"
        d="M6 8.97c-2.757 0-5 2.243-5 5A1.03 1.03 0 0 0 2.029 15H9.97A1.03 1.03 0 0 0 11 13.97c0-2.757-2.243-5-5-5Z"
      />
      <Path
        fill="url(#e)"
        d="M11.333 0c1.93 0 3.5 1.57 3.5 3.5a3.504 3.504 0 0 1-4.852 3.229 4.977 4.977 0 0 0 1.18-2.971l.006-.257c0-1.23-.447-2.358-1.187-3.23A3.482 3.482 0 0 1 11.333 0Zm-2.9 1.542c.334.386.573.857.675 1.377l.007.034.001.003.004.025.019.123v.003l.005.034V3.14v.005c.005.037.009.077.012.119l.004.066a2.983 2.983 0 0 1-.728 2.127A3.48 3.48 0 0 1 7.834 3.5c0-.725.221-1.399.6-1.958Z"
      />
      <Path
        fill="url(#f)"
        d="M11.333 7.973c3.308 0 6 2.69 6 5.999 0 1.118-.91 2.029-2.03 2.029h-2.427c.36-.522.585-1.145.62-1.817l.004-.182a7.49 7.49 0 0 0-2.974-5.975c.264-.035.534-.054.807-.054Zm-3.231.947a5.51 5.51 0 0 1 3.398 5.082c0 .782-.593 1.43-1.352 1.518h-.002l-.03.003-.146.007H6.064a2.026 2.026 0 0 1-.731-1.558A6 6 0 0 1 8.102 8.92Z"
      />
      <Defs>
        <LinearGradient
          id="a"
          x1={6.166}
          x2={1.741}
          y1={0}
          y2={12.255}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#009FA0" />
          <Stop offset={1} stopColor="#009FA0" />
        </LinearGradient>
        <LinearGradient
          id="b"
          x1={6.166}
          x2={1.741}
          y1={0}
          y2={12.255}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#009FA0" />
          <Stop offset={1} stopColor="#009FA0" />
        </LinearGradient>
        <LinearGradient
          id="c"
          x1={6}
          x2={2.373}
          y1={7.971}
          y2={22.983}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#009FA0" />
          <Stop offset={1} stopColor="#009FA0" />
        </LinearGradient>
        <LinearGradient
          id="d"
          x1={6}
          x2={2.373}
          y1={7.971}
          y2={22.983}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#009FA0" />
          <Stop offset={1} stopColor="#009FA0" />
        </LinearGradient>
        <LinearGradient
          id="e"
          x1={11.333}
          x2={6.908}
          y1={0}
          y2={12.256}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#009FA0" />
          <Stop offset={1} stopColor="#009FA0" />
        </LinearGradient>
        <LinearGradient
          id="f"
          x1={11.333}
          x2={7.706}
          y1={7.973}
          y2={22.985}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#009FA0" />
          <Stop offset={1} stopColor="#009FA0" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
