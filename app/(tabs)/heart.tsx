import AverageHeartRate from "@/components/heart/AverageHeartRate";
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
            <AverageHeartRate averageHeartRate={80} averageHeartRateHistory={averageHeartRateHistory} HRV={823} averageHRV={875} />
        </PageWithArrow>
    );
}