import Card from "@/components/Card";
import TitleWithIcon from "@/components/TitleWithIcon";
import { View } from "react-native";

interface CardWithTitleProps {
    children: React.ReactNode;
    title: string;
    icon: React.ReactNode;
    titleColor: string;
    arrow?: boolean;
    isRTL?: boolean;
    className?: string;
}
export default function CardWithTitle({ children, title, icon, titleColor, arrow=false, isRTL=false, className=""}: CardWithTitleProps) {
    return (
        <Card className={`px-6 py-6 overflow-hidden relative ${className}`}>
            <TitleWithIcon title={title} icon={icon} titleColor={titleColor} arrow={arrow} isRTL={isRTL} />
            <View className="transform translate-x-[-50vw] w-[200vw] h-1 border-b border-black opacity-20 my-3"/>
            {children}
        </Card>
    );
}