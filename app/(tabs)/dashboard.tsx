import ParallaxScrollView from "@/components/ParallaxScrollView";
import SleepSection from "@/components/dashboard/SleepSection";
import WellbeingSection from "@/components/dashboard/WellbeingSection";

export default function Dashboard() {

    return (
        <ParallaxScrollView>
            <WellbeingSection performance={0.5} strain={0.5} stress={0.5} animationDuration={1000} />
            <SleepSection sleepScore={0.8} sleepDurationMilli={27360000} sleepNeededMilli={30240000}/>
        </ParallaxScrollView>
    );
}