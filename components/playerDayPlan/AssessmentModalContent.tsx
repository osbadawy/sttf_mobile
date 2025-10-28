import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { PlayerSelfAssessment } from "@/schemas/PlayerSelfAssessment";
import SelfAssessmentIcon from "../icons/SelfAssessmentIcon";
interface AssessmentModalContentProps {
  assessment: PlayerSelfAssessment;
  category: string;
}

export default function AssessmentModalContent({
  assessment,
  category,
}: AssessmentModalContentProps) {
  const { t: tTiredness } = useLocalization(
    "components.selfAssessment.tiredness",
  );
  const { t: tReadiness } = useLocalization(
    "components.selfAssessment.readiness",
  );
  const { t } = useLocalization("components.dayPlan");

  const selfAssessmentText =
    category === "tiredness"
      ? t("selfAssessmentTiredness")
      : t("selfAssessmentReadiness");

  // subtitle = t(category);
  const title = t("assessment");

  const startOfDay = new Date();
  startOfDay.setHours(7, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(19, 0, 0, 0);

  let start = category === "readiness" ? startOfDay : endOfDay;
  if (assessment) {
    start = assessment.createdAt;
  }

  return {
    subtitle: t("assessment"),
    title,
    icon: <SelfAssessmentIcon />,
    color: colors.yellow,
    contentElement: null,
    selfAssessmentText,
    points: 20,
    startTime: start,
    calories: null,
  };
}
