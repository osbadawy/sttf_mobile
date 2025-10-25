import Modal from "@/components/Modal";
import { useLocalization } from "@/contexts/LocalizationContext";
import { GetMealsResponse } from "@/schemas/PlannedMeal";
import { User } from "firebase/auth";
import { useState } from "react";
import { ScrollView } from "react-native";
import CategorySelection from "./CategorySelection";
import CreateMealMain from "./CreateMealMain";
import PlayersSelection from "./PlayersSelection";

interface Player {
  firebase_id: string;
  display_name: string;
  profile_picture: string;
}

interface CreateMealModalProps {
  onClose: () => void;
  allPlayers: Player[] | undefined;
  originalSelectedPlayers: string[];
  user: User | null;
  onMealCreated?: () => void;
  date: Date;
  editingMeal?: GetMealsResponse | null; // Meal being edited
  onDeleteMeal?: (meal: GetMealsResponse) => void;
}

export default function CreateMealModal({
  date,
  onClose,
  allPlayers,
  originalSelectedPlayers = [],
  user,
  onMealCreated,
  editingMeal,
  onDeleteMeal,
}: CreateMealModalProps) {
  const { t, isRTL } = useLocalization("components.plan.meal");

  const [category, setCategory] = useState<
    "breakfast" | "lunch" | "dinner" | "snack" | null
  >(
    editingMeal
      ? (editingMeal.category as "breakfast" | "lunch" | "dinner" | "snack")
      : null,
  );
  const [showPlayersSelection, setShowPlayersSelection] =
    useState<boolean>(false);
  const [players, setPlayers] = useState<string[]>(
    editingMeal
      ? editingMeal.players_assigned
          .filter((assignment: any) => !assignment.removed_at)
          .map((assignment: any) => assignment.assigned_to_user.firebase_id)
      : originalSelectedPlayers,
  );

  let modalContent = null;
  if (showPlayersSelection) {
    modalContent = (
      <PlayersSelection
        allPlayers={allPlayers}
        selectedPlayers={players}
        onSelectPlayers={setPlayers}
        onClickBack={() => setShowPlayersSelection(false)}
      />
    );
  } else if (category == null) {
    modalContent = (
      <CategorySelection setCategory={setCategory} t={t} isRTL={isRTL} />
    );
  } else {
    modalContent = (
      <CreateMealMain
        date={date}
        players={players}
        t={t}
        category={category}
        setCategory={setCategory}
        onClose={onClose}
        user={user}
        onMealCreated={onMealCreated}
        onOpenPlayersSelection={() => setShowPlayersSelection(true)}
        editingMeal={editingMeal}
        originalPlayers={originalSelectedPlayers}
        onDeleteMeal={onDeleteMeal}
      />
    );
  }

  return (
    <Modal
      contentColor="#F8F9F2"
      outterColor="rgba(0, 0, 0, 0.2)"
      onClose={() => {
        setCategory(null);
        onClose();
      }}
      maxHeight={"80%"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {modalContent}
      </ScrollView>
    </Modal>
  );
}
