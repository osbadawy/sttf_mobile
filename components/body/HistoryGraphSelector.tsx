// components/body/HistoryGraphSelector.tsx
import RenderGraph from "@/components/body/RenderGraph";
import RenderHistory from "@/components/body/RenderHistory";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export type BodyCompositionData = {
  id: string;
  bmi?: string | number;
  body_fat_percentage?: string | number;
  muscle_mass_percentage?: string | number;
  weight_kg?: string | number;
  day?: string;
  measurement_date?: string;
  [key: string]: any;
};

type Props = {
  initialTab?: "history" | "graph";
  isRTL?: boolean;
  bodyCompositions: BodyCompositionData[];
};

export default function HistoryGraphSelector({
  initialTab = "history",
  isRTL = false,
  bodyCompositions,
}: Props) {
  const [active, setActive] = useState<"history" | "graph">(initialTab);
  const rowDir = isRTL ? "flex-row-reverse" : "flex-row";

  const Seg = ({ id, label }: { id: "history" | "graph"; label: string }) => {
    const selected = active === id;
    return (
      <Pressable
        onPress={() => setActive(id)}
        className={[
          "px-5 py-2 rounded-full",
          selected
            ? "bg-white border border-emerald-600"
            : "bg-neutral-100 border border-transparent",
        ].join(" ")}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <Text
          className={
            selected ? "text-black font-medium" : "text-neutral-500 font-medium"
          }
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View className="px-4 bg-white rounded-xl">
      {/* Segmented control */}
      <View
        className={[
          "self-center mb-4 rounded-full p-1 border border-neutral-200/60 bg-white/70",
          "shadow-sm shadow-black/5",
        ].join(" ")}
      >
        <View className={`${rowDir} gap-2 bg-neutral-100 rounded-full `}>
          <Seg id="history" label="History" />
          <Seg id="graph" label="Graph" />
        </View>
      </View>

      {/* Conditional rendering */}
      <View className="mt-2">
        {active === "history" ? (
          <RenderHistory bodyCompositions={bodyCompositions} />
        ) : (
          <RenderGraph bodyCompositions={bodyCompositions} />
        )}
      </View>
    </View>
  );
}
