import NavBarSvg from "@/components/icons/NavBarSvg"; // <-- adjust path to where you saved it
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  RelativePathString,
  router,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ActivityIcon, AnalyticsIcon, HomeIcon, NutritionIcon } from "./icons";

interface NavItem {
  href: RelativePathString;
  label: string;
  icon: React.ReactNode;
}

const playerNavItems = (access: string): NavItem[] => [
  { href: "/" as RelativePathString, label: "Home", icon: <HomeIcon /> },
  {
    href: `/${access}/dashboard` as RelativePathString,
    label: "Dashboard",
    icon: <AnalyticsIcon />,
  },
  {
    href: "/player/activities" as RelativePathString,
    label: "Activities",
    icon: <ActivityIcon />,
  },
  {
    href: "/player/nutrition" as RelativePathString,
    label: "Add",
    icon: <NutritionIcon />,
  },
];

// Match your NavBarSvg viewBox
const SVG_WIDTH = 300;
const SVG_HEIGHT = 90;

// Button size (kept from your original)
const BTN_SIZE = 55;

export default function Nav() {
  const pathname = usePathname();
  const { player } = useLocalSearchParams();
  const { access } = useUserProfile();
  let navItems: NavItem[] = playerNavItems(access);

  // Compute evenly spaced circle centers across the SVG width.
  const midX = SVG_WIDTH / 2;
  const SPACING = 0.92; // < 1.0 brings buttons closer together
  const evenCenters = navItems.map(
    (_, i) => ((2 * i + 1) / (navItems.length * 2)) * SVG_WIDTH,
  );
  const centersX = evenCenters.map((x) => midX + (x - midX) * SPACING);
  const centerY = SVG_HEIGHT / 2;

  return (
    <View className="absolute bottom-8 left-0 right-0 items-center">
      {/* Container sized to the SVG */}
      <View
        style={{ width: SVG_WIDTH, height: SVG_HEIGHT, position: "relative" }}
      >
        {/* SVG background replaces the old pill container */}
        <NavBarSvg width={SVG_WIDTH} height={SVG_HEIGHT} />

        {/* Buttons centered over each background circle */}
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href;
          const cx = centersX[idx];
          const cy = centerY;

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              className="items-center justify-center rounded-full"
              style={{
                position: "absolute",
                left: cx - BTN_SIZE / 2,
                top: cy - BTN_SIZE / 2,
                width: BTN_SIZE,
                height: BTN_SIZE,
                backgroundColor: isActive ? "#8CC8B6" : "#FFFFFF",
                shadowColor: isActive ? "#8CC8B6" : "#818181ff",
                shadowOpacity: isActive ? 0.25 : 0.1,
                shadowRadius: isActive ? 12 : 6,
                shadowOffset: { width: 0, height: isActive ? 8 : 3 },
                elevation: isActive ? 10 : 4,
              }}
              onPress={() =>
                router.push({
                  pathname: item.href as RelativePathString,
                  params: { player },
                })
              }
            >
              {React.cloneElement(item.icon as React.ReactElement<any>, {
                color: isActive ? "#FFFFFF" : undefined,
              })}
              {/* keep labels hidden as before */}
              <Text className="text-[11px] leading-4 opacity-0 h-0 mt-0">
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
