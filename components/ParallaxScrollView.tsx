import { ScrollView, View } from 'react-native';
import Header, { HeaderProps } from './Header';

export interface ParallaxScrollViewProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
}
export default function ParallaxScrollView({
  children,
  headerProps,
}: ParallaxScrollViewProps) {
  return (
    <View className="flex-1">
      <ScrollView scrollEventThrottle={16}>
        {headerProps && <Header {...headerProps} />}
        <View className="flex-1 pt-16 px-4 pb-4 gap-4 overflow-hidden">{children}</View>
      </ScrollView>
    </View>
  );
}