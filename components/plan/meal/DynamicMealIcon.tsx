import {
  BreakfastIcon,
  DinnerIcon,
  LunchIcon,
  SnackIcon,
} from "@/components/icons/nutrition";

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
