import Card from '@/components/Card';
import { SleepIcon } from '@/components/icons';
import TitleWithIcon from '@/components/TitleWithIcon';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Animated, Text, View } from 'react-native';


interface SleepSectionProps {
    sleepScore: number;
    sleepDurationMilli: number;
    sleepNeededMilli: number;
}

export default function SleepSection({sleepScore, sleepDurationMilli, sleepNeededMilli}: SleepSectionProps) {
  const { t, isRTL } = useLocalization('components.dashboard.sleepSection');

  const milliToHoursAndMins = (milli: number) => {
    const hours = Math.floor(milli / 3600000);
    const minutes = Math.floor((milli % 3600000) / 60000);
    return { hours, minutes };
  }

  const sleepDuration = milliToHoursAndMins(sleepDurationMilli);
  const sleepNeeded = milliToHoursAndMins(sleepNeededMilli);

  return (
    <Card 
      className="bg-white w-full px-6 pt-6 pb-9 rounded-3xl"
    >
      <TitleWithIcon title={t('title')} icon={<SleepIcon />} titleColor="text-sleep" isRTL={isRTL} arrow={false} />

      <View className="flex-row justify-between pt-10 pb-4 mx-5">
        <Text>
          <Text className="text-3xl effra-semibold">{sleepDuration.hours}</Text>
          <Text className="effra-light">{"h "}</Text>
          <Text className="text-3xl effra-semibold">{sleepDuration.minutes}</Text>
          <Text className="effra-light">min</Text>
        </Text>

        <Text>
          <Text className="text-xl effra-normal">{sleepNeeded.hours}</Text>
          <Text className="effra-light">{"h "}</Text>
          <Text className="text-xl effra-normal">{sleepNeeded.minutes}</Text>
          <Text className="effra-light">min</Text>
        </Text>
      </View>

      <View className="relative mx-5">
        <View className="absolute top-0 left-0 w-full bg-sleep opacity-15 h-1 rounded-sm"/>
        <View className="absolute top-0 left-0 w-full overflow-hidden">
          <Animated.View 
            className="bg-sleep h-1 rounded-sm"
            style={{ 
              width: `${Math.round(sleepScore * 100)}%`
            }}
          />
        </View>
      </View>

    </Card>
  );
}