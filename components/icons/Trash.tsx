import Svg, { Path, SvgProps } from "react-native-svg";
export default function TrashIcon(props: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        fill="#FF4141"
        d="M15.336 3.168a.72.72 0 0 0-.72-.72H9.385a.72.72 0 0 0-.72.72V5.04H3.48v1.44h1.273v11.76a3.312 3.312 0 0 0 3.312 3.313h7.92a3.29 3.29 0 0 0 3.288-3.313V6.48h1.247V5.04h-5.184V3.168ZM9.433 17.113h-1.44v-8.16h1.44v8.16Zm3.287 0h-1.44v-8.16h1.44v8.16ZM13.896 5.04h-3.791V3.888h3.791V5.04Zm2.112 3.913v8.16h-1.44v-8.16h1.44Z"
      />
    </Svg>
  );
}
