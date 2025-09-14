import ParallaxScrollView from "@/components/ParallaxScrollView";
import SleepSection from "@/components/dashboard/SleepSection";
import WellbeingSection from "@/components/dashboard/WellbeingSection";

export default function Dashboard() {

    return (
        <ParallaxScrollView>
            <WellbeingSection performance={0.5} strain={0.5} stress={0.5} />
            <SleepSection sleepScore={0.5} sleepDurationMilli={0.5} sleepNeededMilli={0.5} />
        </ParallaxScrollView>
    );
}