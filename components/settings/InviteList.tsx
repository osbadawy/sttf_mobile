import type { PlayerInvite } from "@/app/settings/manage-players";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function InviteList({
  invites,
  onDelete,
}: {
  invites: PlayerInvite[];
  onDelete: (id: string) => void;
}) {
  const renderItem = ({ item }: { item: PlayerInvite }) => {
    const showAvatar = item.acceptedInvite && !!item.avatarUrl;

    return (
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center rounded-full bg-white px-3 py-2 shadow-sm">
          {/* left avatar/pending */}
          <View className="mr-2 h-8 w-8 overflow-hidden rounded-full bg-neutral-200 items-center justify-center">
            {showAvatar ? (
              <Image source={{ uri: item.avatarUrl! }} style={{ width: "100%", height: "100%" }} />
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
            onPress={() => onDelete(item.id)}
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
      data={invites}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
}
