import Svg, { Path } from "react-native-svg"
const ActivityFlameIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={42}
    height={42}
    fill="none"
    {...props}
  >
    <Path
      fill="#C00000"
      fillRule="evenodd"
      d="M31.191 34.848c-5.64 5.194-14.743 5.194-20.384 0-2.638-2.43-4.27-5.79-4.27-9.506 0-4.399 3.986-10.046 6.804-13.688.57-.737 1.21-.73 1.901-.197.61.472 1.24 1.696 1.77 2.675.578-1.595 1.017-3.565 1.413-5.35.49-2.206 1.053-4.791 1.875-5.474a1.095 1.095 0 0 1 1.542.141c4.767 5.737 13.62 15.243 13.62 21.892 0 3.717-1.632 7.078-4.27 9.507Z"
      clipRule="evenodd"
    />
    <Path
      fill="#fff"
      stroke="#fff"
      strokeLinecap="round"
      d="M20.888 33.99c-6.997-.607-2.98-6.062-.078-11.622.048-.093.19-.058.19.047v11.477c0 .058-.054.104-.112.099Z"
    />
    <Path
      fill="#fff"
      stroke="#fff"
      strokeLinecap="round"
      d="M21.112 33.99c6.997-.607 2.98-6.062.078-11.622-.048-.093-.19-.058-.19.047v11.477c0 .058.054.104.112.099Z"
    />
  </Svg>
)
export default ActivityFlameIcon
