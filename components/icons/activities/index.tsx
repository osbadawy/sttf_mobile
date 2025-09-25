import DumbellIcon from "./DumbellIcon";
import FlowerIcon from "./FlowerIcon";
import TableTennisIcon from "./TableTennisIcon";

export default function DynamicActivityIcon({
  activityType,
}: {
  activityType: string;
}) {
  switch (activityType) {
    case "technical":
      return <TableTennisIcon />;
    case "strength":
      return <DumbellIcon />;
    case "recovery":
      return <FlowerIcon />;

    case "table_tennis":
      return <TableTennisIcon />;
    case "weightlifting":
      return <DumbellIcon />;

    default:
      return <TableTennisIcon />;
  }
}
