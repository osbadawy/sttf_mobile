import { Text, View } from 'react-native';


interface SleepSectionProps {
    sleepScore: number;
    sleepDurationMilli: number;
    sleepNeededMilli: number;

}

export default function SleepSection() {
  return (
    <View>
      <Text>Sleep</Text>

      
    </View>
  );
}