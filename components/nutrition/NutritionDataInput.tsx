// components/nutrition/NutritionDataInput.tsx
import CalorieIcon from "@/components/icons/nutrition/CaloriesIcon";
import FatIcon from "@/components/icons/nutrition/FatIcon";
import GrainIcon from "@/components/icons/nutrition/GrainIcon";
import ProteinIcon from "@/components/icons/nutrition/ProteinIcon";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, TextInput, View } from "react-native";

export type NutritionData = {
  carbs?: number;
  protein?: number;
  fat?: number;
  calories?: number;
};

type Props = {
  value: NutritionData;
  onChange: (next: NutritionData) => void;
};

export function MetricInput({
  placeholder,
  unit,
  value,
  onChange,
  LeadingIcon,
  color,
}: {
  placeholder?: string;
  unit: string;
  value?: number;
  onChange: (v?: number) => void;
  LeadingIcon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const { t } = useLocalization("components.nutrition.nutritionList");

  return (
    <View className="flex-row items-center flex-1 bg-white rounded-xl border border-[#E8E8E8] px-3 items-center justify-between">
      <View className="flex-row items-center">
        <View
          className="items-center justify-center"
          style={{ width: 28, height: 32 }}
        >
          <LeadingIcon />
        </View>
        <TextInput
          className="text-base effra-regular"
          keyboardType="numeric"
          placeholder={placeholder ? t(placeholder) : undefined} // ✅ Localized placeholder
          placeholderTextColor={color + "80"}
          style={{ color }}
          value={typeof value === "number" ? String(value) : ""}
          onChangeText={(t) => {
            const n = t.trim() === "" ? undefined : Number(t);
            onChange(Number.isFinite(n) ? n : undefined);
          }}
        />
      </View>

      <Text style={{ color }} className="effra-regular text-base">
        {unit}
      </Text>
    </View>
  );
}

export default function NutritionDataInput({ value, onChange }: Props) {
  const { t } = useLocalization("components.nutrition.nutritionList");
  const safe = value ?? {};

  return (
    <View className="flex-1 gap-4 overflow-hidden">
      <View className="flex-row gap-4">
        <MetricInput
          placeholder="carbs" // ✅ match translation key
          unit="g"
          value={safe.carbs}
          onChange={(v) => onChange({ ...safe, carbs: v })}
          LeadingIcon={GrainIcon}
          color="#E5A300"
        />
        <MetricInput
          placeholder="protein"
          unit="g"
          value={safe.protein}
          onChange={(v) => onChange({ ...safe, protein: v })}
          LeadingIcon={ProteinIcon}
          color="#009F78"
        />
      </View>

      <View className="flex-row gap-4">
        <MetricInput
          placeholder="fat"
          unit="g"
          value={safe.fat}
          onChange={(v) => onChange({ ...safe, fat: v })}
          LeadingIcon={FatIcon}
          color="#E56A00"
        />
        <MetricInput
          placeholder="calories"
          unit="Kcal"
          value={safe.calories}
          onChange={(v) => onChange({ ...safe, calories: v })}
          LeadingIcon={CalorieIcon}
          color="#E53935"
        />
      </View>
    </View>
  );
}
