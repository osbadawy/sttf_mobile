import PageWithArrow from "@/components/PageWithArrow";
import PerformanceSection from "@/components/wellbeing/PerformanceSection";
import SleepSection from "@/components/wellbeing/SleepSection";
import StrainSection from "@/components/wellbeing/StrainSection";
import StressSection from "@/components/wellbeing/StressSection";
import { useLocalization } from "@/contexts/LocalizationContext";
import { RelativePathString } from "expo-router";

export default function WellbeingPage() {
    const { t, isRTL } = useLocalization('components.dashboard.wellbeingSection');

    return (
        <PageWithArrow title={t('title')} backLink={"dashboard" as RelativePathString} isRTL={isRTL}>
            <PerformanceSection performance={85} performance14DaysHistory={[23, 45, 100, 12, 89, 34, 56, 78, 91, 15, 42, 73, 28, 85]} />
            <StrainSection strainToday={12} strain14Days={15.5} />
            <StressSection stress={7} stress14Days={4} />
            <SleepSection rem={12} sws={15.5} light={18} awake={21} score={0.8} />
        </PageWithArrow>
    );
}