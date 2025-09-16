import colors from "@/colors";
import CardWithTitle from "@/components/CardWithTitle";
import { HeartLine2 } from "@/components/icons";
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

export default function AverageHeartRateSection({ averageHeartRate, averageHeartRateHistory, HRV, averageHRV }: AverageHeartRateProps) {
    const { t: tHeart } = useLocalization('components.heart');
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

    const averageHeartRate14Days = averageHeartRateHistory.reduce((acc, curr) => acc + curr.heartRate, 0) / averageHeartRateHistory.length;

    const xValues = chartData.map(d => d.x);
    
    return (
        <CardWithTitle title={tHeart('avgTitle')} icon={<HeartLine2 />} titleColor="text-black" arrow={false} isRTL={isRTL} onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width);
        }}>
            <View className="flex-row justify-start mb-4">
                <Text style={{ width: "50%" }}>
                    <Text className="font-inter-semibold text-3xl">{Math.round(averageHeartRate) + " "}</Text>
                    <Text className="font-inter-light text-xs text-[#4B4B4B]">bpm</Text>
                </Text>
                <Text style={{ width: "50%" }}>
                    <Text className="font-inter-semibold text-3xl text-[#757575]">{Math.round(averageHeartRate14Days) + " "}</Text>
                    <Text className="font-inter-light text-xs text-[#969696]">{t('14DayAvg')}</Text>
                </Text>
            </View>

            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{ x: 20, y: 30 }}
                padding={{ left: 40, right: 40, top: 10, bottom: 40 }}
                width={containerWidth}
                style={{
                    parent: {
                        borderTopWidth: 1,
                        borderTopColor: '#e0e0e0',
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0',
                    }
                }}
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
                 <VictoryLine
                     data={[
                         { x: Math.min(...xValues), y: averageHeartRate },
                         { x: Math.max(...xValues), y: averageHeartRate }
                     ]}
                     style={{ data: { stroke: colors.heart, strokeWidth: 2, strokeDasharray: '5,5', strokeLinecap: 'round', opacity: 0.2 } }}
                 />
                 <VictoryScatter
                     data={chartData}
                     style={{ data: { fill: "#FFFFFF", stroke: colors.heart, strokeWidth: 3 } }}
                     size={8}
                 />
            </VictoryChart>

            <View className="flex-row justify-start pt-8">
                <View style={{ width: "50%" }}>
                    <Text className="effra-medium text-base pb-3">{tHeart('hrv')}</Text>
                    <Text className="font-inter-semibold text-3xl">{HRV + " "}
                        <Text className="font-inter-light text-base text-[#4B4B4B]">ms</Text>
                    </Text>
                </View>
                <View style={{ width: "50%" }}>
                    <Text className="effra-medium text-base pb-3">{tHeart('hrv') + " "}
                        <Text className="effra-light text-base">{t('14DayAvg')}</Text>
                    </Text>
                    <Text className="font-inter-semibold text-3xl text-[#757575]">{averageHRV + " "}
                        <Text className="font-inter-light text-base text-[#969696]">ms</Text>
                    </Text>
                </View>
            </View>
        </CardWithTitle>
    );
}