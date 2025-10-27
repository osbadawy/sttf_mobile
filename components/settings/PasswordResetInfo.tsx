import EmailIcon from "@/components/icons/settings/EmailIcon";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  /** The user email to display */
  email: string;
  /** Optional custom button label (defaults to "Return to Settings") */
  buttonLabel?: string;
  /** Optional custom action; defaults to returning to Settings */
  onPress?: () => void;
};

export default function PasswordResetInfo({
  email,
  buttonLabel = "Return to Settings",
  onPress,
}: Props) {
  const insets = useSafeAreaInsets();

  const handlePress = (): void => {
    if (onPress) {
      onPress();
      return;
    }
    // Default: go back to Settings
    router.replace("/settings");
  };

  return (
    <View className="flex-1 bg-[#F7F9F3]">
      {/* Centered icon and text */}
      <View className="flex-1 items-center justify-center px-6">
        <EmailIcon />
        <Text className="mt-6 text-2xl font-semibold text-black">
          Reset your Password
        </Text>
        <Text className="mt-3 text-center text-sm text-neutral-500">
          You will receive the reset instructions here:
        </Text>
        <Text className="mt-1 text-center text-base font-semibold text-black">
          {email}
        </Text>
      </View>

      {/* Bottom button */}
      <View style={{ paddingBottom: insets.bottom + 12 }} className="px-6 pb-3">
        <Pressable
          onPress={handlePress}
          className="w-full items-center justify-center rounded-2xl bg-[#008C46] py-4"
        >
          <Text className="text-base font-semibold text-white">
            {buttonLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
