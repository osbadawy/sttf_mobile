import { SleepIcon } from '@/components/icons';
import TitleWithIcon from '@/components/TitleWithIcon';
import { useLocalization } from '@/contexts/LocalizationContext';
import { View } from 'react-native';


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
    <View 
      className="bg-white w-full px-6 py-7"
    >
      <TitleWithIcon title={t('title')} icon={<SleepIcon />} titleColor="text-black" isRTL={isRTL} />

      
    </View>
  );
}