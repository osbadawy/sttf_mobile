import PageWithArrow from "@/components/PageWithArrow";
import { useLocalization } from "@/contexts/LocalizationContext";
import { RelativePathString } from "expo-router";
import { Text } from "react-native";

export default function HeartPage() {
    const { t, isRTL } = useLocalization('components.dashboard.heartSection');

    return (
        <PageWithArrow title={t('title')} backLink={"dashboard" as RelativePathString} isRTL={isRTL}>
            <Text>Hello</Text>
        </PageWithArrow>
    );
}