import Svg, { Path, SvgProps } from "react-native-svg";
const FilterIcon = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M1.62 3.492a1.216 1.216 0 0 1-.322-.824V1.516a.987.987 0 0 1 .989-.988h11.427a.986.986 0 0 1 .988.988v1.152c0 .305-.115.6-.322.824L9.976 8.26a.693.693 0 0 0-.184.47v4.467c0 .3-.137.584-.372.772l-1.607 1.286a.99.99 0 0 1-1.606-.772V8.73a.694.694 0 0 0-.184-.471L1.619 3.492h.001Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default FilterIcon;
