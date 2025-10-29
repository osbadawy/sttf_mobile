import { ActivityIcon, BodyIcon, NutritionIcon } from "@/components/icons";
import { router, type RelativePathString } from "expo-router";
import { cloneElement, memo, ReactElement } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  playerIds?: string[];
  title?: string;
  className?: string;
  /** Safe-area bottom inset (e.g., from useSafeAreaInsets().bottom) */
  insetBottom?: number;
}

interface NavItem {
  label: string;
  icon: ReactElement; // raw element
  path: RelativePathString;
  params: Record<string, any>;
  disabled: boolean;
}

const EditPlanPicker = memo(function EditPlanPicker({
  playerIds = [],
  title = "Edit Plan",
  className = "",
  insetBottom = 0,
}: Props) {
  const items: NavItem[] = [
    {
      label: "Meals",
      icon: <NutritionIcon />,
      path: "/plan/meal" as RelativePathString,
      params: { players: encodeURIComponent(JSON.stringify(playerIds)) },
      disabled: playerIds.length === 0,
    },
    {
      label: "Workout",
      icon: <ActivityIcon />,
      path: "/plan/workout" as RelativePathString,
      params: { players: encodeURIComponent(JSON.stringify(playerIds)) },
      disabled: playerIds.length === 0,
    },
    {
      label: "Body",
      icon: <BodyIcon />,
      path: "/player/body/BodyData" as RelativePathString,
      params: {
        player: encodeURIComponent(
          JSON.stringify({
            firebase_id: playerIds[0],
          }),
        ),
      },
      disabled: playerIds.length !== 1,
    },
  ];

  const go = (
    path: RelativePathString,
    disabled: boolean,
    params: Record<string, any>,
  ): void => {
    if (disabled) return;
    const q = encodeURIComponent(JSON.stringify(playerIds));
    router.push({
      pathname: path,
      params,
    });
  };

  const Item = ({ def }: { def: NavItem }) => {
    const { icon, label, path } = def;

    // Safe props snapshot
    const props = icon.props ?? {};
    const supportsClassName = Object.prototype.hasOwnProperty.call(
      props,
      "className",
    );

    // Narrow the element type before cloning so TS knows className exists
    let tintedIcon: ReactElement = icon;
    if (supportsClassName) {
      const iconWithClass = icon as ReactElement<{ className?: string }>;
      tintedIcon = cloneElement(iconWithClass, {
        className: def.disabled ? "text-neutral-300" : "text-black",
      });
    }

    return (
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        activeOpacity={0.7}
        disabled={def.disabled}
        onPress={() => go(path, def.disabled, def.params)}
        style={{ opacity: def.disabled ? 0.35 : 1 }}
      >
        <View>{tintedIcon}</View>
        <Text
          className={`mt-1 text-sm ${def.disabled ? "text-neutral-300" : "text-black"}`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: insetBottom + 14, // <-- uses prop
        paddingTop: 8,
        paddingHorizontal: 16,
        zIndex: 100,
        elevation: 18,
      }}
      pointerEvents="box-none"
    >
      <View
        className="mx-8 rounded-2xl"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        }}
      >
        <View className={`relative items-center ${className}`}>
          <View className="absolute -top-3 z-10 rounded-2xl bg-white px-4 py-1">
            <Text className="text-[13px] font-medium text-neutral-700">
              {title}
            </Text>
          </View>

          <View
            className="
              w-full flex-row items-center justify-between
              rounded-full border border-neutral-100 bg-white px-4 py-3
              shadow-2xl
            "
            style={{ elevation: 6 }}
          >
            {items.map((def) => (
              <Item key={def.label} def={def} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
});

export default EditPlanPicker;
