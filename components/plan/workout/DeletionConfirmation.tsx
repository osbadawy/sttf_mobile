import CustomButton, { ButtonColor, ButtonSize } from "@/components/Button";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, TouchableOpacity, View } from "react-native";

interface DeletionConfirmationProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletionConfirmation({
  isVisible,
  onClose,
  onConfirm,
}: DeletionConfirmationProps) {
  const { t } = useLocalization("components.plan.workout");

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 items-center justify-center z-50">
      <View className="bg-white rounded-2xl mx-6 p-6 w-full max-w-sm w-[250px]">
        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-4 right-4 z-10"
        >
          <Text className="text-2xl font-bold">×</Text>
        </TouchableOpacity>

        {/* Question */}
        <View className="items-center mb-8 mt-4">
          <Text className="text-lg font-inter-semibold text-center">
            {t("deleteMessage")}
          </Text>
        </View>

        {/* Action buttons */}
        <View className="flex-row justify-between" style={{ gap: 12 }}>
          <CustomButton
            title={t("back")}
            onPress={onClose}
            color={ButtonColor.white}
            size={ButtonSize.sm}
          />
          <CustomButton
            title={t("delete")}
            onPress={onConfirm}
            color={ButtonColor.red}
            size={ButtonSize.sm}
          />
        </View>
      </View>
    </View>
  );
}
