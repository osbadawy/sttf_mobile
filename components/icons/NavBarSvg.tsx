import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const NAV_PATH_D =
  "M12 50c0-21.471 17.406-39 38.877-39 9.727 0 19.1 3.646 26.27 10.219l1.207 1.106c6.59 6.04 16.703 6.04 23.292 0l1.297-1.19a38.561 38.561 0 0152.114 0l1.297 1.19c6.589 6.04 16.703 6.04 23.292 0l1.297-1.19a38.561 38.561 0 0152.114 0l1.297 1.19c6.589 6.04 16.703 6.04 23.292 0l1.206-1.106A38.878 38.878 0 01285.123 11C306.594 11 324 28.529 324 50s-17.406 39-38.877 39a38.878 38.878 0 01-26.271-10.219l-1.206-1.106c-6.589-6.04-16.703-6.04-23.292 0l-1.297 1.19a38.561 38.561 0 01-52.114 0l-1.297-1.19c-6.589-6.04-16.703-6.04-23.292 0l-1.297 1.19a38.561 38.561 0 01-52.114 0l-1.297-1.19c-6.59-6.04-16.703-6.04-23.292 0l-1.206 1.106A38.877 38.877 0 0150.878 89C29.405 89 12 71.471 12 50z";

export function NavGlassBlur({
  width = 336,
  height = 102,
  intensity = 110, // increase this to get more blur
  tint = "light" as "light" | "dark" | "default",
}) {
  return (
    <View style={{ width, height }}>
      <MaskedView
        style={{ flex: 1 }}
        maskElement={
          <Svg width={width} height={height} viewBox="0 0 336 102">
            <Path d={NAV_PATH_D} fill="#000" />
          </Svg>
        }
      >
        {/* The blur only shows where the mask is opaque */}
        <BlurView style={{ flex: 1 }} intensity={intensity} tint={tint} />
      </MaskedView>
    </View>
  );
}