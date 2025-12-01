import Dropdown from "@/components/Dropdown";
import { Image, View } from "react-native";

interface PlayerSelectorProps {
  players: any[];
  selectedPlayer?: any;
  onSelectPlayer: (player: any) => void;
  ignorePlayerFirebaseId?: string;
}

export default function PlayerSelector({
  players,
  selectedPlayer,
  onSelectPlayer,
  ignorePlayerFirebaseId,
}: PlayerSelectorProps) {
  const defaultAvatar = require("../assets/images/logo.png"); // << fallback image

  function PlayerSelectorPlaceholderIcon() {
    return (
      <Image
        source={defaultAvatar}
        className="w-[32px] h-[32px] rounded-full "
      />
    );
  }

  const playerNames = players
    .map((player) => {
      const icon = player.avatar_url ? (
        <Image
          source={{ uri: player.avatar_url }}
          className="w-[32px] h-[32px] rounded-full"
        />
      ) : (
        <Image
          source={defaultAvatar}
          className="w-[32px] h-[32px] rounded-full"
        />
      );

      return {
        value: player.firebase_id,
        name: player.display_name,
        icon,
      };
    })
    .filter((player) => player.value !== ignorePlayerFirebaseId);

  const handlePlayerSelect = (item: any) => {
    const fullPlayer = players.find(
      (player) => player.firebase_id === item.value,
    );
    onSelectPlayer(fullPlayer);
  };

  return (
    <View className="pb-10" style={{ marginHorizontal: 57 }}>
      <Dropdown
        items={playerNames}
        selectedItem={
          selectedPlayer
            ? {
                value: selectedPlayer.firebase_id,
                name: selectedPlayer.display_name,
                icon: selectedPlayer.avatar_url ? (
                  <Image
                    source={{ uri: selectedPlayer.avatar_url }}
                    className="w-[32px] h-[32px] rounded-full"
                  />
                ) : (
                  <Image
                    source={defaultAvatar}
                    className="w-[32px] h-[32px] rounded-full"
                  />
                ),
              }
            : undefined
        }
        setSelectedItem={handlePlayerSelect}
        placeholder="Select Player"
        placeholderIcon={<PlayerSelectorPlaceholderIcon />}
      />
    </View>
  );
}
