import { ThinPlusIcon } from "@/components/icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CreateWorkoutModal from "@/components/plan/workout/CreateWorkoutModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function WorkoutPlan() {
  const { t } = useLocalization("components.plan.workout");

  // TODO: Get from params later
  const players = [
    "j3qvXziHUwbzVkKpR0OcG35axWV2",
    "oCK9lOmTSeZsx28W5E9QZJhe7Yy1",
  ];

  const dateState = useState(new Date());
  const [date, setDate] = dateState;
  const [showCreateWorkoutModal, setShowCreateWorkoutModal] = useState(false);
  const {user} = useAuth();

  return (
    <ParallaxScrollView
      headerProps={showCreateWorkoutModal ? undefined : {
        title: t("title"),
        // customDescription: TODO: Made the players icons + title here,
        showBackButton: true,
        showBGImage: false,
        showCalendarIcon: false,
        showDateSelector: true,
        disableFutureDates: false,
        useDateState: dateState,
      }}
      showNav={false}
    >
      <TouchableOpacity
        className="w-full border-[#B5BCBF] border-2 rounded-[16px] py-[30px] items-center justify-center flex-row"
        style={{
          gap: 12,
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          borderStyle: "dashed",
        }}
        onPress={() => setShowCreateWorkoutModal(true)}
      >
        <View style={{ transform: [{ scale: 1.5 }] }}>
          <ThinPlusIcon color="#45575E" />
        </View>

        <Text className="effra-semibold text-xl text-[#45575E]">
          {t("addActivity")}
        </Text>
      </TouchableOpacity>

      {showCreateWorkoutModal && (
        <CreateWorkoutModal
          onClose={() => setShowCreateWorkoutModal(false)}
          players={players}
          user={user}
        />
      )}
    </ParallaxScrollView>
  );
}
