import {
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import Divider from "./Divider";
import type { Option } from "./types";

type Props = {
  title: string;
  visible: boolean;
  onClose: () => void;
  options: Option[];
  onSelect: (opt: Option) => void;
  isRTL: boolean;
};

export default function SelectModal({
  title,
  visible,
  onClose,
  options,
  onSelect,
  isRTL,
}: Props) {
  const renderItem: ListRenderItem<Option> = ({ item }) => (
    <Pressable className="px-4 py-4" onPress={() => onSelect(item)}>
      <Text className="text-black">{item.label}</Text>
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1" onPress={onClose}>
        <View className="mt-auto rounded-t-2xl bg-white pb-6">
          <View className="px-4 pt-4">
            <Text className="text-base font-semibold text-black">{title}</Text>
          </View>
          <FlatList
            data={options}
            keyExtractor={(o) => o.value}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        </View>
      </Pressable>
    </Modal>
  );
}
