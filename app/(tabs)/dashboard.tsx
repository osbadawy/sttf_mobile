import ParallaxScrollView from "@/components/ParallaxScrollView";
import WellbeingSection from "@/components/dashboard/WellbeingSection";

export default function Dashboard() {

    return (
        <ParallaxScrollView>
            <WellbeingSection performance={0.5} strain={0.5} stress={0.5} />
        </ParallaxScrollView>
    );
}