import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";
export default function StrengthIcon(props: SvgProps) {
  return (
    <Svg width={54} height={22} fill="none" {...props}>
      <G clipPath="url(#a)">
        <Path
          fill="#494949"
          fillRule="evenodd"
          d="M54 17.59h-2.97V7.597H54v9.993Zm-43.185-6.358H43.14v2.54H10.815v-2.54ZM50.454 22h-5.577V3h5.577v19ZM9.07 22H3.494V3H9.07v19Zm-6.156-4.41H0V7.597h2.914v9.993Z"
          clipRule="evenodd"
        />
      </G>
      <G clipPath="url(#b)">
        <Path
          fill="#fff"
          fillRule="evenodd"
          d="M54 14.59h-2.97V4.597H54v9.993ZM10.815 8.232H43.14v2.54H10.815v-2.54ZM50.454 19h-5.577V0h5.577v19ZM9.07 19H3.494V0H9.07v19Zm-6.156-4.41H0V4.597h2.914v9.993Z"
          clipRule="evenodd"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 3h54v19H0z" />
        </ClipPath>
        <ClipPath id="b">
          <Path fill="#fff" d="M0 0h54v19H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
