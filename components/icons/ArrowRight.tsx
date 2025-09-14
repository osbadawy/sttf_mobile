import { View } from "react-native"
import Svg, { Path } from "react-native-svg"

const ArrowRight = (props: any) => {
  const { className, ...svgProps } = props
  return (
    <View className={className}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={22}
        fill="none"
        {...svgProps}
      >
        <Path
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={10}
          strokeWidth={2}
          d="M8.724 6.448 13.276 11l-4.552 4.552"
        />
      </Svg>
    </View>
  )
}
export default ArrowRight
