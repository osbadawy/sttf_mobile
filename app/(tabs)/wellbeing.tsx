import { ArrowRight } from "@/components/icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import StrainSection from "@/components/wellbeing/StrainSection";
import { useLocalization } from "@/contexts/LocalizationContext";
import { RelativePathString, router } from "expo-router";
import { Text, View } from "react-native";

export default function WellbeingPage() {
    const { t, isRTL } = useLocalization('components.dashboard.wellbeingSection');

    const ClickableArrow = ({isRTL}: {isRTL: boolean}) => {
        return <ArrowRight className={isRTL ? '' : 'transform rotate-180'} onPress={() => router.push('dashboard' as RelativePathString)}/>
    }

    return (
        <ParallaxScrollView>
            <View className="flex-row items-center justify-between">
                {isRTL ? <View/> : <ClickableArrow isRTL={isRTL}/>}
                <Text className="effra-medium text-2xl">{t('title')}</Text>
                {isRTL ? <ClickableArrow isRTL={isRTL}/> : <View/>}
            </View>
            <StrainSection strainToday={12} strain14Days={15.5} />
        </ParallaxScrollView>
    );
}