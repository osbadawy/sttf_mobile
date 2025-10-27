import SnackIcon from "./SnackIcon";
import AssessmentIcon from "./AssessmentIcon";
import BreakfastIcon from "./BreakfastIcon";
import CompletedIcon from "./CompleteIcon";
import LunchAndDinnerIcon from "./LunchAndDinnerIcon";
import RecoveryIcon from "./RecoveryIcon";
import StrengthIcon from "./StrengthIcon";
import TechnicalIcon from "./TechnicalIcon";

export default function DynamicIcon({
  category,
  isComplete,
}: {
  category?: string;
  isComplete?: boolean;
}) {
  if (isComplete) {
    return <CompletedIcon />;
  }

  if (category === "breakfast") {
    return <BreakfastIcon />;
  } else if (category === "lunch") {
    return <LunchAndDinnerIcon />;
  } else if (category === "dinner") {
    return <LunchAndDinnerIcon />;
  } else if (category === "snack") {
    return <SnackIcon />;
  } else if (category === "strength") {
    return <StrengthIcon />;
  } else if (category === "technical") {
    return <TechnicalIcon />;
  } else if (category === "recovery") {
    return <RecoveryIcon />;
  } else if (category === "assessment") {
    return <AssessmentIcon />;
  }
}
