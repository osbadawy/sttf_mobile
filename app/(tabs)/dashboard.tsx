import ParallaxScrollView from "@/components/ParallaxScrollView";
import WellbeingSection from "@/components/dashboard/WellbeingSection";

export default function Dashboard() {

    return (
        <ParallaxScrollView>
            {/* <Wellness performance={0.8} stress={0.7} strain={0.6} /> */}
            <WellbeingSection performance={80} stress={70} strain={60} />
            {/* <ProgressRing /> */}
        </ParallaxScrollView>
    );
}