import Button, { ButtonColor } from "@/components/Button";
import { WhoopIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useEffect, useState } from "react";
import { ImageBackground, Text, View } from "react-native";
import { WebView } from "react-native-webview";

export default function WhoopLoginPage() {
  const { user } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const { t } = useLocalization("login");

  useEffect(() => {
    const getAccessToken = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAccessToken(token);
          // console.log("Firebase Access Token:", token);
        } catch (error) {
          console.error("Error getting access token:", error);
        }
      }
    };

    getAccessToken();
  }, [user]);


  const onPress = async () => {
    try {
      console.log("Making POST request with access token in header and platform in body");
      console.log("Access token:", accessToken ? `${accessToken.substring(0, 20)}...` : "No token");
      
      const response = await fetch("https://nonextendible-kenzie-unfatalistic.ngrok-free.dev/whoop/auth/start", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ platform: "mobile" }),
        redirect: 'manual' // Don't follow redirects automatically
      });

      console.log("POST Response status:", response.status);
      console.log("POST Response headers:", response.headers);

      if (response.status === 302 || response.status === 301) {
        // Server is redirecting - get the redirect URL
        const redirectUrl = response.headers.get('location');
        console.log("Server redirect URL:", redirectUrl);
        
        if (redirectUrl) {
          // Open the redirect URL in WebView
          setWebViewUrl(redirectUrl);
          setShowWebView(true);
          return;
        }
      } else if (response.status === 200) {
        // Server returned 200 - check what type of response
        const contentType = response.headers.get('content-type');
        console.log("Response content-type:", contentType);
        
        if (contentType && contentType.includes('application/json')) {
          // JSON response - should contain the redirect URL
          const data = await response.json();
          console.log("JSON response:", data);
          
          // Look for a URL in the response
          if (data.redirectUrl || data.url || data.authUrl) {
            const redirectUrl = data.redirectUrl || data.url || data.authUrl;
            console.log("Found redirect URL in JSON response:", redirectUrl);
            setWebViewUrl(redirectUrl);
            setShowWebView(true);
            return;
          } else {
            console.error("No redirect URL found in JSON response:", data);
          }
        } else {
          // HTML response - this might be a redirect page or the OAuth page
          console.log("Server returned HTML response");
          const htmlData = await response.text();
          console.log("HTML response preview:", htmlData.substring(0, 200) + "...");
          
          // Look for redirect URLs in the HTML (common patterns)
          const redirectPatterns = [
            /window\.location\.href\s*=\s*['"]([^'"]+)['"]/i,
            /<meta[^>]*http-equiv=['"]refresh['"][^>]*content=['"][^;]*url=([^'"]+)['"]/i,
            /<a[^>]*href=['"]([^'"]*whoop[^'"]*)['"][^>]*>/i,
            /<script[^>]*>.*?window\.location\s*=\s*['"]([^'"]+)['"]/is
          ];
          
          let redirectUrl = null;
          for (const pattern of redirectPatterns) {
            const match = htmlData.match(pattern);
            if (match && match[1]) {
              redirectUrl = match[1];
              break;
            }
          }
          
          if (redirectUrl) {
            console.log("Found redirect URL in HTML:", redirectUrl);
            setWebViewUrl(redirectUrl);
            setShowWebView(true);
          } else {
            console.log("No redirect URL found in HTML");
            console.log("Server redirect failed, constructing WHOOP URL directly");
            
            // Since the server redirect isn't working, construct the WHOOP URL directly
            // This matches the pattern from your NestJS guard
            const whoopClientId = "your-whoop-client-id"; // You'll need to get this from your server
            const scope = [
              'read:profile',
              'read:body_measurement', 
              'read:cycles',
              'read:workout',
              'read:sleep',
              'read:recovery',
              'offline',
            ].join(' ');
            
            // Generate a random state (you might want to get this from your server)
            const state = Math.random().toString(36).substring(2, 15);
            
            const whoopAuthUrl = `https://api.prod.whoop.com/oauth/oauth2/auth?response_type=code&client_id=${whoopClientId}&scope=${encodeURIComponent(scope)}&state=${state}`;
            
            console.log("Constructed WHOOP auth URL:", whoopAuthUrl);
            setWebViewUrl(whoopAuthUrl);
            setShowWebView(true);
          }
        }
      } else {
        console.error("POST request failed with status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("POST request failed:", error);
    }
  }

  if (showWebView && webViewUrl) {
    return (
      <View className="flex-1">
        <WebView
          source={{ uri: webViewUrl }}
          onNavigationStateChange={(navState) => {
            console.log("WebView navigation:", navState.url);
            // You can check for specific URLs here to detect when OAuth is complete
            if (navState.url.includes('success') || navState.url.includes('callback')) {
              console.log("OAuth flow completed:", navState.url);
              // Handle successful OAuth here
              setShowWebView(false);
            }
          }}
          onError={(error) => {
            console.error("WebView error:", error);
          }}
          style={{ flex: 1 }}
        />
      </View>
    );
  }

  return (
    <ImageBackground
    source={require("@/assets/images/logInImage.png")}
    className="flex-1 resize-cover"
    >
      <View className="flex h-full items-center justify-between py-16">
        <Text className="text-white text-3xl effra-semibold">{t("whoopTitle")}</Text>
        <View className="w-full items-center justify-center" style={{ gap: 32 }}>
          <WhoopIcon />
          <Button title={t("Connect")} onPress={onPress} color={ButtonColor.primary} />
        </View>
        <View/>
      </View>
    </ImageBackground>
  );
}