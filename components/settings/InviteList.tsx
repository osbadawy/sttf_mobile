import type Coach from "@/schemas/Coach";
import type Player from "@/schemas/Player";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function InviteList({
  users: users,
  onDeleteClick,
}: {
  users: Player[] | Coach[];
  onDeleteClick: (id: string) => void;
}) {
  const renderItem = ({ item }: { item: Player }) => {
    const showAvatar = !!item.access && !!item.avatar_url;

    return (
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center rounded-full bg-white px-3 py-2 shadow-sm">
          {/* left avatar/pending */}
          <View className="mr-2 h-8 w-8 overflow-hidden rounded-full bg-neutral-200 items-center justify-center">
            {showAvatar ? (
              <Image
                source={{ uri: item.avatar_url! }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Image
                source={require("@/assets/images/pending.png")}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            )}
          </View>

          {/* email only */}
          <Text className="flex-1 text-[15px] text-black" numberOfLines={1}>
            {item.email}
          </Text>

          {/* delete */}
          <TouchableOpacity
            className="ml-3 h-7 w-7 items-center justify-center rounded-full bg-white"
            onPress={() => onDeleteClick(item.firebase_id)}
            activeOpacity={0.7}
          >
            <Image
              source={require("@/assets/images/deleteUser.png")}
              style={{ width: 24, height: 24, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.firebase_id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
}
