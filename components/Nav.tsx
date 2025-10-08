import { useUserProfile } from "@/hooks/useUserProfile";
import { Ionicons } from "@expo/vector-icons";
import { Link, RelativePathString, usePathname } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface NavItem {
  href: RelativePathString;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const playerNavItems: NavItem[] = [
  {
    href: "/" as RelativePathString,
    label: "Home",
    icon: "home-outline",
  },
  {
    href: "player/dashboard" as RelativePathString,
    label: "Dashboard",
    icon: "analytics-outline",
  },
  {
    href: "player/activities" as RelativePathString,
    label: "Activities",
    icon: "fitness-outline",
  },
];

const coachNavItems: NavItem[] = [
  {
    href: "/" as RelativePathString,
    label: "Home",
    icon: "home-outline",
  },
  {
    href: "coach/dashboard" as RelativePathString,
    label: "Dashboard",
    icon: "analytics-outline",
  },
];

export default function Nav() {
  const pathname = usePathname();
  const { access } = useUserProfile();

  let navItems: NavItem[] = [];
  if (access === "player") {
    navItems = playerNavItems;
  } else if (access === "coach") {
    navItems = coachNavItems;
  }

  return (
    <View className="absolute bottom-0 left-0 right-0 flex-row bg-white border-t border-gray-200 px-4 py-3 safe-area-pb">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} asChild>
            <TouchableOpacity
              className={`flex-1 items-center py-2 px-1 ${
                isActive ? "opacity-100" : "opacity-60"
              }`}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={isActive ? "#0a7ea4" : "#687076"}
              />
              <Text
                className={`text-xs mt-1 ${
                  isActive ? "text-[#0a7ea4] font-medium" : "text-[#687076]"
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}
