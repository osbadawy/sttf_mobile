import { Dimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

export default function ProgressRing() {
    const windowWidth = Dimensions.get("window").width;
    const data = {
        data: [0.8, 0.7, 0.6],
    }
    const chartConfig = {
        backgroundColor: "#F8F9F2",
        backgroundGradientFrom: "#F8F9F2",
        backgroundGradientTo: "#F8F9F2",
        decimalPlaces: 2,
        barRadius: 20,
        // propsForLabels: {display: "none"},

        // Individual colors for each progress bar
        color: (opacity = 1, index = 0) => {
            const colors = [
                `rgba(34, 197, 94, ${opacity})`,    // Green for first bar
                `rgba(59, 130, 246, ${opacity})`,   // Blue for second bar
                `rgba(239, 68, 68, ${opacity})`,    // Red for third bar
            ];
            return colors[index] || `rgba(0, 0, 0, ${opacity})`;
        },
    }
    return (
        <ProgressChart
        data={data}
        width={windowWidth * 0.75}
        height={windowWidth * 0.75}
        strokeWidth={20}
        radius={30}
        chartConfig={chartConfig}
        hideLegend={true}
        />
    );
}