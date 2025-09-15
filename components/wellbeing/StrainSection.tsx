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
        <CardWithTitle title={tWellbeing('strain')} icon={<StrainIcon />} titleColor="text-black" arrow={false} isRTL={isRTL}>
           <View className="flex-row justify-between">
            <Text>
                <Text className="font-inter-semibold text-3xl">
                    {strainToday + " "}
                </Text>
                <Text className="font-inter-light text-xs text-[#4B4B4B]">
                    {todaysDate}
                </Text>
            </Text>
            <Text>
                <Text className="font-inter-semibold text-3xl text-[#757575]">
                    {strain14Days + " "}
                </Text>
                <Text className="font-inter-light text-xs text-[#969696]">
                    {tStats('14DayAvg')}
                </Text>
            </Text>
           </View>
        </CardWithTitle>
    );
}