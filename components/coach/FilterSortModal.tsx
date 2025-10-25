import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

type SortBy = "Alphabetical" | "Age" | "Readiness";
type Order = "Ascending" | "Descending";

export interface FilterSortModalProps {
  visible: boolean;
  onClose: () => void;
  initialSortBy?: SortBy;
  initialOrder?: Order;
  onApply: (sortBy: SortBy, order: Order) => void;
  onReset?: () => void;
}

const OPTIONS_SORT: SortBy[] = ["Alphabetical", "Age", "Readiness"];
const OPTIONS_ORDER: Order[] = ["Ascending", "Descending"];

export default function FilterSortModal({
  visible,
  onClose,
  initialSortBy = "Alphabetical",
  initialOrder = "Ascending",
  onApply,
  onReset,
}: FilterSortModalProps) {
  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy);
  const [order, setOrder] = useState<Order>(initialOrder);

  // keep local state in sync if parent reopens with different defaults
  useMemo(() => {
    if (!visible) return;
    setSortBy(initialSortBy);
    setOrder(initialOrder);
  }, [visible, initialOrder, initialSortBy]);

  const Select = ({
    label,
    value,
    options,
    onSelect,
  }: {
    label: string;
    value: string;
    options: string[];
    onSelect: (v: any) => void;
  }) => {
    const [open, setOpen] = useState(false);
    return (
      <View className="mb-4">
        <Text className="mb-2 font-semibold text-neutral-700">{label}</Text>
        <Pressable
          onPress={() => setOpen((v) => !v)}
          className="flex-row items-center justify-between rounded-2xl border border-neutral-300 bg-white px-4 py-3"
        >
          <Text className="text-base">{value}</Text>
          <Text className="text-neutral-400">▾</Text>
        </Pressable>

        {open && (
          <View className="mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <ScrollView style={{ maxHeight: 180 }}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  className="px-4 py-3 active:opacity-70"
                  onPress={() => {
                    onSelect(opt);
                    setOpen(false);
                  }}
                >
                  <Text className="text-base">{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      {/* backdrop */}
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      {/* bottom sheet */}
      <View className="bg-white px-4 pb-6 pt-4 rounded-t-3xl" style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold">Sort</Text>
          <TouchableOpacity
            onPress={() => {
              setSortBy("Alphabetical");
              setOrder("Ascending");
              onReset?.();
            }}
          >
            <Text className="text-neutral-500 underline">Reset</Text>
          </TouchableOpacity>
        </View>

        <Select
          label="Sort by"
          value={sortBy}
          options={OPTIONS_SORT}
          onSelect={(v: SortBy) => setSortBy(v)}
        />
        <Select
          label="Order"
          value={order}
          options={OPTIONS_ORDER}
          onSelect={(v: Order) => setOrder(v)}
        />

        <View className="mt-2 flex-row gap-3">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 items-center justify-center rounded-2xl border border-neutral-300 bg-white px-4 py-3"
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onApply(sortBy, order);
              onClose();
            }}
            className="flex-1 items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3"
          >
            <Text className="font-semibold text-white">Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
