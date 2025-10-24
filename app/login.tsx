import CustomButton, { ButtonColor } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useRouter } from "expo-router";
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
  const router = useRouter();
  const { t, switchLanguage, isRTL } = useLocalization("login");

  const handleLogin = async () => {
    try {
      setError("");
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Redirect to dashboard once logged in
  useEffect(() => {
    if (user) {
      router.replace("/plan/workout");
    }
  }, [user]);

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
        />

        {/* Password */}
        <TextInput
          className={`w-[90%] bg-white rounded-xl px-4 py-3 my-2 text-base ${isRTL ? "text-right" : "text-left"}`}
          placeholder={t("password")}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Error message */}
        {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}

        {/* Forgot password */}
        <TouchableOpacity>
          <Text className="text-white underline mt-1 mb-7">
            {t("forgotPassword")}
          </Text>
        </TouchableOpacity>

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
