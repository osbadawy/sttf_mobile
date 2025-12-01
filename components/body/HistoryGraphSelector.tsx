// components/body/HistoryGraphSelector.tsx
import RenderGraph from "@/components/body/RenderGraph";
import RenderHistory from "@/components/body/RenderHistory";
import CustomSelector from "@/components/CustomSelector";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useState } from "react";
import { View } from "react-native";

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
  const { t } = useLocalization("components.body");

  return (
    <View className="px-4 bg-white rounded-xl">
      {/* Segmented control */}
      <View className="mb-4">
        <CustomSelector
          options={[
            { id: "history", label: t("history") },
            { id: "graph", label: t("graph") },
          ]}
          value={active}
          onChange={setActive}
          isRTL={isRTL}
        />
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
