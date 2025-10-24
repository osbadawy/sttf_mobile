import Modal from "@/components/Modal";
import { useLocalization } from "@/contexts/LocalizationContext";
import { User } from "firebase/auth";
import { useState } from "react";
import { ScrollView } from "react-native";
import ActivitySelection from "./ActivitySelection";
import CategorySelection from "./CategorySelection";
import CreateWorkoutMain from "./CreateWorkoutMain";
import PlayersSelection from "./PlayersSelection";

interface Player {
  firebase_id: string;
  display_name: string;
  profile_picture: string;
}

interface CreateWorkoutModalProps {
  onClose: () => void;
  allPlayers: Player[] | undefined;
  originalSelectedPlayers: string[];
  user: User | null;
  onActivityCreated?: () => void;
  date: Date;
}
export default function CreateWorkoutModal({
  date,
  onClose,
  allPlayers,
  originalSelectedPlayers = [],
  user,
  onActivityCreated,
}: CreateWorkoutModalProps) {
  const { t, isRTL } = useLocalization("components.plan.workout");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const [category, setCategory] = useState<
    "technical" | "strength" | "recovery" | null
  >(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showPlayersSelection, setShowPlayersSelection] =
    useState<boolean>(false);
  const [players, setPlayers] = useState<string[]>(originalSelectedPlayers);

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
  } else if (selectedActivity == null) {
    modalContent = (
      <ActivitySelection
        category={category}
        setSelectedActivity={setSelectedActivity}
        t={t}
        isRTL={isRTL}
        tActivityTypes={tActivityTypes}
      />
    );
  } else {
    modalContent = (
      <CreateWorkoutMain
        date={date}
        players={players}
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
        t={t}
        tActivityTypes={tActivityTypes}
        category={category}
        onClose={onClose}
        user={user}
        onActivityCreated={onActivityCreated}
        onOpenPlayersSelection={() => setShowPlayersSelection(true)}
      />
    );
  }

  return (
    <Modal
      contentColor="#F8F9F2"
      outterColor="rgba(0, 0, 0, 0.2)"
      onClose={() => {
        setCategory(null);
        setSelectedActivity(null);
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
