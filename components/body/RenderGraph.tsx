// components/body/RenderGraph.tsx
import MetricsLineChart from "@/components/body/MetricsLineChart";
import { Text, View } from "react-native";

export default function RenderGraph() {
      const weightData = [26, 37.5, 76.8, 87.2, 28.4, 56.9, 98.1, 56.6];
      const BMIData = [26, 37.5, 22, 16, 24,31,25, 23];
      const FatData = [66, 37.5, 22, 16, 44, 91,75, 23];
      const MuscleData = [66, 37.5, 22, 16, 44, 91,75, 23];
  return (
    <View className="px-2">
        {/* WEIGHT SECTION */}
        <View className="py-2">
          <Text className="font-bold text-lg">Weight</Text>
        </View>
        <View className="py-8 items-center justify-center">
            <MetricsLineChart
              type="Weight"
              data={BMIData}
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
              data={weightData}
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
