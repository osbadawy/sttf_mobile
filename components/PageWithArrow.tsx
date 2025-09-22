import { Arrow } from "@/components/icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { RelativePathString, router } from "expo-router";
import { Text, View } from "react-native";

interface PageWithArrowProps {
    title: string;
    backLink?: RelativePathString;
    isRTL: boolean;
    children: React.ReactNode;
}

export default function PageWithArrow({title, backLink, isRTL, children}: PageWithArrowProps) {

    const ClickableArrow = ({isRTL}: {isRTL: boolean}) => {
        return <Arrow direction={isRTL ? 'right' : 'left'} svgProps={{onPress: () => router.push(backLink as RelativePathString)}}/>
    }

    if (!backLink) {
        return (
            <ParallaxScrollView>
                <View className="flex-row items-center justify-center">
                    <Text className="effra-medium text-2xl">{title}</Text>
                </View>
            </ParallaxScrollView>
        );
    }

    return (
        <ParallaxScrollView>
            <View className="flex-row items-center justify-between">
                {isRTL ? <View/> : <ClickableArrow isRTL={isRTL}/>}
                <Text className="effra-medium text-2xl">{title}</Text>
                {isRTL ? <ClickableArrow isRTL={isRTL}/> : <View/>}
            </View>
            {children}
        </ParallaxScrollView>
    );
}