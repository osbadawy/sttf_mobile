import { Arrow } from "@/components/icons";
import { Text, View } from "react-native";

interface TitleWithIconProps {
  title: string;
  titleColor: string;
  icon: React.ReactNode;
  isRTL?: boolean;
  arrow?: boolean;
}

export default function TitleWithIcon({
  title,
  titleColor,
  icon,
  isRTL = false,
  arrow = true,
}: TitleWithIconProps) {
  return (
    <View
      className={`flex-row w-full items-center ${isRTL ? "justify-end" : "justify-start"}`}
    >
      {isRTL ? (
        <>
          {arrow && <Arrow direction="left" />}
          <Text className={`text-2xl effra-medium pl-1 pr-2 ${titleColor}`}>
            {title}
          </Text>
          {icon}
        </>
      ) : (
        <>
          {icon}
          <Text className={`text-2xl effra-medium pl-2 pr-1 ${titleColor}`}>
            {title}
          </Text>
          {arrow && <Arrow direction="right" />}
        </>
      )}
    </View>
  );
}
