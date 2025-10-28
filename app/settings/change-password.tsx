import ParallaxScrollView from "@/components/ParallaxScrollView";
import PasswordResetInfo from "@/components/settings/PasswordResetInfo";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { updatePassword } from "firebase/auth";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChangePassword() {
  const { t, isRTL } = useLocalization("components.Settings.settings");
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [pw1, setPw1] = useState<string>("");
  const [pw2, setPw2] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false); // ✅ toggle for success state

  const canSubmit = useMemo<boolean>(
    () => pw1.length >= 6 && pw2.length >= 6 && !loading,
    [pw1.length, pw2.length, loading],
  );

  const handleDone = async (): Promise<void> => {
    setError("");

    if (pw1 !== pw2) {
      setError("Passwords do not match.");
      return;
    }
    if (pw1.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!user) {
      setError("No authenticated user. Please sign in again.");
      return;
    }

    try {
      setLoading(true);
      await updatePassword(user, pw1);
      setLoading(false);
      setSuccess(true); // ✅ show PasswordResetInfo instead of alert
    } catch (e: unknown) {
      setLoading(false);
      const message =
        typeof e === "object" && e !== null && "message" in e
          ? String((e as { message: string }).message)
          : "Failed to update password.";

      if (message.includes("requires-recent-login")) {
        setError(
          "For security, please sign in again and then try updating your password.",
        );
      } else {
        setError(message);
      }
    }
  };

  // ✅ If password reset succeeded, render PasswordResetInfo instead
  if (success) {
    return (
      <ParallaxScrollView
        headerProps={{
          title: t("change password"),
          showBackButton: true,
          showDateSelector: false,
          showCalendarIcon: false,
          showBGImage: false,
        }}
        showNav={false}
      >
        <PasswordResetInfo
          email={user?.email ?? "your.email@covelant.com"}
          buttonLabel="Return to Settings"
        />
      </ParallaxScrollView>
    );
  }

  // Otherwise, render normal form
  return (
    <ParallaxScrollView
      headerProps={{
        showDateSelector: false,
        showCalendarIcon: false,
        title: "Change Password",
        showBGImage: false,
        showBackButton: true,
      }}
      showNav={false}
    >
      <View className="px-4 pt-6">
        {/* New Password */}
        <Text className="mb-2 text-xs text-neutral-700">{t("new password")}</Text>
        <View className="rounded-2xl bg-white shadow-sm">
          <TextInput
            value={pw1}
            onChangeText={setPw1}
            placeholder={t("enter new password")}
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            textContentType="newPassword"
            autoCapitalize="none"
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-black"
            returnKeyType="next"
          />
        </View>

        {/* Confirm Password */}
        <Text className="mt-4 mb-2 text-xs text-neutral-700">
          Confirm Password
        </Text>
        <View className="rounded-2xl bg-white shadow-sm">
          <TextInput
            value={pw2}
            onChangeText={setPw2}
            placeholder={t("Re-enter new password")}
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            textContentType="password"
            autoCapitalize="none"
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-black"
            returnKeyType="done"
            onSubmitEditing={() => (canSubmit ? handleDone() : undefined)}
          />
        </View>

        {/* Error message */}
        {error.length > 0 && (
          <Text className="mt-3 text-sm text-rose-600">{error}</Text>
        )}
      </View>

      {/* Bottom fixed Done button */}
      <View
        style={{ paddingBottom: insets.bottom + 12 }}
        className="mt-auto w-full px-6 pt-6"
      >
        <Pressable
          disabled={!canSubmit}
          onPress={handleDone}
          className={`w-full items-center justify-center rounded-2xl px-4 py-4 ${
            canSubmit ? "bg-[#008C46]" : "bg-[#008C46]/40"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-base font-semibold text-white">{t("done")}</Text>
          )}
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
}
