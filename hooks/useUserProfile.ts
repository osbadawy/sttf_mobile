import { getValue, storeValue } from "@/utils/storage";
import { useCallback, useEffect, useState } from "react";

interface UserProfile {
  userName: string;
  setUserName: (userName: string) => Promise<void>;
  profilePicture: string;
  setProfilePicture: (profilePicture: string) => Promise<void>;
  access: Access | undefined;
  setAccess: (access: Access) => Promise<void>;
}

export type Access = "player" | "coach" | "nutritionist" | "admin";

/**
 * Custom hook that loads and returns user profile data from AsyncStorage
 * @returns Object containing userName and profilePicture
 */
export const useUserProfile = (): UserProfile => {
  const [userName, setUserNameState] = useState<string>("");
  const [profilePicture, setProfilePictureState] = useState<string>("");
  const [access, setAccessState] = useState<Access | undefined>(undefined);

  // Wrapper functions that update both state and storage
  const setUserName = useCallback(async (userName: string) => {
    setUserNameState(userName);
    try {
      await storeValue("userName", userName);
    } catch (error) {
      console.error("Error storing userName:", error);
    }
  }, []);

  const setProfilePicture = useCallback(async (profilePicture: string) => {
    setProfilePictureState(profilePicture);
    try {
      await storeValue("profile_picture", profilePicture);
    } catch (error) {
      console.error("Error storing profile_picture:", error);
    }
  }, []);

  const setAccess = useCallback(async (access: Access) => {
    setAccessState(access);
    try {
      await storeValue("access", access);
    } catch (error) {
      console.error("Error storing access:", error);
    }
  }, []);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const storedName = await getValue("userName", "");
        setUserNameState(storedName);

        const storedProfilePicture = await getValue("profile_picture", "");
        setProfilePictureState(storedProfilePicture);

        const storedAccess = await getValue<Access | undefined>(
          "access",
          undefined,
        );
        setAccessState(storedAccess);
      } catch (error) {
        console.error("Error loading user profile from storage:", error);
      }
    };

    loadUserProfile();
  }, []);

  return {
    userName,
    setUserName,
    profilePicture,
    setProfilePicture,
    access,
    setAccess,
  };
};
