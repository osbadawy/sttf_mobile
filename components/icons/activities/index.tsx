import { Custom } from "./Custom";

// Technical activities
import { Footwork } from "./Footwork";
import { PatternPlay } from "./PatternPlay";
import { Recieve } from "./Recieve";
import { Serve } from "./Serve";
import { StrokeTechnique } from "./StrokeTechnique";
import { Technical } from "./Technical";
import { WarmUp } from "./WarmUp";

// Strength activities
import { Badminton } from "./Badminton";
import { Basketball } from "./Basketball";
import { Cycling } from "./Cycling";
import { Elliptical } from "./Elliptical";
import { FunctionalFitness } from "./FunctionalFitness";
import { Hiit } from "./Hiit";
import { Hiking } from "./Hiking";
import { JumpingRope } from "./JumpingRope";
import { Padel } from "./Padel";
import { Pickleball } from "./Pickleball";
import { Pilates } from "./Pilates";
import { Rowing } from "./Rowing";
import { Running } from "./Running";
import { Soccer } from "./Soccer";
import { Squash } from "./Squash";
import { Strength } from "./Strength";
import { Swimming } from "./Swimming";
import { Tennis } from "./Tennis";
import { Volleyball } from "./Volleyball";
import { Weightlifting } from "./Weightlifting";

// Recovery activities
import { Recovery } from "./Recovery";
import { Yoga } from "./Yoga";

// Additional imports for legacy compatibility
import { TableTennis } from "./TableTennis";

export default function DynamicActivityIcon({
  activityType,
}: {
  activityType: string;
}) {
  // Parent should handle the size

  switch (activityType) {
    // Category icons
    case "technical":
      return <Technical />;
    case "strength":
      return <Strength />;
    case "recovery":
      return <Recovery />;

    // Technical activities
    case "warm-up":
      return <WarmUp />;
    case "serve":
      return <Serve />;
    case "recieve":
      return <Recieve />;
    case "stroke-technique":
      return <StrokeTechnique />;
    case "footwork":
      return <Footwork />;
    case "pattern-play":
      return <PatternPlay />;

    // Strength activities
    case "badminton":
      return <Badminton />;
    case "basketball":
      return <Basketball />;
    case "cycling":
      return <Cycling />;
    case "elliptical":
      return <Elliptical />;
    case "functional-fitness":
      return <FunctionalFitness />;
    case "hiking":
      return <Hiking />;
    case "hiit":
      return <Hiit />;
    case "jumping-rope":
      return <JumpingRope />;
    case "padel":
      return <Padel />;
    case "pickleball":
      return <Pickleball />;
    case "pilates":
      return <Pilates />;
    case "rowing":
      return <Rowing />;
    case "running":
      return <Running />;
    case "soccer":
      return <Soccer />;
    case "squash":
      return <Squash />;
    case "swimming":
      return <Swimming />;
    case "tennis":
      return <Tennis />;
    case "volleyball":
      return <Volleyball />;
    case "weightlifting":
      return <Weightlifting />;

    // Recovery activities
    case "yoga":
      return <Yoga />;

    // Additional mappings
    case "table_tennis_ping_pong":
      return <TableTennis />;
    case "walking":
      return <Running />;

    default:
      return <Custom />;
  }
}
