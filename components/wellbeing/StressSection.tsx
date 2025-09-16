import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";
import CardWithTitle from "../CardWithTitle";
import { StressIcon } from "../icons";

interface StressSectionProps {
    stress: number;
    stress14Days: number;
}

export default function StressSection({stress, stress14Days}: StressSectionProps) {
    const { t: tWellbeing } = useLocalization('components.dashboard.wellbeingSection');
    const { t, isRTL } = useLocalization('stats');

    const todaysDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' }).replace('/', '.');

    const radius = 70 + 11;
    const circumference = 2 * Math.PI * radius;
    const removeFromCircle = 0.25;
    const stressPercentage = stress/10;
    const averageStressPercentage = stress14Days/10;
    
    // Calculate marker position on the circle
    const centerX = 150;
    const centerY = 150;
    const markerAngle = (135 + (averageStressPercentage * 270)) * (Math.PI / 180); // 270 degrees available (360 - 90 for gap)
    
    // Calculate triangle coordinates (flat edge on outside)
    const triangleSize = 5;
    const triangleHeight = 5; // Make triangle longer
    const outerX = centerX + (radius + 8) * Math.cos(markerAngle);
    const outerY = centerY + (radius + 8) * Math.sin(markerAngle);
    const innerX = centerX + (radius - triangleHeight) * Math.cos(markerAngle);
    const innerY = centerY + (radius - triangleHeight) * Math.sin(markerAngle);
    
    // Create triangle points (flat edge on outer edge, point toward center)
    const trianglePoints = `${outerX - triangleSize * Math.cos(markerAngle + Math.PI/2)},${outerY - triangleSize * Math.sin(markerAngle + Math.PI/2)} ${outerX + triangleSize * Math.cos(markerAngle + Math.PI/2)},${outerY + triangleSize * Math.sin(markerAngle + Math.PI/2)} ${innerX},${innerY}`;
    
    // Calculate text position - always on the outside of the circle
    const textDistance = stress14Days > 6 ? 34 : 25; // Distance from circle edge
    const textX = centerX + (radius + textDistance) * Math.cos(markerAngle);
    const textY = centerY + (radius + textDistance) * Math.sin(markerAngle);
    
    // Adjust text position based on angle to prevent clipping and center text overlap
    // For angles in the upper half (above center), move text further out
    const isUpperHalf = markerAngle > Math.PI && markerAngle < 2 * Math.PI;
    
    // Check if marker is too close to center (where center text is)
    const isNearCenter = (markerAngle > 1.2 && markerAngle < 1.9) || (markerAngle > 4.4 && markerAngle < 5.1);
    
    // Adjust both X and Y positions when near center
    const centerAvoidanceDistance = isNearCenter ? 20 : 0;
    const adjustedTextX = textX + (isNearCenter ? centerAvoidanceDistance * Math.cos(markerAngle + Math.PI/2) : 0);
    const adjustedTextY = isUpperHalf ? textY - 30 : textY;
    return (
        <CardWithTitle title={tWellbeing('stress')} icon={<StressIcon />} titleColor="text-black" arrow={false} isRTL={isRTL}>
            <Text className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}>{t("14DayAvg")}</Text>
            <View className="flex w-full items-center">
                <Svg width={300} height={250}>
                    <Circle
                        cx={centerX}
                        cy={centerY}
                        r={radius}
                        stroke="#DEDEDE"
                        strokeWidth="23"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * removeFromCircle}
                        strokeLinecap="round"
                        transform={`rotate(135 ${centerX} ${centerY})`}
                    />

                    <Circle
                        cx={centerX}
                        cy={centerY}
                        r={radius}
                        stroke={"#FABB00"}
                        strokeWidth="23"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (removeFromCircle + (1 - stressPercentage) * (1 - removeFromCircle))}
                        strokeLinecap="round"
                        transform={`rotate(135 ${centerX} ${centerY})`}
                    />
                    
                    {/* Average marker - Triangle */}
                    <Polygon
                        points={trianglePoints}
                        fill="black"
                        stroke="none"
                    />
                    
                    {/* Center text */}
                    <View style={{ 
                        position: 'absolute', 
                        left: centerX - 50,
                        top: centerY - 30,
                        width: 100,
                        height: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text className="font-inter-semibold text-5xl pb-2">{stress.toFixed(1)}</Text>
                        <Text className="font-inter-light text-xs text-[#969696]">{todaysDate}</Text>
                    </View>
                    
                    {/* Average text outside circle */}
                     <View style={{ 
                         position: 'absolute', 
                         left: adjustedTextX - 20, 
                         top: adjustedTextY - 10, 
                         alignItems: 'center',
                         justifyContent: 'center'
                     }}>
                         <Text className="font-inter-semibold text-2xl text-center text-[#424242]">{stress14Days.toFixed(1)}</Text>
                         <Text className="font-inter-light text-base text-center text-[#969696]">{t('avg')}</Text>
                     </View>
                </Svg>
            </View>
        </CardWithTitle>
    );
}