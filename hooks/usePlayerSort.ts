import { makeComparator } from "@/utils/PlayerSort";
import { Order, SortBy } from "@/utils/PlayerTypes";
import { useCallback, useState } from "react";

export function usePlayerSort(defaultBy: SortBy = "Alphabetical", defaultOrder: Order = "Ascending") {
  const [sortBy, setSortBy] = useState<SortBy>(defaultBy);
  const [order, setOrder] = useState<Order>(defaultOrder);

  const comparator = useCallback(makeComparator(sortBy, order), [sortBy, order]);

  const reset = () => {
    setSortBy("Alphabetical");
    setOrder("Ascending");
  };

  return { sortBy, order, setSortBy, setOrder, comparator, reset };
}
