import { useLocalization } from "@/contexts/LocalizationContext";
import { useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function InviteInput({
  onAdd,
  existingEmails,
}: {
  onAdd: (email: string) => void;
  existingEmails: Set<string>;
}) {
  const { t } = useLocalization("components.Settings.settings");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canAdd = useMemo(() => {
    const trimmed = email.trim().toLowerCase();
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
      !existingEmails.has(trimmed) &&
      !submitting
    );
  }, [email, existingEmails, submitting]);

  const handleAdd = async () => {
    if (!canAdd) return;

    const targetEmail = email.trim();

    try {
      setSubmitting(true);
      onAdd(targetEmail);
      setEmail("");
    } catch (err: unknown) {
      console.error("Error adding player:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="mb-6 flex-row items-center rounded-xl bg-white px-2 py-2 shadow-sm">
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={t("player email address")}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!submitting}
        className="flex-1 rounded-lg px-3 py-3 text-[15px]"
      />
      <TouchableOpacity
        disabled={!canAdd}
        onPress={handleAdd}
        className={`ml-2 flex-row items-center rounded-lg border px-3 py-2 ${
          canAdd
            ? "border-emerald-600 bg-white"
            : "border-neutral-300 bg-neutral-100"
        }`}
        activeOpacity={0.8}
      >
        <Text
          className={`mr-1 text-[14px] font-semibold ${
            canAdd ? "text-emerald-700" : "text-neutral-400"
          }`}
        >
          {submitting ? t("adding") : t("add")}
        </Text>
        <Text
          className={
            canAdd
              ? "text-[16px] text-emerald-700"
              : "text-[16px] text-neutral-400"
          }
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}
