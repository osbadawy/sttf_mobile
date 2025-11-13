import ParallaxScrollView from "@/components/ParallaxScrollView";
import InviteInput from "@/components/settings/InviteInput";
import InviteList from "@/components/settings/InviteList";
import PlayerDeletionModal from "@/components/settings/PlayerDeletionModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAllPlayers } from "@/hooks/useAllPlayers";
import Constants from "expo-constants";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

export default function ManagePlayers() {
  const { t } = useLocalization("components.Settings.settings");
  const { user } = useAuth();
  const { players, loading, error, refetch } = useAllPlayers();
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);

  const addInvite = async (email: string) => {
    if (!user) {
      console.error("No authenticated user");
      return;
    }

    try {
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/user/player/create`;
      const token = await user.getIdToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          password: "sttf-2025!",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create player: ${response.status}`);
      }

      // Refetch players to update the list
      await refetch();
    } catch (err) {
      console.error("Error creating player:", err);
      // Optionally show an error toast or alert to the user
    }
  };

  const deleteInvite = async (id: string) => {
    if (!user) {
      console.error("No authenticated user");
      return;
    }

    try {
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/user/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete player: ${response.status}`);
      }

      // Refetch players to update the list
      await refetch();
    } catch (err) {
      console.error("Error deleting player:", err);
      // Optionally show an error toast or alert to the user
    }
  };

  const handleConfirmDelete = () => {
    if (playerToDelete) {
      deleteInvite(playerToDelete);
      setPlayerToDelete(null);
    }
  };

  const existingEmails = useMemo(
    () => new Set(players.map((p) => p.email.toLowerCase())),
    [players],
  );

  return (
    <>
      <ParallaxScrollView
        headerProps={{
          showDateSelector: false,
          showCalendarIcon: false,
          title: t("manage players"),
          showBGImage: false,
          showBackButton: true,
        }}
        showNav={false}
        error={!!error}
      >
        <View className="px-4 pt-2 pb-6">
          {/* Add Players */}
          <Text className="mb-2 text-[13px] font-semibold text-neutral-600">
            {t("add players")}
          </Text>
          <View className="mb-3 h-[1px] w-full bg-neutral-200" />

          <InviteInput onAdd={addInvite} existingEmails={existingEmails} />

          {/* List */}
          <Text className="mb-2 mt-2 text-[13px] font-semibold text-neutral-600">
            {t("your players")}
          </Text>
          <View className="mb-4 h-[1px] w-full bg-neutral-200" />

          <InviteList players={players} onDeleteClick={setPlayerToDelete} />
        </View>
      </ParallaxScrollView>

      <PlayerDeletionModal
        visible={!!playerToDelete}
        onClose={() => setPlayerToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
