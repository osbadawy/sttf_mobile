import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedRef
} from 'react-native-reanimated';
const HEADER_HEIGHT = 100;

export default function ParallaxScrollView({
  children,
}: PropsWithChildren) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}>
        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
