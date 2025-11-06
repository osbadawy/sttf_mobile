import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useMemo, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function InviteInput({
  onAdd,
  existingEmails,
}: {
  onAdd: (email: string) => void;
  existingEmails: Set<string>;
}) {
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
    const auth = getAuth();
    const fixedPassword = "sttf-20!";

    try {
      setSubmitting(true);
      await createUserWithEmailAndPassword(auth, targetEmail, fixedPassword);
      // success → add to UI list
      onAdd(targetEmail);
      setEmail("");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";

      if (code === "auth/email-already-in-use") {
        // user exists → still add to list
        onAdd(targetEmail);
        setEmail("");
      } else if (code === "auth/invalid-email") {
        Alert.alert("Invalid email", "Please enter a valid email address.");
      } else if (code === "auth/weak-password") {
        Alert.alert("Weak password", "The configured password is too weak.");
      } else {
        Alert.alert("Signup failed", "Could not create the user. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="mb-6 flex-row items-center rounded-xl bg-white px-2 py-2 shadow-sm">
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Player email address"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!submitting}
        className="flex-1 rounded-lg px-3 py-3 text-[15px]"
      />
      <TouchableOpacity
        disabled={!canAdd}
        onPress={handleAdd}
        className={`ml-2 flex-row items-center rounded-lg border px-3 py-2 ${
          canAdd ? "border-emerald-600 bg-white" : "border-neutral-300 bg-neutral-100"
        }`}
        activeOpacity={0.8}
      >
        <Text
          className={`mr-1 text-[14px] font-semibold ${
            canAdd ? "text-emerald-700" : "text-neutral-400"
          }`}
        >
          {submitting ? "Adding..." : "Add"}
        </Text>
        <Text className={canAdd ? "text-[16px] text-emerald-700" : "text-[16px] text-neutral-400"}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

