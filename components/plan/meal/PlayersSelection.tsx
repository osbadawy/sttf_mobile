import { Arrow } from "@/components/icons";
import ProfilePictureDefaultIcon from "@/components/icons/ProfilePictureDefault";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Player {
  firebase_id: string;
  display_name: string;
  avatar_url: string;
}

interface PlayersSelectionProps {
  allPlayers: Player[] | undefined;
  selectedPlayers: string[];
  onSelectPlayers: (players: string[]) => void;
  onClickBack: () => void;
}

export default function PlayersSelection({
  allPlayers,
  selectedPlayers,
  onSelectPlayers,
  onClickBack,
}: PlayersSelectionProps) {
  const { t } = useLocalization("components.plan.meal");

  const handleAddPlayer = (firebaseId: string) => {
    const newSelectedPlayers = [...selectedPlayers, firebaseId];
    onSelectPlayers(newSelectedPlayers);
  };

  const handleRemovePlayer = (firebaseId: string) => {
    const newSelectedPlayers = selectedPlayers.filter(
      (id) => id !== firebaseId,
    );
    onSelectPlayers(newSelectedPlayers);
  };

  const selectedPlayersData =
    allPlayers?.filter((player) =>
      selectedPlayers.includes(player.firebase_id),
    ) || [];
  const notSelectedPlayersData =
    allPlayers?.filter(
      (player) => !selectedPlayers.includes(player.firebase_id),
    ) || [];

  const renderPlayerItem = (player: Player, isSelected: boolean) => (
    <View
      key={player.firebase_id}
      className="flex-row items-center justify-start rounded-full p-2 mb-2 border border-[#D9D9D9] rounded-full self-start"
      style={{ boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.16)" }}
    >
      <View className="w-10 h-10 rounded-full items-center justify-center">
        {player.avatar_url ? (
          <Image
            source={{ uri: player.avatar_url }}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <ProfilePictureDefaultIcon fill="#666" />
        )}
      </View>
      <Text className="font-inter-regular text-base pr-4">
        {player.display_name}
      </Text>
      <TouchableOpacity
        onPress={() =>
          isSelected
            ? handleRemovePlayer(player.firebase_id)
            : handleAddPlayer(player.firebase_id)
        }
        className="rounded-full items-center justify-center bg-white"
        style={{
          boxShadow: "0px 1px 4px 1px rgba(0, 0, 0, 0.25)",
          width: 24,
          height: 24,
        }}
      >
        <Text
          className="font-bold text-xl"
          style={{ color: isSelected ? "red" : "green" }}
        >
          {isSelected ? "—" : "+"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      {/* Header */}
      <View className="flex-row items-center justify-between py-4">
        <TouchableOpacity onPress={onClickBack}>
          <Arrow direction="left" />
        </TouchableOpacity>
        <Text className="font-inter-semibold text-lg">{t("players")}</Text>
        <View style={{ width: 22, height: 22 }} />
      </View>

      {/* Content */}
      <View className="flex-1 py-4">
        {/* Selected Players Section */}
        <View className="mb-6">
          <Text className="font-inter-semibold text-lg mb-3">
            {t("selected")}
          </Text>
          {selectedPlayersData.length > 0 ? (
            selectedPlayersData.map((player) => renderPlayerItem(player, true))
          ) : (
            <Text className="font-inter-regular text-sm">-----</Text>
          )}
        </View>

        {/* Not Selected Players Section */}
        <View>
          <Text className="font-inter-semibold text-lg mb-3">
            {t("notSelected")}
          </Text>
          {notSelectedPlayersData.length > 0 ? (
            notSelectedPlayersData.map((player) =>
              renderPlayerItem(player, false),
            )
          ) : (
            <Text className="font-inter-regular text-sm">----</Text>
          )}
        </View>
      </View>
    </View>
  );
}
