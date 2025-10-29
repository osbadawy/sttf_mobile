// components/body/RenderGraph.tsx
import { BodyCompositionData } from "@/components/body/HistoryGraphSelector";
import MetricsLineChart from "@/components/body/MetricsLineChart";
import { Text, View } from "react-native";

type Props = {
  bodyCompositions: BodyCompositionData[];
};

export default function RenderGraph({ bodyCompositions }: Props) {
  // Transform API data to chart format (reverse to show oldest to newest)
  const reversedData = [...bodyCompositions].reverse();

  const weightData = reversedData.map((item) =>
    parseFloat(String(item.weight_kg || 0)),
  );
  const BMIData = reversedData.map((item) => parseFloat(String(item.bmi || 0)));
  const FatData = reversedData.map((item) =>
    parseFloat(String(item.body_fat_percentage || 0)),
  );
  const MuscleData = reversedData.map((item) =>
    parseFloat(String(item.muscle_mass_percentage || 0)),
  );
  return (
    <View className="px-2">
      {/* WEIGHT SECTION */}
      <View className="py-2">
        <Text className="font-bold text-lg">Weight</Text>
      </View>
      <View className="py-8 items-center justify-center">
        <MetricsLineChart
          type="Weight"
          data={weightData}
          width={330}
          height={180}
          style={{ marginHorizontal: 16 }}
        />
      </View>

      {/* BMI SECTION */}
      <View className="py-2">
        <Text className="font-semibold text-lg">BMI</Text>
      </View>
      <View className="py-8 items-center justify-center">
        <MetricsLineChart
          type="BMI"
          data={BMIData}
          width={330}
          height={180}
          style={{ marginHorizontal: 16 }}
        />
      </View>

      {/* Fat% SECTION */}
      <View className="py-2">
        <Text className="font-semibold text-lg">Fat%</Text>
      </View>
      <View className="py-8 items-center justify-center">
        <MetricsLineChart
          type="Fat"
          data={FatData}
          width={330}
          height={180}
          style={{ marginHorizontal: 16 }}
        />
      </View>

      {/* Fat% SECTION */}
      <View className="py-2">
        <Text className="font-semibold text-lg">Muscle%</Text>
      </View>
      <View className="py-8 items-center justify-center">
        <MetricsLineChart
          type="Muscle"
          data={MuscleData}
          width={330}
          height={180}
          style={{ marginHorizontal: 16 }}
        />
      </View>
    </View>
  );
}
