import TableBg from "@/components/icons/playerIndexPage/TableBg";
import TableItem from "@/components/playerIndexPage/TableItem";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

export default function PlayerIndexPage() {
  const { width: viewportWidth, height: viewportHeight } =
    useWindowDimensions();
  const [tableHeight, setTableHeight] = useState(0);
  const [tableWidth, setTableWidth] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [contentContainer, setContentContainer] = useState<View | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [itemPositions, setItemPositions] = useState<Record<number, number>>(
    {},
  );

  // Refs for TableItem measurement functions
  const itemMeasureRefs = useRef<(() => void)[]>([]);
  const hasScrolledToItem = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  // Call all measure functions on scroll
  const handleScroll = (event: any) => {
    const newScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(newScrollY);
    itemMeasureRefs.current.forEach((measure) => measure && measure());
  };

  // Helper to register each item's measure function
  const registerMeasure = (index: number, fn: () => void) => {
    itemMeasureRefs.current[index] = fn;
  };

  // Labels for items (for demonstration)
  const items = [
    { id: 1, type: "meal", label: "Meal 1" },
    { id: 2, type: "workout", label: "Workout 1" },
    { id: 3, type: "meal", label: "Meal 2" },
    { id: 4, type: "workout", label: "Workout 2" },
    { id: 5, type: "meal", label: "Meal 3" },
    { id: 6, type: "workout", label: "Workout 3" },
    { id: 7, type: "workout", label: "Workout 4" },
    { id: 8, type: "workout", label: "Workout 5" },
    { id: 9, type: "workout", label: "Workout 6" },
    { id: 10, type: "workout", label: "Workout 7" },
    { id: 11, type: "meal", label: "Meal 4" },
    { id: 12, type: "meal", label: "Meal 5" },
    { id: 13, type: "meal", label: "Meal 6" },
    { id: 14, type: "meal", label: "Meal 7" },
  ];

  // Store item position when measured (only if it changed)
  const handleItemPositionMeasured = useCallback((id: number, y: number) => {
    setItemPositions((prev) => {
      // Only update if the position actually changed
      if (prev[id] !== y) {
        return { ...prev, [id]: y };
      }
      return prev;
    });
  }, []);

  // Animated scroll to a specific item by ID
  const scrollToItem = useCallback(
    (id: number, animated: boolean = true) => {
      const itemY = itemPositions[id];
      if (itemY !== undefined) {
        // Position the item 100 pixels above the bottom of the viewport
        const targetOffset = Math.max(0, itemY - tableHeight + 100);

        if (!animated) {
          setScrollOffset(targetOffset);
          console.log(
            `Scrolling to item ${id} at position ${itemY}, offset: ${targetOffset}`,
          );
          return;
        }

        // Cancel any ongoing animation
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // Capture current scroll offset at the time of the call
        setScrollOffset((currentOffset) => {
          const startOffset = currentOffset;
          const distance = targetOffset - startOffset;
          const duration = 2000; // Animation duration in milliseconds
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic easing function for smooth deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const newOffset = startOffset + distance * easeProgress;
            setScrollOffset(newOffset);

            if (progress < 1) {
              animationFrameRef.current = requestAnimationFrame(animate);
            } else {
              animationFrameRef.current = null;
              console.log(
                `Scrolled to item ${id} at position ${itemY}, offset: ${targetOffset}`,
              );
            }
          };

          animationFrameRef.current = requestAnimationFrame(animate);
          return currentOffset; // Don't change offset in this setState call
        });
      } else {
        console.warn(`Item ${id} position not yet measured`);
      }
    },
    [itemPositions, tableHeight],
  );

  // Auto-scroll to bottom when content is ready (only once)
  useEffect(() => {
    if (contentHeight > 0 && tableHeight > 0) {
      const targetOffset = contentHeight - tableHeight;
      setScrollOffset(targetOffset);
    }
  }, [contentHeight, tableHeight]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Extract item 7 position to avoid object reference issues
  const item7Position = itemPositions[7];

  // Auto-scroll to item 7 after initial load (only once)
  useEffect(() => {
    if (
      !hasScrolledToItem.current &&
      item7Position !== undefined &&
      tableHeight > 0
    ) {
      hasScrolledToItem.current = true;
      const timer = setTimeout(() => {
        scrollToItem(7);
      }, 200); // Wait 2 seconds after scrolling to bottom
      return () => clearTimeout(timer);
    }
  }, [item7Position, tableHeight, scrollToItem]);

  return (
    <LinearGradient
      colors={["#F8F9F2", "#024F25"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ padding: 20, gap: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Player Index Page
        </Text>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: viewportWidth,
          height: viewportHeight * 0.7,
          overflow: "hidden",
          alignSelf: "center",
        }}
        onLayout={({ nativeEvent }: LayoutChangeEvent) => {
          setTableHeight(nativeEvent.layout.height);
          setTableWidth(nativeEvent.layout.width);
        }}
      >
        <TableBg
          style={{
            width: viewportWidth,
            height: "100%",
            alignSelf: "center",
          }}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          height: tableHeight,
          width: tableWidth,
          alignSelf: "center",
        }}
      >
        <ScrollView
          contentOffset={{ x: 0, y: scrollOffset }}
          style={{
            position: "relative",
            height: tableHeight,
            width: tableWidth,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate={0}
          onContentSizeChange={(
            contentWidth: number,
            contentHeightValue: number,
          ) => {
            setContentHeight(contentHeightValue);
          }}
        >
          <View
            ref={setContentContainer}
            collapsable={false}
            style={{
              width: tableWidth,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {items.map((item, idx) => (
              <TableItem
                key={item.id}
                id={item.id}
                type={item.type as "meal" | "workout"}
                label={item.label}
                contentContainer={contentContainer}
                scrollY={scrollY}
                refCallback={(fn: () => void) => registerMeasure(idx, fn)}
                parentHeight={tableHeight}
                parentWidth={tableWidth}
                onPositionMeasured={(y: number) =>
                  handleItemPositionMeasured(item.id, y)
                }
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
