import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import CardWithTitle from "../CardWithTitle";
import { HeartLine3 } from "../icons";

interface HeartRateHistory {
    resting: number;
    max: number;
}

interface MaxAndRestingHeartRateSectionProps {
    history: HeartRateHistory[];
}

export default function MaxAndRestingHeartRateSection({ history }: MaxAndRestingHeartRateSectionProps) {
    const { t: tHeart } = useLocalization('components.heart');
    const { t, isRTL } = useLocalization('stats');

    const minVal = history.map(item => item.resting).reduce((a, b) => Math.min(a, b), Infinity);
    const maxVal = history.map(item => item.max).reduce((a, b) => Math.max(a, b), -Infinity);
    const today = history[history.length - 1]

    const averageMax = history.map(item => item.max).reduce((a, b) => a + b, 0) / history.length;
    const averageResting = history.map(item => item.resting).reduce((a, b) => a + b, 0) / history.length;

    return (
        <CardWithTitle title={tHeart('maxRestingTitle')} icon={<HeartLine3 />} titleColor="text-black" arrow={false} isRTL={isRTL} className="px-6">
            <View className="flex-row justify-start pt-8">
                <View style={{ width: "50%" }}>
                    <Text className="effra-medium text-base pb-3">{t('max')}</Text>
                    <Text className="font-inter-semibold text-3xl">{today.max.toString() + " "}
                        <Text className="font-inter-light text-base text-[#4B4B4B]">bpm</Text>
                    </Text>
                </View>
                <View style={{ width: "50%" }}>
                    <Text className="effra-medium text-base pb-3">{t('resting')}</Text>
                    <Text className="font-inter-semibold text-3xl text-[#757575]">{today.resting.toString() + " "}
                        <Text className="font-inter-light text-base text-[#969696]">bpm</Text>
                    </Text>
                </View>
            </View>

            <View className="h-[200px] w-full flex-row flex justify-between items-end">
                {history.map((item, index) => {
                    const height = (item.max - item.resting) / (maxVal - minVal) * 200;
                    const yTranslate = minVal - item.resting;

                    const isLatest = index === history.length - 1;
                    const gradientColors = isLatest ? [colors.heart, colors.heartResting] : [colors.heartLight, colors.heartRestingLight];

                    return (
                        <View key={index} style={{ 
                            height: Math.round(height), 
                            transform: [{ translateY: yTranslate }],
                            alignItems: 'center'
                        }}>
                            {/* Top circle */}
                            <View className={`w-4 h-4 rounded-full bg-white mb-[-1px] border-[3px] border-solid ${isLatest ? "border-heart" : "border-heartLight"}`}/>
                            
                            {/* Gradient bar */}
                            <LinearGradient 
                                colors={gradientColors as [string, string]} 
                                style={{ 
                                    width: 5, 
                                    height: Math.round(height) - 8
                                }}
                            />
                            
                            {/* Bottom circle */}
                            <View className={`w-4 h-4 rounded-full bg-white mt-[-1px] border-[3px] border-solid ${isLatest ? "border-heartResting" : "border-heartRestingLight"}`}/>
                        </View>
                    )
                })}
            </View>

            <View className="mb-6 mt-10 w-full border-b-[2px] border-dotted border-[#BDBDBD]"/>

            <Text className={` effra-medium text-base pb-3 ${isRTL ? "text-right" : "text-left"}`}>{t('14DayAvg')}</Text>
            <View className="flex-row justify-start mb-4">
                <Text style={{ width: "50%" }}>
                    <Text className="font-inter-semibold text-3xl">{Math.round(averageMax) + " "}</Text>
                    <Text className="font-inter-light text-xs text-[#4B4B4B]">bpm</Text>
                </Text>
                <Text style={{ width: "50%" }}>
                    <Text className="font-inter-semibold text-3xl text-[#757575]">{Math.round(averageResting) + " "}</Text>
                    <Text className="font-inter-light text-xs text-[#969696]">bpm</Text>
                </Text>
            </View>
        </CardWithTitle>
    );
}