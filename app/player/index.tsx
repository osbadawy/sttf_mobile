import TableBg from "@/components/icons/playerIndexPage/TableBg";
import TableItem from "@/components/playerIndexPage/TableItem";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, ScrollView, Text, View } from "react-native";

export default function PlayerIndexPage() {
  const [tableHeight, setTableHeight] = useState(0);
  const [tableWidth, setTableWidth] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [contentContainer, setContentContainer] = useState<View | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Refs for TableItem measurement functions
  const itemMeasureRefs = useRef<(() => void)[]>([]);

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

  // Auto-scroll to bottom when content is ready
  useEffect(() => {
    if (contentHeight > 0 && tableHeight > 0) {
      const targetOffset = contentHeight - tableHeight;
      setScrollOffset(targetOffset);
    }
  }, [contentHeight, tableHeight]);

  return (
    <LinearGradient
      colors={["#F8F9F2", "#024F25"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <Text>Player Index Page</Text>

      <TableBg
        style={{ position: "absolute", bottom: 0 }}
        onLayout={({ nativeEvent }: LayoutChangeEvent) => {
          setTableHeight(nativeEvent.layout.height);
          setTableWidth(nativeEvent.layout.width);
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          height: tableHeight,
          width: tableWidth,
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
          onContentSizeChange={(contentWidth: number, contentHeightValue: number) => {
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
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
