import { HeartSection, SleepSection, WellbeingSection } from "@/components/dashboard";
import { HeaderColor } from "@/components/Header";
import { HeartLine1 } from "@/components/icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { RelativePathString } from "expo-router";

export default function Dashboard() {
    const props = {
        // title: "Dashboard",
        name: "Person",
        // profilePicture: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
        color: HeaderColor.primary,
        // backLink: "wellness" as RelativePathString,
        showDateSelector: true,
        notification: {
            title: "Assess detected activity",
            message: "12 minutes ago * Table Tennis",
            path: "wellbeing" as RelativePathString,
            icon: <HeartLine1 />,
        },
    }

    return (
        <ParallaxScrollView headerProps={props}>
            <WellbeingSection performance={0.40} strain={0.5} stress={0.5} animationDuration={1000} />
            <SleepSection sleepScore={0.8} sleepDurationMilli={27360000} sleepNeededMilli={30240000}/>
            <HeartSection dailyAvg={86} max={145} resting={48} />
        </ParallaxScrollView>
    );
}