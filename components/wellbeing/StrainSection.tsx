import CardWithTitle from "@/components/CardWithTitle";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";
import { StrainIcon } from "../icons";

interface StrainSectionProps {
    strainToday: number;  //0 - 21
    strain14Days: number;
}

export default function StrainSection({strainToday, strain14Days}: StrainSectionProps) {
    const { t: tStats, isRTL } = useLocalization('stats');
    const { t: tWellbeing } = useLocalization('components.dashboard.wellbeingSection');

    //in the form of 02.09 not 02/09
    const todaysDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' }).replace('/', '.');

    return (
        <CardWithTitle title={tWellbeing('strain')} icon={<StrainIcon />} titleColor="text-black" arrow={false}>
           <View className="flex-row justify-between">
            <Text>
                <Text className="font-inter-semibold text-lg">
                    {strainToday}
                </Text>
                <Text className="font-inter-regular text-sm text-gray-600">
                    {todaysDate}
                </Text>
            </Text>
            <Text>
                <Text className="font-inter-semibold text-lg">
                    {strain14Days}
                </Text>
                <Text className="font-inter-regular text-sm text-gray-600">
                    {tStats('14DayAvg')}
                </Text>
            </Text>
           </View>
        </CardWithTitle>
    );
}