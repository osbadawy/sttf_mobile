import BreakfastIcon from "@/components/icons/nutrition/BreakfastIcon";
import DinnerIcon from "@/components/icons/nutrition/DinnerIcon";
import LunchIcon from "@/components/icons/nutrition/LunchIcon";
import SnackIcon from "@/components/icons/nutrition/SnackIcon";

export default function DynamicMealIcon({
  mealType,
}: {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}) {
  if (mealType === "breakfast") {
    return <BreakfastIcon />;
  } else if (mealType === "lunch") {
    return <LunchIcon />;
  } else if (mealType === "dinner") {
    return <DinnerIcon />;
  } else if (mealType === "snack") {
    return <SnackIcon />;
  }
}
