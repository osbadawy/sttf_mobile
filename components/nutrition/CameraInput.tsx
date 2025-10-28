import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface CameraInputProps {
  /** Called when user captures a photo; passes the photo URI. */
  onImageCapture?: (photoUri: string) => void;
  /** Size of the circular button (default: 48) */
  size?: number;
  /** Icon size (default: 20) */
  iconSize?: number;
}

export default function CameraInput({
  onImageCapture,
  size = 48,
  iconSize = 20,
}: CameraInputProps) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  async function openCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      console.warn("Camera permission not granted");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      onImageCapture?.(uri);
    }
  }

  return (
    <TouchableOpacity onPress={openCamera}>
      <View className="rounded-full p-1">
        <View
          className="rounded-full items-center justify-center bg-white overflow-hidden"
          style={{
            width: size,
            height: size,
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: "#D1D5DB",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 16,
            shadowOffset: { width: 2, height: 2 },
            elevation: 2,
          }}
        >
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="camera-outline" size={iconSize} color="#546E7A" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
