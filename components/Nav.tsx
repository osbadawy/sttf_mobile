import { NavGlassBlur } from "@/components/icons/NavBarSvg"; // <-- adjust path to where you saved it
import { useUserProfile } from "@/hooks/useUserProfile";
import { getIoniconName } from "@/utils/getIoniconName";
import { Ionicons } from "@expo/vector-icons";
import { Link, RelativePathString, usePathname } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface NavItem {
  href: RelativePathString;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const playerNavItems: NavItem[] = [
  { href: "/" as RelativePathString, label: "Home", icon: "home-outline" },
  { href: "player/dashboard" as RelativePathString, label: "Dashboard", icon: "analytics-outline" },
  { href: "player/activities" as RelativePathString, label: "Activities", icon: "fitness-outline" },
  { href: "player/settings" as RelativePathString, label: "Settings", icon: "settings-outline" },
];

const coachNavItems: NavItem[] = [
  { href: "/" as RelativePathString, label: "Home", icon: "home-outline" },
  { href: "coach/dashboard" as RelativePathString, label: "Dashboard", icon: "analytics-outline" },
  { href: "coach/settings" as RelativePathString, label: "Settings", icon: "settings-outline" },
];

// Match your NavBarSvg viewBox
const SVG_WIDTH = 300;
const SVG_HEIGHT = 90;

// Button size (kept from your original)
const BTN_SIZE = 55;

export default function Nav() {
  const pathname = usePathname();
  const { access } = useUserProfile();

  let navItems: NavItem[] = [];
  if (access === "player") {
    navItems = playerNavItems;
  } else if (access === "coach") {
    navItems = coachNavItems;
  }

  // Compute evenly spaced circle centers across the SVG width.
  const midX = SVG_WIDTH / 2;
  const SPACING = 0.92; // < 1.0 brings buttons closer together
  const evenCenters = navItems.map((_, i) => ((2 * i + 1) / (navItems.length * 2)) * SVG_WIDTH);
  const centersX = evenCenters.map(x => midX + (x - midX) * SPACING);
  const centerY = SVG_HEIGHT / 2;

  return (
    <View className="absolute bottom-8 left-0 right-0 items-center">
      {/* Container sized to the SVG */}
      <View style={{ width: SVG_WIDTH, height: SVG_HEIGHT, position: "relative" }}>
        {/* SVG background replaces the old pill container */}
        <NavGlassBlur
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
        />

        {/* Buttons centered over each background circle */}
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href;
          const cx = centersX[idx];
          const cy = centerY;

          return (
            <Link key={item.href} href={item.href} asChild>
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
              >
                <Ionicons
                  name={getIoniconName(item.icon, isActive)}
                  size={25}
                  color={isActive ? "#FFFFFF" : "#000000ff"}
                />
                {/* keep labels hidden as before */}
                <Text className="text-[11px] leading-4 opacity-0 h-0 mt-0">
                  {item.label}
                </Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </View>
  );
}
