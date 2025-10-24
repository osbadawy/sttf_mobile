import Svg, { Path, SvgProps } from "react-native-svg";

interface ProfilePictureDefaultIconProps {
  fill?: string;
  svgProps?: SvgProps;
}
const ProfilePictureDefaultIcon = ({
  fill = "#C1C1C1",
  svgProps,
}: ProfilePictureDefaultIconProps) => (
  <Svg width={20} height={20} fill="none" {...svgProps}>
    <Path
      fill={fill}
      d="M10.208 8.75a4.38 4.38 0 0 1-4.375-4.375A4.38 4.38 0 0 1 10.208 0a4.38 4.38 0 0 1 4.375 4.375 4.38 4.38 0 0 1-4.375 4.375Zm0-7.5a3.129 3.129 0 0 0-3.125 3.125A3.129 3.129 0 0 0 10.208 7.5a3.129 3.129 0 0 0 3.125-3.125 3.129 3.129 0 0 0-3.125-3.125Z"
    />
    <Path
      fill={fill}
      d="M10.208 1.25a3.129 3.129 0 0 0-3.125 3.125A3.129 3.129 0 0 0 10.208 7.5a3.129 3.129 0 0 0 3.125-3.125 3.129 3.129 0 0 0-3.125-3.125ZM14.964 20H5.036A2.539 2.539 0 0 1 2.5 17.464c0-4.136 3.365-7.5 7.5-7.5s7.5 3.364 7.5 7.5A2.539 2.539 0 0 1 14.964 20ZM10 11.214a6.257 6.257 0 0 0-6.25 6.25c0 .71.577 1.286 1.286 1.286h9.928c.71 0 1.286-.577 1.286-1.286a6.257 6.257 0 0 0-6.25-6.25Z"
    />
    <Path
      fill={fill}
      d="M10 11.214a6.257 6.257 0 0 0-6.25 6.25c0 .71.577 1.286 1.286 1.286h9.928c.71 0 1.286-.577 1.286-1.286a6.257 6.257 0 0 0-6.25-6.25Z"
    />
  </Svg>
);
export default ProfilePictureDefaultIcon;
