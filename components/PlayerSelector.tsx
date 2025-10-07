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

  console.log(selectedPlayer);

  return (
    <View className="pb-10" style={{ marginHorizontal: 57 }}>
      <Dropdown
        items={playerNames}
        selectedItem={selectedPlayer}
        setSelectedItem={onSelectPlayer}
        placeholder="Select Player"
        placeholderIcon={<PlayerSelectorPlaceholderIcon />}
      />
    </View>
  );
}
