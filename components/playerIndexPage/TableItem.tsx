import { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface TableItemProps {
    type: "meal" | "workout";
    contentContainer: View | null;
    label: string;
    scrollY: number;
    refCallback: (fn: () => void) => void;
    parentHeight: number;
    parentWidth: number;
}

export default function TableItem({ type, contentContainer, label, scrollY, refCallback, parentHeight, parentWidth }: TableItemProps) {
    const [itemView, setItemView] = useState<View | null>(null);
    const [basePosition, setBasePosition] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
  
    const measurePosition = () => {
      if (itemView && contentContainer) {
        itemView.measureLayout(
          contentContainer,
          (x, y, width, height) => {
            setBasePosition({ x, y });
          },
          () => {
            console.warn(`[${label}] Measure failed`);
          }
        );
      }
    };

    // Update position when scroll changes
    useEffect(() => {
      const relativeY = basePosition.y - scrollY;
      setPosition({ x: basePosition.x, y: relativeY });
    }, [scrollY, basePosition]);
    
    // Check if item is visible in viewport (with buffer for transforms)
    const isVisible = () => {
      if (!parentHeight || !basePosition.y) return true; // Render until we have measurements
      
      const relativeY = basePosition.y - scrollY;
      const buffer = 200; // Extra buffer for transforms
      
      // Only render if within viewport bounds (with buffer)
      return relativeY > -buffer && relativeY < parentHeight + buffer;
    };
  
    // Calculate scale and translation based on position in viewport
    // Creates a tilted table effect
    const calculateTransform = () => {
      if (!parentHeight) return { scale: 1, translateX: 0, translateY: 0 };
      
      // Position relative to the visible viewport
      const relativeY = basePosition.y - scrollY;
      
      // Normalize position (0 = top of viewport, 1 = bottom of viewport)
      // Clamp between -0.5 and 1.5 to allow smooth transitions beyond viewport edges
      let normalizedY = relativeY / parentHeight;
      normalizedY = Math.max(-0.5, Math.min(1.5, normalizedY));
      
      // Scale: smaller at top (0.5), larger at bottom (1.0)
      const scale = Math.max(0.5, Math.min(1.0, 0.5 + (0.5 * normalizedY)));
      
      // Position based on type: meals on left, workouts on right
      // Items start centered, we'll use translateX to move them left/right
      const lateralOffset = parentWidth * 0.35; // Distance from center (35% of width)
      
      // Base position offset (negative = left, positive = right)
      const baseOffsetX = type === "meal" ? -lateralOffset : lateralOffset;
      
      // Progressive movement: converge toward center when above center of viewport
      let progress = 0;
      if (normalizedY < 0.5) {
        // In upper half: progress from 0 (at center line) to 1 (at top)
        progress = (0.5 - normalizedY) / 0.5;
      }
      
      // At bottom: full lateral offset (meals left, workouts right) = 35%
      // At top: stay at minimum 15% from center
      // Convergence: move from 35% to 15% = 20% movement = 57% convergence
      const translateX = baseOffsetX; // Keep at least 15% from center at top
      
      // TranslateY: compress vertical spacing as items go up (perspective effect)
      // All items in upper half shift up, with items higher up shifting MORE
      // This causes cumulative compression toward the top
      let translateY = 0;
      // Apply to ALL items, not just upper half, based on their absolute position
      if (basePosition.y > 0) {
        // Calculate how many "item slots" up from the bottom
        const itemHeight = 200; // 100px height + 200px margins (100 top + 100 bottom)
        const itemIndex = basePosition.y / itemHeight;
        // Each item shifts up progressively more
        translateY = -itemIndex * 15; // 15px compression per item position
      }
            
      return { scale, translateX, translateY };
    };
    
    const { scale, translateX, translateY } = calculateTransform();
  
    // Register with parent
    useEffect(() => {
      refCallback(measurePosition);
    }, []);
  
    // Measure when both refs are available
    useEffect(() => {
      if (itemView && contentContainer) {
        measurePosition();
      }
    }, [itemView, contentContainer]);
  
    // Call on layout - store base position
    const handleLayout = (event: any) => {
      const { x, y } = event.nativeEvent.layout;
      setBasePosition({ x, y });
    };
    
    // Callback ref
    const setRef = (ref: View | null) => {
      if (ref) {
        console.log(`[${label}] setRef called`);
        setItemView(ref);
      }
    };
    
    const visible = isVisible();
  
    return (
      <View
        ref={setRef}
        collapsable={false}
        onLayout={handleLayout}
        style={{
          width: 100,
          height: 100,
          backgroundColor: type === "meal" ? "red" : "blue",
          marginHorizontal: 10,
          marginVertical: 50,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 16,
          transform: [{ scale }, { translateX }, { translateY }],
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <Text>{position.x.toFixed(0)}, {position.y.toFixed(0)}</Text>
      </View>
    );
  }
  