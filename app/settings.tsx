import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useUserProfile } from "@/hooks/useUserProfile";
import { View } from "react-native";

export default function Settings() {
    const { userName, profilePicture } = useUserProfile();

    return(
        <ParallaxScrollView
          headerProps={{
            showDateSelector: false,
            showCalendarIcon: false,
            title: "Settings",
          }}
          
        >
            <View style={{ flex: 1 }}>

            </View>
        </ParallaxScrollView>
    )
}