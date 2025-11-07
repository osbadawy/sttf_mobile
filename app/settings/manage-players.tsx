import ParallaxScrollView from "@/components/ParallaxScrollView";
import InviteInput from "@/components/settings/InviteInput";
import InviteList from "@/components/settings/InviteList";
import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

export type PlayerInvite = {
  id: string;
  email: string;
  acceptedInvite: boolean;
  avatarUrl?: string;
};

const INITIAL_INVITES: PlayerInvite[] = [
  {
    id: "u1",
    email: "accepted.user@domain.com",
    acceptedInvite: true,
    avatarUrl:
      "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg",
  },
  { id: "u2", email: "pending.user@domain.com", acceptedInvite: false },
  {
    id: "u3",
    email: "another.accepted@domain.com",
    acceptedInvite: true,
    avatarUrl:
      "https://jcpportraits.com/wp-content/uploads/2024/03/Untitled-design-2.jpg",
  },
];

export default function ManagePlayers() {
  const [invites, setInvites] = useState<PlayerInvite[]>(INITIAL_INVITES);
  const [deletedEmails, setDeletedEmails] = useState<string[]>([]);

  // simulate backend delete
  useEffect(() => {
    if (deletedEmails.length === 0) return;
    deletedEmails.forEach((e) =>
      console.log("[DELETE USER REQUEST] email=", e),
    );
    setDeletedEmails([]);
  }, [deletedEmails]);

  const addInvite = (email: string) => {
    setInvites((prev) => [
      { id: Math.random().toString(36).slice(2), email, acceptedInvite: false },
      ...prev,
    ]);
  };

  const deleteInvite = (id: string) => {
    setInvites((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) setDeletedEmails((q) => [...q, target.email]);
      return prev.filter((p) => p.id !== id);
    });
  };

  const existingEmails = useMemo(
    () => new Set(invites.map((i) => i.email.toLowerCase())),
    [invites],
  );

  return (
    <ParallaxScrollView
      headerProps={{
        showDateSelector: false,
        showCalendarIcon: false,
        title: "Manage Players",
        showBGImage: false,
        showBackButton: true,
      }}
      showNav={false}
      error={false}
    >
      <View className="px-4 pt-2 pb-6">
        {/* Add Players */}
        <Text className="mb-2 text-[13px] font-semibold text-neutral-600">
          Add Players
        </Text>
        <View className="mb-3 h-[1px] w-full bg-neutral-200" />

        <InviteInput onAdd={addInvite} existingEmails={existingEmails} />

        {/* List */}
        <Text className="mb-2 mt-2 text-[13px] font-semibold text-neutral-600">
          Your players
        </Text>
        <View className="mb-4 h-[1px] w-full bg-neutral-200" />

        <InviteList invites={invites} onDelete={deleteInvite} />
      </View>
    </ParallaxScrollView>
  );
}
