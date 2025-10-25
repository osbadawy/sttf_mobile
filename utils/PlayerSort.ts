import { Player } from "@/components/coach/PlayerCard";
import { Order, SortBy } from "@/utils/PlayerTypes";

export const sortPlayers = (list: Player[], sortBy: SortBy, order: Order): Player[] => {
  const dir = order === "Ascending" ? 1 : -1;
  return [...list].sort((a, b) => {
    if (sortBy === "Alphabetical") {
      const an = `${a.firstName} ${a.lastName}`.trim().toLowerCase();
      const bn = `${b.firstName} ${b.lastName}`.trim().toLowerCase();
      return an.localeCompare(bn) * dir;
    }
    if (sortBy === "Age") return ((a.age ?? 0) - (b.age ?? 0)) * dir;
    return ((a.readiness ?? 0) - (b.readiness ?? 0)) * dir;
  });
};

export const makeComparator = (sortBy: SortBy, order: Order) => {
  const dir = order === "Ascending" ? 1 : -1;
  return (a: Player, b: Player) => {
    if (sortBy === "Alphabetical") {
      const an = `${a.firstName} ${a.lastName}`.trim().toLowerCase();
      const bn = `${b.firstName} ${b.lastName}`.trim().toLowerCase();
      return an.localeCompare(bn) * dir;
    }
    if (sortBy === "Age") return ((a.age ?? 0) - (b.age ?? 0)) * dir;
    return ((a.readiness ?? 0) - (b.readiness ?? 0)) * dir;
  };
};
