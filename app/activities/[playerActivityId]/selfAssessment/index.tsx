import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function SelfAssessmentPage() {
  const { playerActivityId, activityType } = useLocalSearchParams();
  console.log("playerActivityId", playerActivityId);
  console.log("activityType", activityType);

  return (
    <View>
      <Text>Self Assessment</Text>
    </View>
  );
}
