import { LayoutChangeEvent, View } from "react-native";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  style?: any;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export default function Card({
  children = "",
  className = "",
  style,
  onLayout,
}: CardProps) {
  return (
    <View
      className={`bg-white rounded-3xl ${className}`}
      style={{
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
        ...style,
      }}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
}
