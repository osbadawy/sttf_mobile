import { ScrollView, View } from "react-native";
import Header, { HeaderProps } from "./Header";
import Nav from "./Nav";

export interface ParallaxScrollViewProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  showNav?: boolean;
}
export default function ParallaxScrollView({
  children,
  headerProps,
  showNav = true,
}: ParallaxScrollViewProps) {
  return (
    <View className="flex-1">
      <ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        {headerProps && <Header {...headerProps} />}
        <View
          className="flex-1 pt-16 px-4 gap-4 overflow-hidden"
          style={{ paddingBottom: showNav ? 100 : 16 }}
        >
          {children}
        </View>
      </ScrollView>
      {showNav && <Nav />}
    </View>
  );
}
