import DumbellIcon from "./DumbellIcon";
import FlowerIcon from "./FlowerIcon";
import ShoeIcon from "./ShoeIcon";
import TableTennisIcon from "./TableTennisIcon";

export default function DynamicActivityIcon({
  activityType,
}: {
  activityType: string;
}) {
  // Parent should handle the size

  switch (activityType) {
    case "technical":
      return <TableTennisIcon />;
    case "strength":
      return <DumbellIcon />;
    case "recovery":
      return <FlowerIcon />;

    case "table_tennis_ping_pong":
      return <TableTennisIcon />;
    case "weightlifting":
      return <DumbellIcon />;
    case "walking":
      return <ShoeIcon />;
    case "running":
      return <ShoeIcon />;

    default:
      return <TableTennisIcon />;
  }
}
