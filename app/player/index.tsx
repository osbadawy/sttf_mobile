import TableBg from "@/components/icons/playerIndexPage/TableBg";
import TableItem from "@/components/playerIndexPage/TableItem";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { LayoutChangeEvent, ScrollView, Text, View } from "react-native";

export default function PlayerIndexPage() {
  const [tableHeight, setTableHeight] = useState(0);
  const [tableWidth, setTableWidth] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Ref for ScrollView
  const scrollViewRef = useRef<ScrollView>(null);
  const [contentContainer, setContentContainer] = useState<View | null>(null);

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
    { type: "meal", label: "Meal 1" },
    { type: "workout", label: "Workout 1" },
    { type: "meal", label: "Meal 2" },
    { type: "workout", label: "Workout 2" },
    { type: "meal", label: "Meal 3" },
    { type: "workout", label: "Workout 3" },
    { type: "workout", label: "Workout 4" },
    { type: "workout", label: "Workout 5" },
    { type: "workout", label: "Workout 6" },
    { type: "workout", label: "Workout 7" },
    { type: "meal", label: "Meal 4" },
    { type: "meal", label: "Meal 5" },
    { type: "meal", label: "Meal 6" },
    { type: "meal", label: "Meal 7" },
  ];

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
          ref={scrollViewRef}
          style={{
            position: "relative",
            height: tableHeight,
            width: tableWidth,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
                key={item.label}
                type={item.type as "meal" | "workout"}
                label={item.label}
                contentContainer={contentContainer}
                scrollY={scrollY}
                // Register each measure function for parent to call
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
