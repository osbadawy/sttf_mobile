import CustomButton, { ButtonColor } from "@/components/Button";
import LogOutIcon from "@/components/icons/settings/LogOutIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {
  buildNationalityLabelMap,
  buildNationalityOptions,
} from "@/components/settings/countryOptions";
import DateField from "@/components/settings/DateField";
import DatePickerModal from "@/components/settings/DatePickerModal";
import Divider from "@/components/settings/Divider";
import LabeledInput from "@/components/settings/LabeledInput";
import SectionHeader from "@/components/settings/SectionHeader";
import SelectField from "@/components/settings/SelectField";
import SelectModal from "@/components/settings/SelectModal";
import SettingsRow from "@/components/settings/SettingsRow";
import type { Option, PlayHand } from "@/components/settings/types";
import { useAuth } from "@/contexts/AuthContext"; // ✅ use the hook, not auth
import { useLocalization } from "@/contexts/LocalizationContext";
import { useUser } from "@/hooks/useUser";
import { useUserProfile } from "@/hooks/useUserProfile";
import { uploadToFirebase } from "@/utils/uploadToFirebase";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { RelativePathString, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

/** Simple formatter: DD.MM.YYYY */
const formatDateDDMMYYYY = (d: Date): string => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

export default function Settings() {
  const { t, isRTL } = useLocalization("components.Settings.settings");
  const { userName, setUserName, setProfilePicture, profilePicture } =
    useUserProfile();
  const { user, logout } = useAuth(); // ✅ get logout and user from context

  const { data, loading, error } = useUser();

  // --- form state ---
  const [name, setName] = useState<string>("");
  const [nationalityCode, setNationalityCode] = useState<string>("SA");
  const [dob, setDob] = useState<Date>(new Date(2000, 1, 1));
  const [hand, setHand] = useState<PlayHand>("right");

  // --- modal state ---
  const [nationalityOpen, setNationalityOpen] = useState<boolean>(false);
  const [handOpen, setHandOpen] = useState<boolean>(false);
  const [dobOpen, setDobOpen] = useState<boolean>(false);

  // --- avatar state ---
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  // Nationality
  const nationalityOptions = useMemo<Option[]>(
    () => buildNationalityOptions(),
    [],
  );
  const nationalityLabelByCode = useMemo(
    () => buildNationalityLabelMap(nationalityOptions),
    [nationalityOptions],
  );
  const nationalityLabel =
    nationalityLabelByCode.get(nationalityCode) ?? "Select...";

  const handOptions: Option[] = [
    { label: t("right hand"), value: "right" },
    { label: t("left hand"), value: "left" },
  ];

  useEffect(() => {
    if (data) {
      console.log({ data });
      setName(data.display_name || userName || "");
      setNationalityCode(data.nationality || "SA");
      setDob(
        data.birth_date ? new Date(data.birth_date) : new Date(2000, 1, 1),
      );
      setHand(data.player_stats?.dominant_hand || "right");
    }
  }, [data]);

  // ✅ Use context logout (handles Firebase signOut + redirect)
  const onLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!user) {
      Alert.alert(t("error"), t("user not found"));
      return;
    }
    try {
      let uploadedImageUrl: string | null = null;

      if (localAvatarUri) {
        uploadedImageUrl = await uploadToFirebase({
          folderName: "sttf/avatar",
          id: user.uid,
          includeDate: false,
          imageUri: localAvatarUri,
        });
      }

      const url = `${Constants.expoConfig?.extra?.BACKEND_URL}/user`;

      const requestBody = {
        display_name: name,
        nationality: nationalityCode,
        birth_date: dob.toISOString(),
        dominant_hand: hand,
        avatar_url: uploadedImageUrl,
      };

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const responseData = await response.json();
      console.log("User updated successfully:", responseData);
      Alert.alert(t("success"), t("settings saved successfully"));
      setUserName(responseData.display_name || name);
      setProfilePicture(responseData.avatar_url || profilePicture || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user settings";
      console.error("Error updating user:", err);
      Alert.alert(t("error"), errorMessage);
    }
  };

  // ✅ image source
  const imageSource =
    (localAvatarUri && { uri: localAvatarUri }) ||
    (profilePicture && profilePicture.trim().length > 0
      ? { uri: profilePicture }
      : require("@/assets/images/logo.png"));

  // ✅ pick image
  const handlePickImage = async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow photo library access to choose a profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
      base64: false,
      selectionLimit: 1,
    });

    if (result.canceled) return;

    const asset: ImagePicker.ImagePickerAsset | undefined = result.assets?.[0];
    if (!asset?.uri) return;

    setLocalAvatarUri(asset.uri);
    console.log("Selected image for upload:", {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileName: asset.fileName,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
    });
  };

  // ------- RTL helpers -------
  const rowDir = isRTL ? "flex-row-reverse" : "flex-row";
  const textDir = isRTL ? "text-right" : "text-left";
  const padInlineStart = isRTL ? "pr-4" : "pl-4";

  return (
    <ParallaxScrollView
      headerProps={{
        showDateSelector: false,
        showCalendarIcon: false,
        title: "Settings",
        showBGImage: false,
        showBackButton: true,
      }}
      showNav={false}
      error={!!error}
    >
      {/* PROFILE HEADER */}
      <View className="px-4">
        <View className={`${rowDir} items-center gap-3`}>
          <Image
            source={imageSource}
            className="h-14 w-14 rounded-full"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className={`text-lg font-semibold text-black ${textDir}`}>
              {userName}
            </Text>
          </View>
        </View>

        <Pressable
          className={`mt-3 w-12 ${padInlineStart} ${textDir}`}
          onPress={handlePickImage}
        >
          <Text className="text-[#0E7A3E] underline">{t("edit")}</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* ACCOUNT SECTION */}
      <View className="mt-5 px-4">
        <SectionHeader title={t("account")} isRTL={isRTL} />

        {/* Row: Name */}
        <LabeledInput
          isRTL={isRTL}
          label={t("name")}
          value={name}
          onChangeText={setName}
          placeholder={name}
          containerClass="flex-1"
        />

        {/* Nationality */}
        <SelectField
          isRTL={isRTL}
          label={t("nationality")}
          valueLabel={nationalityLabel}
          onPress={() => setNationalityOpen(true)}
        />
        <SelectModal
          isRTL={isRTL}
          title={t("select nationality")}
          visible={nationalityOpen}
          onClose={() => setNationalityOpen(false)}
          options={nationalityOptions}
          onSelect={(opt) => {
            setNationalityCode(opt.value);
            setNationalityOpen(false);
          }}
        />

        {/* Date of Birth */}
        <DateField
          isRTL={isRTL}
          label={t("date of birth")}
          valueLabel={formatDateDDMMYYYY(dob)}
          onPress={() => setDobOpen(true)}
        />
        <DatePickerModal
          isRTL={isRTL}
          title={t("select date of birth")}
          visible={dobOpen}
          onClose={() => setDobOpen(false)}
          date={dob}
          onChange={setDob}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />

        {/* Play Hand */}
        <SelectField
          isRTL={isRTL}
          label={t("dominant hand")}
          valueLabel={hand === "right" ? t("right hand") : t("left hand")}
          onPress={() => setHandOpen(true)}
        />
        <SelectModal
          isRTL={isRTL}
          title={t("select dominant hand")}
          visible={handOpen}
          onClose={() => setHandOpen(false)}
          options={handOptions}
          onSelect={(opt) => {
            setHand(opt.value as PlayHand);
            setHandOpen(false);
          }}
        />

        <View className="py-10 px-6">
          <CustomButton
            title={t("save")}
            onPress={handleSave}
            color={ButtonColor.primary}
          />
        </View>
      </View>

      {/* SETTINGS MENU */}
      <View className="mt-7 ">
        <View className={`px-4 py-3 ${rowDir}`}>
          <Text className={`text-lg font-normal text-neutral-700 ${textDir}`}>
            {t("settings")}
          </Text>
        </View>
        <View className="h-px bg-neutral-200" />

        <SettingsRow
          isRTL={isRTL}
          label={t("change password")}
          onPress={() =>
            router.push("/settings/change-password" as RelativePathString)
          }
        />
        <Divider />
        <SettingsRow
          isRTL={isRTL}
          label={t("manage players")}
          onPress={() =>
            router.push("/settings/manage-players" as RelativePathString)
          }
        />
        <Divider />
        <SettingsRow
          isRTL={isRTL}
          label={t("FAQ")}
          onPress={() => router.push("/settings/faq" as RelativePathString)}
        />
        <Divider />

        {/* Logout row mirrors icon/text sides */}
        <Pressable
          onPress={onLogout}
          className={`${rowDir} items-center justify-between px-4 py-4 mb-5`}
        >
          <Text className={`text-[#E53935] ${textDir}`}>{t("log out")}</Text>
          <LogOutIcon />
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
}
