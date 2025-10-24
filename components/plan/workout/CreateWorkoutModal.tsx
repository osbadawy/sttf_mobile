import Modal from "@/components/Modal";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useState } from "react";
import { ScrollView } from "react-native";
import ActivitySelection from "./ActivitySelection";
import CategorySelection from "./CategorySelection";
import CreateWorkoutMain from "./CreateWorkoutMain";

interface CreateWorkoutModalProps {
  onClose: () => void;
}
export default function CreateWorkoutModal({
  onClose,
}: CreateWorkoutModalProps) {
  const { t, isRTL } = useLocalization("components.plan.workout");
  const { t: tActivityTypes } = useLocalization(
    "components.activities.activityTypes",
  );

  const [category, setCategory] = useState<
    "technical" | "strength" | "recovery" | null
  >(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  let modalContent = null;
  if (category == null) {
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
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
        t={t}
        tActivityTypes={tActivityTypes}
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
      <ScrollView>{modalContent}</ScrollView>
    </Modal>
  );
}
