import CustomButton, { ButtonColor } from "@/components/Button";
import Card from "@/components/Card";
import { ExclamationMark } from "@/components/icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CustomSlider from "@/components/Slider";
import { useAuth } from "@/contexts/AuthContext";
import { RelativePathString } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

interface PageTextProps {
  title: string;
  notice: string;
  sliderTitle: string;
  sliderLeft: string;
  sliderRight: string;
  buttonText: string;
}

export interface SelfAssessmentOnPressProps {
  value: number;
  accessToken: string;
  setDisableButton: (disable: boolean) => void;
}

interface SelfAssessmentPageProps {
  onPress: (props: SelfAssessmentOnPressProps) => Promise<void>;
  pageText: PageTextProps;
  customBackPath?: RelativePathString;
}

export default function SelfAssessmentPage({
  onPress,
  pageText,
  customBackPath,
}: SelfAssessmentPageProps) {
  const { user } = useAuth();
  const [value, setValue] = useState(5);
  const [disableButton, setDisableButton] = useState(false);

  const onPressButton = async () => {
    if (user) {
      setDisableButton(true);
      const token = await user.getIdToken();
      await onPress({
        value: value / 10,
        accessToken: token,
        setDisableButton,
      });
      setDisableButton(false);
    }
  };

  return (
    <ParallaxScrollView
      headerProps={{
        title: pageText.title,
        showDateSelector: false,
        showBGImage: false,
        showCalendarIcon: false,
        showBackButton: true,
        customBackPath,
      }}
    >
      <View className="flex-1 flex-col justify-between pb-[60px]">
        <Card
          className="flex-row items-center py-5 px-4"
          style={{ gap: 24, borderRadius: 24 }}
        >
          <Card className="w-[40px] h-[40px] items-center justify-center rounded-full bg-white drop-shadow-md">
            <ExclamationMark />
          </Card>
          <Text className="effra-light text-xs">{pageText.notice}</Text>
        </Card>

        <View>
          <Text className="effra-regualr text-2xl pb-5 text-center">
            {pageText.sliderTitle}
          </Text>
          <CustomSlider
            value={value}
            onChange={setValue}
            leftLabel={pageText.sliderLeft}
            rightLabel={pageText.sliderRight}
          />
        </View>

        <CustomButton
          title={pageText.buttonText}
          onPress={onPressButton}
          color={ButtonColor.primary}
          disabled={disableButton}
        />
      </View>
    </ParallaxScrollView>
  );
}
