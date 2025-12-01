import CustomSelector from "@/components/CustomSelector";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import InviteInput from "@/components/settings/InviteInput";
import InviteList from "@/components/settings/InviteList";
import PlayerDeletionModal from "@/components/settings/PlayerDeletionModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useAllCoaches } from "@/hooks/useAllCoaches";
import { useAllPlayers } from "@/hooks/useAllPlayers";
import { useUserProfile } from "@/hooks/useUserProfile";
import Constants from "expo-constants";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";

export default function ManagePlayers() {
  const { t, isRTL } = useLocalization("components.Settings.settings");
  const { user } = useAuth();
  const { access } = useUserProfile();
  const isAdmin = access === "admin";
  const { players, loading, error, refetch } = useAllPlayers();
  const {
    coaches,
    loading: coachesLoading,
    error: coachesError,
    refetch: coachesRefetch,
  } = useAllCoaches(isAdmin);
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [active, setActive] = useState<"players" | "coaches">("players");

  // Force active to "players" for coaches
  const effectiveActive = isAdmin ? active : "players";

  const addInvite = async (email: string) => {
    if (!user) {
      console.error("No authenticated user");
      return;
    }

    try {
      // Coaches can only add players, admins can add both
      const endpoint =
        effectiveActive === "players"
          ? "/user/player/create"
          : "/user/coach/create";
      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}${endpoint}`;
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
        throw new Error(
          `Failed to create ${effectiveActive.slice(0, -1)}: ${response.status}`,
        );
      }

      // Refetch the appropriate list
      if (effectiveActive === "players") {
        await refetch();
      } else {
        await coachesRefetch();
      }
    } catch (err) {
      console.error(`Error creating ${effectiveActive.slice(0, -1)}:`, err);
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
        throw new Error(
          `Failed to delete ${effectiveActive.slice(0, -1)}: ${response.status}`,
        );
      }

      // Refetch the appropriate list
      if (effectiveActive === "players") {
        await refetch();
      } else {
        await coachesRefetch();
      }
    } catch (err) {
      console.error(`Error deleting ${effectiveActive.slice(0, -1)}:`, err);
      // Optionally show an error toast or alert to the user
    }
  };

  const handleConfirmDelete = () => {
    if (playerToDelete) {
      deleteInvite(playerToDelete);
      setPlayerToDelete(null);
    }
  };

  const existingEmails = useMemo(() => {
    const userList = effectiveActive === "players" ? players : coaches;
    return new Set(userList.map((u) => u.email.toLowerCase()));
  }, [players, coaches, effectiveActive]);

  return (
    <>
      <ParallaxScrollView
        headerProps={{
          showDateSelector: false,
          showCalendarIcon: false,
          title: t("manage users"),
          showBGImage: false,
          showBackButton: true,
        }}
        showNav={false}
        error={!!error || (isAdmin && !!coachesError)}
      >
        {isAdmin && (
          <CustomSelector
            options={[
              { id: "players", label: t("players") },
              { id: "coaches", label: t("coaches") },
            ]}
            value={active}
            onChange={(value) => setActive(value as "players" | "coaches")}
            isRTL={isRTL}
          />
        )}
        <View className="px-4 pt-2 pb-6">
          {/* Add Users */}
          <Text className="mb-2 text-[13px] font-semibold text-neutral-600">
            {active === "players" ? t("add players") : t("add coaches")}
          </Text>
          <View className="mb-3 h-[1px] w-full bg-neutral-200" />

          <InviteInput
            onAdd={addInvite}
            existingEmails={existingEmails}
            type={active === "players" ? "player" : "coach"}
          />

          {/* Conditional List Rendering */}
          {effectiveActive === "players" ? (
            <>
              <Text className="mb-2 mt-2 text-[13px] font-semibold text-neutral-600">
                {t("your players")}
              </Text>
              <View className="mb-4 h-[1px] w-full bg-neutral-200" />
              <InviteList users={players} onDeleteClick={setPlayerToDelete} />
            </>
          ) : (
            <>
              <Text className="mb-2 mt-2 text-[13px] font-semibold text-neutral-600">
                {t("your coaches")}
              </Text>
              <View className="mb-4 h-[1px] w-full bg-neutral-200" />
              <InviteList users={coaches} onDeleteClick={setPlayerToDelete} />
            </>
          )}
        </View>
      </ParallaxScrollView>

      <PlayerDeletionModal
        visible={!!playerToDelete}
        onClose={() => setPlayerToDelete(null)}
        onConfirm={handleConfirmDelete}
        type={active === "players" ? "player" : "coach"}
      />
    </>
  );
}
