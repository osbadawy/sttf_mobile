import { useLocalization } from "@/contexts/LocalizationContext";
import { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSend: (email: string) => Promise<void>;
}

export default function ForgotPasswordModal({
  visible,
  onClose,
  onSend,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false); // ✅ success state
  const { t, isRTL } = useLocalization("login");

  const handleSendPress = async () => {
    if (!email.trim()) return;
    try {
      setSubmitting(true);
      await onSend(email.trim());
      setSent(true); // ✅ show confirmation message
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSent(false); // reset for next time
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Dimmed backdrop */}
      <Pressable className="flex-1 bg-black/40" onPress={handleClose} />

      {/* Modal content */}
      <View
        className="
          absolute bottom-0 left-0 right-0
          rounded-t-3xl bg-white px-6 pt-6 pb-8
          shadow-xl
        "
      >
        {!sent ? (
          <>
            {/* Title */}
            <Text className="text-lg font-semibold text-center mb-4">
              {t("forgotPassword")}
            </Text>

            {/* Instructions */}
            <Text className="text-sm text-neutral-600 mb-3">
              {t("instructions")}
            </Text>

            {/* Email Input */}
            <TextInput
              placeholder={t("email")}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              className="border border-neutral-300 rounded-xl px-4 py-3 mb-5 text-base"
            />

            {/* Send Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSendPress}
              disabled={submitting}
              className={`rounded-xl py-3 ${
                submitting ? "bg-emerald-400" : "bg-emerald-600"
              }`}
            >
              <Text className="text-center text-white font-medium">
                {submitting ? t("sending") : t("send")}
              </Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleClose}
              className="mt-3 py-2"
            >
              <Text className="text-center text-neutral-500">
                {t("cancel")}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          // ✅ Success Message
          <View className="items-center justify-center py-8">
            <Text className="text-lg font-semibold text-center mb-3 text-emerald-700">
              {t("emailSentTitle")}
            </Text>
            <Text className="text-sm text-neutral-600 text-center mb-8 px-2">
              {t("emailSentMessage") ||
                "An email has been sent to you. Please check your inbox, sometimes you may have to look in your spam folder"}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleClose}
              className="bg-emerald-600 rounded-xl py-3 w-full"
            >
              <Text className="text-center text-white font-medium">
                {t("close")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}
