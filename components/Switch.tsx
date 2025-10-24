import colors from "@/colors";
import { TouchableOpacity, View } from "react-native";
import { GreenCheckIcon } from "./icons";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

export default function CustomSwitch({
  value,
  onValueChange,
  disabled = false,
  size = "medium",
}: CustomSwitchProps) {
  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return {
          trackWidth: 40,
          trackHeight: 20,
          thumbSize: 16,
          thumbMargin: 2,
        };
      case "large":
        return {
          trackWidth: 60,
          trackHeight: 30,
          thumbSize: 24,
          thumbMargin: 3,
        };
      default: // medium
        return {
          trackWidth: 50,
          trackHeight: 25,
          thumbSize: 20,
          thumbMargin: 2.5,
        };
    }
  };

  const sizeConfig = getSizeConfig();

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const thumbTranslateX = value
    ? sizeConfig.trackWidth - sizeConfig.thumbSize - sizeConfig.thumbMargin * 2
    : 0;

  const trackBackgroundColor = value ? colors.primary : "#B0B8B7";

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View
        style={{
          width: sizeConfig.trackWidth,
          height: sizeConfig.trackHeight,
          borderRadius: sizeConfig.trackHeight / 2,
          backgroundColor: trackBackgroundColor,
          justifyContent: "center",
          paddingHorizontal: sizeConfig.thumbMargin,
        }}
      >
        <View
          style={{
            width: sizeConfig.thumbSize,
            height: sizeConfig.thumbSize,
            borderRadius: sizeConfig.thumbSize / 2,
            backgroundColor: "#FFFFFF",
            transform: [{ translateX: thumbTranslateX }],
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          {value && <GreenCheckIcon />}
        </View>
      </View>
    </TouchableOpacity>
  );
}
