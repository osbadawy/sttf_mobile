import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function NewActivityPage() {
  const { activityType } = useLocalSearchParams();
  return <View className="flex-1 pt-20">
    <Text>New Activity {activityType}</Text>
  </View>
}