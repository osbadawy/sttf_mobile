import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import CustomButton, { ButtonColor } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useRouter } from "expo-router";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { t, switchLanguage, isRTL } = useLocalization("login");
  const auth = getAuth();

  const handleLogin = async () => {
    try {
      setError("");
      await login(email, password);
    } catch (err: any) {
      const code = (err as { code?: string }).code ?? "";
      let message = "Something went wrong. Please try again.";
      if (code === "auth/invalid-email") {
        message = "Invalid email or password address.";
        setError(message);
      } else if (code === "auth/user-not-found") {
        message = "No user found with this email.";
        setError(message);
      } else if (code === "auth/too-many-requests") {
        message = "Too many attempts. Try again later.";
        setError(message);
      }
      throw err;
    }
  };

  // Redirect to dashboard once logged in
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  const handleSend = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: unknown) {
      // Handle common Firebase errors
      const code = (err as { code?: string }).code ?? "";
      let message = "Something went wrong. Please try again.";
      if (code === "auth/invalid-email")
        message = "Invalid email or password address.";
      else if (code === "auth/user-not-found")
        message = "No user found with this email.";
      else if (code === "auth/too-many-requests")
        message = "Too many attempts. Try again later.";

      throw err;
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/logInImage.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 items-center justify-center px-5">
        {/* Logo */}
        <Image
          source={require("../assets/images/logo.png")}
          className="w-24 h-24 mb-10"
          resizeMode="contain"
        />

        {/* Email */}
        <TextInput
          className={`w-[90%] bg-white rounded-xl px-4 py-3 my-2 text-base ${isRTL ? "text-right" : "text-left"}`}
          placeholder={t("email")}
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          textContentType="emailAddress"
        />

        {/* Password */}
        <TextInput
          className={`w-[90%] bg-white rounded-xl text-black px-4 py-3 my-2 text-base ${isRTL ? "text-right" : "text-left"}`}
          placeholder={t("password")}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />

        {/* Error message */}
        {error ? <Text className="mb-2 text-red">{error}</Text> : null}

        {/* Forgot password */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text className="text-white underline mt-1 mb-7">
            {t("forgotPassword")}
          </Text>
        </TouchableOpacity>

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSend={handleSend}
        />

        {/* Language Switch */}
        <View className="flex-row justify-between w-1/2 mb-5">
          <TouchableOpacity
            className="p-2 bg-black/30 rounded-lg"
            onPress={() => switchLanguage("en")}
            activeOpacity={1}
          >
            <Image
              source={require("@/assets/images/english.png")}
              className="w-10 h-10"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2 bg-black/30 rounded-lg"
            onPress={() => switchLanguage("ar")}
            activeOpacity={1}
          >
            <Image
              source={require("@/assets/images/arabic.png")}
              className="w-10 h-10"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Invitation Text */}
        <Text className="text-white mb-5 text-xs text-center">
          {t("notice")}
        </Text>

        {/* Login Button */}
        <CustomButton
          title={t("Connect")}
          onPress={handleLogin}
          color={ButtonColor.primary}
        />
      </View>
    </ImageBackground>
  );
}
