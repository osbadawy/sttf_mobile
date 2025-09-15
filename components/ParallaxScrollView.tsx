import type { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';

export default function ParallaxScrollView({
  children,
}: PropsWithChildren) {
  return (
    <View className="flex-1">
      <ScrollView scrollEventThrottle={16}>
        <View className="flex-1 pt-16 px-4 pb-4 gap-4 overflow-hidden">{children}</View>
      </ScrollView>
    </View>
  );
}