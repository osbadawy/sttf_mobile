import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
      router.replace("/whoop-login");
    }
  }, [user]);

  return (
    <ImageBackground
      source={require("../assets/images/logInImage.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Logo */}
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Error message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Forgot password */}
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>

        {/* Language Switch */}
        <View style={styles.langRow}>
          <TouchableOpacity style={styles.langButton}>
            <Image source={require("../assets/images/english.png")} style={styles.langIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.langButton}>
            <Image source={require("../assets/images/arabic.png")} style={styles.langIcon} />
          </TouchableOpacity>
        </View>

        {/* Invitation Text */}
        <Text style={styles.invite}>
          This service is accessible only under invitation
        </Text>

        {/* Login Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleLogin}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 40,
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  forgot: {
    color: "#fff",
    textDecorationLine: "underline",
    marginTop: 5,
    marginBottom: 30,
  },
  langRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    marginBottom: 20,
  },
  langButton: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
  },
  langIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  invite: {
    color: "#fff",
    marginBottom: 20,
    fontSize: 12,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#008000",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
