import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const HEADER_HEIGHT = 100;

export default function ParallaxScrollView({
  children,
}: PropsWithChildren) {
  return (
    <View style={styles.container}>
      <ScrollView scrollEventThrottle={16}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
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
