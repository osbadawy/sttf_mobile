import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, TouchableOpacity } from "react-native";
export default function ManageDoneButton({
  setManaging,
}: {
  setManaging: (managing: boolean) => void;
}) {
  const { t } = useLocalization("components.nutrition.nutritionList");
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setManaging(false)}
      style={{
        backgroundColor: "#008C46",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      }}
    >
      <Text
        style={{
          fontWeight: "600",
          color: "#FFFFFF",
          fontSize: 16,
        }}
      >
        {t("done")}
      </Text>
    </TouchableOpacity>
  );
}
