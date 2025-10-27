import FatIcon from "@/components/icons/nutrition/FatIcon";
import GrainIcon from "@/components/icons/nutrition/GrainIcon";
import ProteinIcon from "@/components/icons/nutrition/ProteinIcon";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, View } from "react-native";

type Props = {
  totalCarbs?: number;
  totalProteins?: number;
  totalFats?: number;
  carbs?: number; // goal
  protein?: number; // goal
  fats?: number; // goal
};

function MacroCard({
  Icon,
  label,
  total = 0,
  goal = 0,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  total?: number;
  goal?: number;
}) {
  return (
    <View
      className="flex-1 bg-white rounded-2xl px-4 py-4 mx-1 items-center justify-between"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
        minHeight: 130,
      }}
    >
      {/* Icon */}
      <View className="h-6 justify-center items-center mb-2">
        <Icon />
      </View>

      {/* Label */}
      <Text className="text-[14px] text-neutral-700 mb-1 text-center">
        {label}
      </Text>

      {/* Total */}
      <Text className="text-3xl font-bold text-neutral-900 leading-tight text-center">
        {goal}
      </Text>

      {/* Goal */}
      <Text className="text-[12px] text-neutral-400 mt-1 text-center">
        / {total} g
      </Text>
    </View>
  );
}

export default function MacroSummaryCards({
  totalCarbs = 115,
  totalProteins = 60,
  totalFats = 24,
  carbs = 280,
  protein = 150,
  fats = 132,
}: Props) {
  const { t } = useLocalization("components.nutrition.nutritionList");

  return (
    <View className="flex-row justify-between px-2">
      <MacroCard
        Icon={GrainIcon}
        label={t("carbs")} // 🟢 Localized label
        total={totalCarbs}
        goal={carbs}
      />
      <MacroCard
        Icon={ProteinIcon}
        label={t("protein")} // 🟢 Localized label
        total={totalProteins}
        goal={protein}
      />
      <MacroCard
        Icon={FatIcon}
        label={t("fat")} // 🟢 Localized label
        total={totalFats}
        goal={fats}
      />
    </View>
  );
}
