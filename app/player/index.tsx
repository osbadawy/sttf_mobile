import Header from "@/components/Header";
import TableBg from "@/components/icons/playerDayPlan/TableBg";
import TrophyIcon from "@/components/icons/playerDayPlan/TrophyIcon";
import Nav from "@/components/Nav";
import TableItem, { TableItemType } from "@/components/playerDayPlan/TableItem";
import TableItemModal, {
  TableItemModalContentProps,
} from "@/components/playerDayPlan/TableItemModal";
import { usePlayerDay } from "@/hooks/usePlayerDay";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";

export default function PlayerIndexPage() {
  const { width: viewportWidth, height: viewportHeight } =
    useWindowDimensions();
  const [scrollY, setScrollY] = useState(0);
  const [contentContainer, setContentContainer] = useState<View | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [itemPositions, setItemPositions] = useState<Record<number, number>>(
    {},
  );

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] =
    useState<TableItemModalContentProps | null>(null);

  const { userName, profilePicture, access } = useUserProfile();

  const { data, error, loading } = usePlayerDay({
    day: new Date(),
  });

  const oldestIncompleteItemIndex =
    data.length - [...data].findIndex((item) => !item.isCompleted);

  const tableHeight = viewportHeight * 0.7;

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
        const targetOffset = Math.max(0, itemY - tableHeight + 200);
        console.log({ itemY, tableHeight, targetOffset });

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

  const oldestIncompleteItemPosition = itemPositions[oldestIncompleteItemIndex];

  // Auto-scroll to item
  useEffect(() => {
    if (
      !hasScrolledToItem.current &&
      oldestIncompleteItemPosition !== undefined &&
      tableHeight > 0
    ) {
      hasScrolledToItem.current = true;
      const timer = setTimeout(() => {
        scrollToItem(oldestIncompleteItemIndex);
      }, 200); // Wait 2 seconds after scrolling to bottom
      return () => clearTimeout(timer);
    }
  }, [oldestIncompleteItemPosition, tableHeight, scrollToItem]);

  return (
    <LinearGradient
      colors={["#F8F9F2", "#024F25"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <Header
        name={userName || access}
        profilePicture={profilePicture}
        showDateSelector={false}
        showBackButton={false}
        showBGImage={false}
        showCalendarIcon={false}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: viewportWidth,
          height: tableHeight,
          overflowX: "hidden",
          alignSelf: "center",
        }}
      >
        <TrophyIcon
          style={{
            position: "absolute",
            top: -131,
            alignSelf: "center",
          }}
        />
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
          width: viewportWidth,
          alignSelf: "center",
        }}
      >
        <ScrollView
          contentOffset={{ x: 0, y: scrollOffset }}
          style={{
            position: "relative",
            height: tableHeight,
            width: viewportWidth,
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
              width: viewportWidth,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: tableHeight / 2,
            }}
          >
            {data.map((item, idx) => (
              <TableItem
                onPress={() => {
                  setShowModal(true);
                  setModalContent({
                    type: item.type as TableItemType,
                    category: item.category,
                    data: item.data,
                  });
                }}
                key={idx}
                type={item.type as TableItemType}
                contentContainer={contentContainer}
                scrollY={scrollY}
                refCallback={(fn: () => void) => registerMeasure(idx, fn)}
                parentHeight={tableHeight}
                parentWidth={viewportWidth}
                isComplete={item.isCompleted}
                category={item.category}
                data={item.data}
                onPositionMeasured={(y: number) =>
                  handleItemPositionMeasured(idx, y)
                }
              />
            ))}
          </View>
        </ScrollView>
        <Nav />
      </View>

      {showModal && (
        <TableItemModal
          visible={showModal}
          content={modalContent}
          onClose={() => setShowModal(false)}
        />
      )}
    </LinearGradient>
  );
}
