import ParallaxScrollView from "@/components/ParallaxScrollView";
import { HeartSection, SleepSection, WellbeingSection } from "@/components/dashboard";

export default function Dashboard() {

    return (
        <ParallaxScrollView>
            <WellbeingSection performance={0.40} strain={0.5} stress={0.5} animationDuration={1000} />
            <SleepSection sleepScore={0.8} sleepDurationMilli={27360000} sleepNeededMilli={30240000}/>
            <HeartSection dailyAvg={86} max={145} resting={48} />
        </ParallaxScrollView>
    );
}