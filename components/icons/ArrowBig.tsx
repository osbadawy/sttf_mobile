import Svg, { Path, SvgProps } from "react-native-svg";

interface ArrowBigProps {
    svgProps?: SvgProps;
    stroke?: string
    strokeWidth?: number
    direction?: "left" | "right"
}

export default function ArrowBig({ svgProps, stroke = "#03A454", strokeWidth = 1.2, direction = "right" }: ArrowBigProps) {
    return (
        <Svg
            width={28}
            height={28}
            fill="none"
            {...svgProps}
            style={{
                transform: direction === "left" ? [{ rotate: "180deg" }] : [],
            }}
        >
            <Path
                fill="#fff"
                stroke={stroke}
                strokeWidth={strokeWidth}
                d="M17.756 4.975c-.335 0-.66.136-.902.384-.243.249-.381.59-.381.947 0 .313.106.613.295.85l.085.096 4.314 4.403.999 1.02H2.751c-.333 0-.657.136-.897.383-.241.247-.38.585-.38.94 0 .356.139.694.38.942.24.246.564.381.897.381h19.415l-.999 1.02-4.315 4.404v.001a1.33 1.33 0 0 0-.382.944 1.332 1.332 0 0 0 .383.945l.002.004a1.236 1.236 0 0 0 1.8 0l.003-.001 7.495-7.686a1.33 1.33 0 0 0 .27-.435l.005-.011c.13-.325.13-.69 0-1.015h-.001l-.004-.011a1.335 1.335 0 0 0-.272-.438l.001-.001-7.494-7.682a1.26 1.26 0 0 0-.902-.384Z"
            />
        </Svg>
    )
}