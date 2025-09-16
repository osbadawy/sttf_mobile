import CardWithTitle from "@/components/CardWithTitle";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";
import { PerformanceIcon } from "../icons";

interface PerformanceSectionProps {
    performance: number;
    performance14DaysHistory: number[];
}

export default function PerformanceSection({performance, performance14DaysHistory}: PerformanceSectionProps) {
    const { t: tWellbeing } = useLocalization('components.dashboard.wellbeingSection');
    const { t, isRTL } = useLocalization('stats');

    const performance14Days = performance14DaysHistory.reduce((acc, curr) => acc + curr, 0) / performance14DaysHistory.length;
    const todaysDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' }).replace('/', '.');
    
    // Generate dates for the last 14 days
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 13; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(date.toLocaleDateString('en-US', { day: '2-digit' }));
        }
        return dates;
    };
    
    const dates = generateDates();

    return (
        <CardWithTitle title={tWellbeing('performance')} icon={<PerformanceIcon />} titleColor="text-black" arrow={false} isRTL={isRTL}>
            <View className="flex-row justify-between mb-4">
                <Text>
                    <Text className="font-inter-semibold text-3xl">{Math.round(performance) + " "}</Text>
                    <Text className="font-inter-light text-xs text-[#4B4B4B]">{todaysDate}</Text>
                </Text>
                <Text>
                    <Text className="font-inter-semibold text-3xl text-[#757575]">{Math.round(performance14Days) + " "}</Text>
                    <Text className="font-inter-light text-xs text-[#969696]">{t('14DayAvg')}</Text>
                </Text>
            </View>
            
            {/* Bar Chart */}
            <View className="flex-row items-end justify-center h-[130px] px-5 relative">
                {performance14DaysHistory.map((value, index) => {
                    const isLatest = index === performance14DaysHistory.length - 1;
                    const height = ((value) / 100) * 100;
                    
                    return (
                        <View key={index} className="items-center flex-1">
                            <View 
                                className={`w-4 rounded-3xl ${isLatest ? "bg-performance" : "bg-performanceLight"}`}
                                style={{
                                    height: height,
                                }}
                            />
                            <Text className="text-xs text-[#969696] mt-5 font-inter-light">
                                {dates[index]}
                            </Text>
                        </View>
                    );
                })}
                <View className="absolute bottom-[20px] w-full border-b-[2px] border-dotted border-[#BDBDBD]"/>
            </View>
        </CardWithTitle>
    );
}