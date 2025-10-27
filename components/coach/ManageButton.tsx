import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, TouchableOpacity } from "react-native";
export default function ManageButton({
  setManaging,
}: {
  setManaging: (managing: boolean) => void;
}) {
  const { t } = useLocalization("components.coach.coachDashboard");
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setManaging(true)}
      style={{
        backgroundColor: "#FFFFFF",
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
          color: "#008C46", // vivid green
          fontSize: 16,
        }}
      >
        {t("manage")}
      </Text>
    </TouchableOpacity>
  );
}
