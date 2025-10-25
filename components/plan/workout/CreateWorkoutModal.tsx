import Modal from "@/components/Modal";
import { useLocalization } from "@/contexts/LocalizationContext";
import { User } from "firebase/auth";
import { useState } from "react";
import { ScrollView } from "react-native";
import ActivitySelection from "./ActivitySelection";
import CategorySelection from "./CategorySelection";
import CreateWorkoutMain from "./CreateWorkoutMain";
import PlayersSelection from "./PlayersSelection";

// Function to determine category based on activity type
function getCategoryFromActivityType(
  activityType: string,
): "technical" | "strength" | "recovery" {
  const technicalActivities = [
    "warm-up",
    "serve",
    "recieve",
    "stroke-technique",
    "footwork",
    "pattern-play",
  ];

  const recoveryActivities = ["yoga"];

  if (technicalActivities.includes(activityType)) {
    return "technical";
  } else if (recoveryActivities.includes(activityType)) {
    return "recovery";
  } else {
    return "strength";
  }
}

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
  editingActivity?: any; // Activity being edited
  onDeleteActivity?: (activity: any) => void;
  clearCacheForRecurringDays: (
    startDate: Date,
    endDate: Date,
    recurringDays: string[],
    users?: string[],
  ) => void;
}
export default function CreateWorkoutModal({
  date,
  onClose,
  allPlayers,
  originalSelectedPlayers = [],
  user,
  onActivityCreated,
  editingActivity,
  onDeleteActivity,
  clearCacheForRecurringDays,
}: CreateWorkoutModalProps) {
  const { t, isRTL } = useLocalization("components.plan.workout");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const [category, setCategory] = useState<
    "technical" | "strength" | "recovery" | null
  >(
    editingActivity
      ? getCategoryFromActivityType(editingActivity.activity_type)
      : null,
  );
  const [selectedActivity, setSelectedActivity] = useState<string | null>(
    editingActivity ? editingActivity.activity_type : null,
  );
  const [showPlayersSelection, setShowPlayersSelection] =
    useState<boolean>(false);
  const [players, setPlayers] = useState<string[]>(
    editingActivity
      ? editingActivity.players_assigned
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
        editingActivity={editingActivity}
        originalPlayers={originalSelectedPlayers}
        onDeleteActivity={onDeleteActivity}
        clearCacheForRecurringDays={clearCacheForRecurringDays}
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
