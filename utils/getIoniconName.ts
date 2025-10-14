import { Ionicons } from "@expo/vector-icons";

// --- helper: pick filled when inactive, outline when active ---
export function getIoniconName(
  baseOutlineName: keyof typeof Ionicons.glyphMap,
  isActive: boolean,
): keyof typeof Ionicons.glyphMap {
  // item.icon is the outline by default (e.g., "home-outline")
  const outline = baseOutlineName as string;

  // derive filled by stripping "-outline" suffix
  const filled = outline.endsWith("-outline")
    ? (outline.slice(0, -"-outline".length) as keyof typeof Ionicons.glyphMap)
    : (outline as keyof typeof Ionicons.glyphMap);

  const outlineKey = outline as keyof typeof Ionicons.glyphMap;

  // choose target based on isActive
  const target = isActive ? outlineKey : filled;

  // safety: make sure the target exists in the glyph map; otherwise fall back
  if (Ionicons.glyphMap[target]) return target;

  // if the chosen variant doesn't exist, try the other one
  const fallback = isActive ? filled : outlineKey;
  if (Ionicons.glyphMap[fallback]) return fallback;

  // last resort: return what we were given
  return baseOutlineName;
}
