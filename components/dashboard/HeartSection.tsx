import { HeartBg, HeartWithLine } from "@/components/icons";
import TitleWithIcon from "@/components/TitleWithIcon";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";

interface HeartSectionProps {
    dailyAvg: number;
    max: number;
    resting: number;
}

export default function HeartSection({dailyAvg, max, resting}: HeartSectionProps) {
    const { t, isRTL } = useLocalization('components.dashboard.heartSection');

    return (
        <View className="mt-11">
            <TitleWithIcon title={t('title')} icon={<HeartWithLine />} titleColor="text-black" isRTL={isRTL}/>
            <View className="flex-row w-full mt-6">
                <View className="bg-white rounded-3xl p-4 relative mr-3" style={{ flex: 2 }}>
                    <Text className="effra-normal">{t('dailyAvg')}</Text>
                    <View className="items-center justify-center flex-1">
                        <HeartBg className="absolute top-0 left-0"/>
                        <View className="absolute">
                            <Text className="effra-semibold text-3xl">{dailyAvg}</Text>
                            <Text className="effra-normal">bpm</Text>
                        </View>
                    </View>
                </View>
                <View className="bg-white rounded-3xl p-4" style={{ flex: 1 }}>
                    <Text className="effra-normal">{t('max')}</Text>
                    <Text className="pb-5">
                        <Text className="effra-semibold text-2xl">{max}</Text>
                        <Text className="effra-normal">bpm</Text>
                    </Text>
                    <Text className="effra-normal">{t('resting')}</Text>
                    <Text>
                        <Text className="effra-semibold text-2xl">{resting}</Text>
                        <Text className="effra-normal">bpm</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}