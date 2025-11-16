import { router, type RelativePathString } from "expo-router";

export function redirectToPlayerPage(
  firebase_id: string,
  display_name: string,
  profile_picture: string,
) {
  const path = "/player/dashboard";
  const params = {
    player: JSON.stringify({ firebase_id, display_name, profile_picture }),
  };
  router.push({ pathname: path as RelativePathString, params });
}
