import { ReactNode } from "react";
import { DimensionValue, TouchableOpacity, View } from "react-native";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  contentColor?: string;
  outterColor?: string;
  maxHeight?: DimensionValue;
}

export default function Modal({
  children,
  onClose,
  maxHeight = "70%",
  contentColor = "white",
  outterColor = "transparent",
}: ModalProps) {
  return (
    <View
      className="bg-transparent w-screen h-screen absolute bottom-0"
      style={{ backgroundColor: outterColor }}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={onClose}
        activeOpacity={1}
      />
      <View
        className="absolute bottom-0 w-screen px-12 pt-2 pb-12"
        style={{
          maxHeight,
          backgroundColor: contentColor,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        {children}
      </View>
    </View>
  );
}
