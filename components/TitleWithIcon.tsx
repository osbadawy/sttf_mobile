import { ArrowRight } from "@/components/icons";
import { Text, View } from "react-native";

interface TitleWithIconProps {
  title: string;
  titleColor: string;
  icon: React.ReactNode;
  isRTL: boolean;
  arrow?: boolean;
}

export default function TitleWithIcon({ title, titleColor,  icon, isRTL, arrow=true }: TitleWithIconProps) {
  return (
    <View className={`flex-row w-full items-center ${isRTL ? 'justify-end' : 'justify-start'}`}>
      {isRTL ? (
        <>
          {arrow && <ArrowRight className="transform rotate-180" />}
          <Text className={`text-2xl font-bold pl-1 pr-2 ${titleColor}`}>{title}</Text>
          {icon}
        </>
      ) : (
        <>
          {icon}
          <Text className={`text-2xl font-bold pl-2 pr-1 ${titleColor}`}>{title}</Text>
          {arrow && <ArrowRight />}
        </>
      )}
    </View>
  );
}