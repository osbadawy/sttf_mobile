import SelfAssessmentPage, {
  SelfAssessmentOnPressProps,
} from "@/components/SelfAssessment";
import { useLocalization } from "@/contexts/LocalizationContext";

export default function TirednessSelfAssessmentPage() {
  const { t } = useLocalization("components.selfAssessment.tiredness");

  const onPress = async ({
    value,
    accessToken,
    setDisableButton,
  }: SelfAssessmentOnPressProps) => {
    console.log(value, accessToken, setDisableButton);
  };

  return (
    <SelfAssessmentPage
      onPress={onPress}
      pageText={{
        title: t("title"),
        notice: t("notice"),
        sliderTitle: t("sliderTitle"),
        sliderLeft: t("sliderLeft"),
        sliderRight: t("sliderRight"),
        buttonText: t("done"),
      }}
    />
  );
}
