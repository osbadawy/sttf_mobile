// components/nutrition/MealsList.tsx
import BreakfastIcon from "@/components/icons/nutrition/BreakfastIcon";
import DinnerIcon from "@/components/icons/nutrition/DinnerIcon";
import LunchIcon from "@/components/icons/nutrition/LunchIcon";
import SnackIcon from "@/components/icons/nutrition/SnackIcon";
import { useLocalization } from "@/contexts/LocalizationContext";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

type MealItem = {
  id: string;
  mealName: string;
  weightGrams: number;
  calories: number;
  type: MealType;
  dateISO: string; // e.g., "2025-02-09"
};

const ICON_BY_TYPE: Record<
  MealType,
  React.ComponentType<{ className?: string }>
> = {
  breakfast: BreakfastIcon,
  lunch: LunchIcon,
  dinner: DinnerIcon,
  snack: SnackIcon,
};

// ---- Helper: format date like "Tue, 02.09" ----
function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const wd = d.toLocaleDateString(undefined, { weekday: "short" }); // Tue
  const dd = d
    .toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" })
    .replace("/", ".");
  // Some locales use "/", normalize to 02.09
  const [m, day] = dd.includes(".") ? dd.split(".") : dd.split("/");
  // dd mm order can vary; ensure "DD.MM"
  const dt = Number(day ?? m) ? `${day}.${m}` : `${m}.${day}`;
  return `${wd}, ${dt}`;
}

export default function MealLog() {
    const { t, isRTL } = useLocalization("components.nutrition.nutritionList");
  // ---- Placeholder static data ----
  const data: MealItem[] = [
    {
      id: "1",
      mealName: "Meat Lasagna",
      weightGrams: 340,
      calories: 535,
      type: "dinner",
      dateISO: "2025-02-09",
    },
    {
      id: "2",
      mealName: "Eggs With Bacon",
      weightGrams: 158,
      calories: 482,
      type: "breakfast",
      dateISO: "2025-02-09",
    },
    {
      id: "3",
      mealName: "Oatmeal with Berries",
      weightGrams: 230,
      calories: 535,
      type: "breakfast",
      dateISO: "2025-02-08",
    },
    {
      id: "4",
      mealName: "Eggs With Bacon",
      weightGrams: 158,
      calories: 482,
      type: "breakfast",
      dateISO: "2025-02-08",
    },
    {
      id: "5",
      mealName: "Chicken Salad",
      weightGrams: 300,
      calories: 410,
      type: "lunch",
      dateISO: "2025-02-07",
    },
    {
      id: "6",
      mealName: "Greek Yogurt",
      weightGrams: 150,
      calories: 120,
      type: "snack",
      dateISO: "2025-02-07",
    },
    {
      id: "7",
      mealName: "Grilled Salmon",
      weightGrams: 220,
      calories: 520,
      type: "dinner",
      dateISO: "2025-02-06",
    },
  ];

  // Order newest date first
  const sorted = useMemo(
    () =>
      [...data].sort((a, b) =>
        a.dateISO < b.dateISO ? 1 : a.dateISO > b.dateISO ? -1 : 0,
      ),
    [],
  );

  const [visibleCount, setVisibleCount] = useState<number>(5);
  const visible = sorted.slice(0, visibleCount);

  // Group by date for headers
  const grouped = useMemo(() => {
    const map = new Map<string, MealItem[]>();
    for (const m of visible) {
      const key = m.dateISO;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    // return in the same order as visible
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, items]) => ({ dateISO: key, items }));
  }, [visible]);

  const canLoadMore = visibleCount < sorted.length;

  return (
    <View className="px-5">
      <Text className="text-xl font-semibold text-neutral-900 mb-3" style={{ textAlign: isRTL ? "right" : "left" }}>{t("meal log")}</Text>
      <View className="h-[1px] bg-neutral-200 mb-2" />

      {grouped.map((section) => (
        <View key={section.dateISO} className="mb-3">
          <Text className="text-xs text-neutral-500 mb-3">
            {formatDateLabel(section.dateISO)}
          </Text>

          {section.items.map((m) => {
            const Icon = ICON_BY_TYPE[m.type];
            return (
              <View key={m.id} className="flex-row items-center mb-4">
                {/* Icon circle */}
                <View className="w-12 h-12 rounded-full bg-neutral-100 items-center justify-center mr-3">
                  <Icon />
                </View>

                {/* Title + weight */}
                <View className="flex-1">
                  <Text className="text-[15px] text-neutral-900 font-medium">
                    {m.mealName}
                  </Text>
                  <Text className="text-[13px] text-neutral-500">
                    {m.weightGrams}g
                  </Text>
                </View>

                {/* Calories */}
                <View className="flex-row items-baseline">
                  <Text className="text-2xl font-bold text-neutral-900">
                    {m.calories}
                  </Text>
                  <Text className="ml-1 text-[13px] text-neutral-700">
                    Kcal
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}

      {/* Load More */}
      {canLoadMore && (
        <View className="mt-2 mb-6">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              setVisibleCount((c) => Math.min(c + 5, sorted.length))
            }
            className="h-12 rounded-xl border border-emerald-600 items-center justify-center"
          >
            <Text className="text-emerald-700 font-medium">Load More</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
