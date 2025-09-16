import AverageHeartRateSection from "@/components/heart/AverageHeartRateSection";
import MaxAndRestingHeartRateSection from "@/components/heart/MaxAndRestingHeartRateSection";
import PageWithArrow from "@/components/PageWithArrow";
import { useLocalization } from "@/contexts/LocalizationContext";
import { RelativePathString } from "expo-router";

export default function HeartPage() {
    const { t, isRTL } = useLocalization('components.dashboard.heartSection');

    //5 random timestamps withing the past 24 hours
    const averageHeartRateHistory = Array.from({ length: 5 }, () => {
        const date = new Date();
        date.setHours(date.getHours() - Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        return {
            time: time,
            heartRate: Math.floor(Math.random() * 100) + 20
        };
    }).sort((a, b) => a.time.localeCompare(b.time));

    return (
        <PageWithArrow title={t('title')} backLink={"dashboard" as RelativePathString} isRTL={isRTL}>
            <AverageHeartRateSection averageHeartRate={80} averageHeartRateHistory={averageHeartRateHistory} HRV={823} averageHRV={875} />
            <MaxAndRestingHeartRateSection history={[
                { resting: 58, max: 95 }, 
                { resting: 72, max: 128 }, 
                { resting: 65, max: 112 }, 
                { resting: 61, max: 98 }, 
                { resting: 69, max: 125 }, 
                { resting: 55, max: 88 }, 
                { resting: 78, max: 135 }, 
                { resting: 63, max: 108 }, 
                { resting: 71, max: 122 }, 
                { resting: 59, max: 92 }, 
                { resting: 76, max: 130 }, 
                { resting: 67, max: 115 }, 
                { resting: 73, max: 127 }, 
                { resting: 62, max: 105 }
            ]} />
        </PageWithArrow>
    );
}