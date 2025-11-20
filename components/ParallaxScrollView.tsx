import { ScrollView, View, ViewStyle } from "react-native";
import ErrorToast from "./ErrorToast";
import Header, { HeaderProps } from "./Header";
import Nav from "./Nav";

export interface ParallaxScrollViewProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  showNav?: boolean;
  error?: boolean;
  backgroundColor?: string;
}
export default function ParallaxScrollView({
  children,
  headerProps,
  showNav = true,
  error = false,
  backgroundColor,
}: ParallaxScrollViewProps) {
  const bgStyle: ViewStyle | undefined = backgroundColor
    ? { backgroundColor }
    : undefined;

  return (
    <View className="flex-1 pt-6" style={bgStyle}>
      {error && <ErrorToast />}
      <ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        {headerProps && <Header {...headerProps} />}
        <View
          className="flex-1 pt-10 px-4 gap-4 overflow-hidden"
          style={{ paddingBottom: showNav ? 100 : 16 }}
        >
          {children}
        </View>
      </ScrollView>
      {showNav && <Nav />}
    </View>
  );
}
