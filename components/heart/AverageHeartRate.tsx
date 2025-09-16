import colors from "@/colors";
import CardWithTitle from "@/components/CardWithTitle";
import { HeartWithLine } from "@/components/icons";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useState } from "react";
import { Text, View } from "react-native";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme } from "victory-native";

interface HeartRateHistory {
    time: string;
    heartRate: number;
}

interface AverageHeartRateProps {
    averageHeartRate: number;
    averageHeartRateHistory: HeartRateHistory[];
    HRV: number;
    averageHRV: number;
}

export default function AverageHeartRate({ averageHeartRate, averageHeartRateHistory, HRV, averageHRV }: AverageHeartRateProps) {
    const { t: tHeart } = useLocalization('components.heart.avg');
    const { t, isRTL } = useLocalization('stats');
    const [containerWidth, setContainerWidth] = useState(300); // Default fallback width

    const chartData = averageHeartRateHistory.map((item) => {
        // Convert time string to minutes since midnight for proper x-axis scaling
        const [hours, minutes] = item.time.split(':').map(Number);
        const minutesSinceMidnight = hours * 60 + minutes;
        return {
            x: minutesSinceMidnight,
            y: item.heartRate,
        };
    });

    console.log(averageHeartRateHistory);

    return (
        <CardWithTitle title={tHeart('title')} icon={<HeartWithLine />} titleColor="text-black" arrow={false} isRTL={isRTL} onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width);
        }}>
            <View className="mb-4">
                <Text className="text-2xl font-bold text-center mb-2">{averageHeartRate} BPM</Text>
                <Text className="text-sm text-gray-600 text-center">Average Heart Rate</Text>
            </View>

            <View className="relative h-[200px]">
                <View style={{ left: 0, position: 'absolute' }} accessibilityLabel="Heart rate chart">
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domainPadding={{ x: 20, y: 30 }}
                        height={200}
                        width={containerWidth}
                        >
                        <VictoryAxis
                        dependentAxis
                        style={{ 
                            axis: { stroke: 'none' },
                            ticks: { stroke: 'none' },
                            tickLabels: { opacity: 0.5 },
                            grid: { stroke: '#e0e0e0', strokeWidth: 1, strokeDasharray: '2,2' }
                        }}
                    />
                    <VictoryAxis
                    style={{ 
                        axis: { stroke: 'none' },
                        ticks: { stroke: 'none' },
                        tickLabels: { opacity: 0.5 },
                        grid: { stroke: '#e0e0e0', strokeWidth: 1 }
                    }}
                    tickFormat={(t) => {
                        const hours = Math.floor(t / 60);
                        const minutes = t % 60;
                        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    }}
                />
                        <VictoryLine
                            data={chartData}
                            style={{ data: { stroke: colors.heartLight, strokeWidth: 3 } }}
                        />
                        <VictoryScatter
                            data={chartData}
                            style={{ data: { fill: "#FFFFFF", stroke: colors.heart, strokeWidth: 3 } }}
                            size={8}
                        />
                    </VictoryChart>
                </View>
            </View>
        </CardWithTitle>
    );
}