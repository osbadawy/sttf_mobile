import colors from "@/colors.js";
import CustomButton, { ButtonColor, ButtonSize } from "@/components/Button";
import Modal from "@/components/Modal";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Text, TouchableOpacity, View } from "react-native";

interface PlayerDeletionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PlayerDeletionModal({
  visible,
  onClose,
  onConfirm,
}: PlayerDeletionModalProps) {
  const { t } = useLocalization("components.Settings.settings");

  if (!visible) return null;

  return (
    <Modal
      onClose={onClose}
      contentColor="rgb(245, 245, 244)"
      outterColor="rgba(0, 0, 0, 0.2)"
      maxHeight="35%"
    >
      <View className="items-center justify-center py-6">
        {/* Close button */}
        <TouchableOpacity
          className="absolute right-0 top-0 p-2"
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text className="text-2xl text-neutral-800">×</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-center text-xl font-medium px-8">
          {t("remove player confirmation")}
        </Text>

        {/* Warning text */}
        <Text
          className="mt-6 text-center text-xs"
          style={{ color: colors.red }}
        >
          {t("action irreversible")}
        </Text>

        {/* Buttons */}
        <View className="mt-8 w-full flex-row gap-4 justify-center">
          <CustomButton
            title={t("back")}
            onPress={onClose}
            color={ButtonColor.disabled}
            size={ButtonSize.sm}
          />

          <CustomButton
            title={t("remove")}
            onPress={onConfirm}
            color={ButtonColor.red}
            size={ButtonSize.sm}
          />
        </View>
      </View>
    </Modal>
  );
}
