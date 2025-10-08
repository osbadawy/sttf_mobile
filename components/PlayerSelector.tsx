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
  function PlayerSelectorPlaceholderIcon() {
    return <View className="w-[32px] h-[32px] rounded-full bg-[#D9D9D9]" />;
  }

  const playerNames = players
    .map((player) => {
      let icon = <PlayerSelectorPlaceholderIcon />;
      if (player.avatar_url) {
        icon = (
          <Image
            source={{ uri: player.avatar_url }}
            className="w-[32px] h-[32px] rounded-full"
          />
        );
      }

      return {
        value: player.firebase_id,
        name: player.display_name,
        icon: icon,
      };
    })
    .filter((player) => player.value !== ignorePlayerFirebaseId);

  const handlePlayerSelect = (item: any) => {
    // Find the full player object from the original players array
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
                  <PlayerSelectorPlaceholderIcon />
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
