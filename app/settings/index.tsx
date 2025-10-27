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
import { useUserProfile } from "@/hooks/useUserProfile";
import * as ImagePicker from "expo-image-picker";
import { RelativePathString, router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";

/** Simple formatter: DD.MM.YYYY */
const formatDateDDMMYYYY = (d: Date): string => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

export default function Settings() {
  const { userName, profilePicture } = useUserProfile();

  // --- form state ---
  const [firstName, setFirstName] = useState<string>("Joseph");
  const [lastName, setLastName] = useState<string>("Kaspari");
  const [nationalityCode, setNationalityCode] = useState<string>("SA");
  const [dob, setDob] = useState<Date>(new Date(2001, 8, 19)); // 19 Sept 2001
  const [hand, setHand] = useState<PlayHand>("right");

  // --- modal state ---
  const [nationalityOpen, setNationalityOpen] = useState<boolean>(false);
  const [handOpen, setHandOpen] = useState<boolean>(false);
  const [dobOpen, setDobOpen] = useState<boolean>(false);

  // --- avatar state (local selection overrides remote profilePicture) ---
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
    { label: "Right Hand", value: "right" },
    { label: "Left Hand", value: "left" },
  ];

  const onLogout = (): void => {
    // router.push("/auth/logout" as RelativePathString);
  };

  // ✅ fallback: use local asset if no remote/local URL
  const imageSource =
    (localAvatarUri && { uri: localAvatarUri }) ||
    (profilePicture && profilePicture.trim().length > 0
      ? { uri: profilePicture }
      : require("@/assets/images/logo.png"));

  // ✅ open library, pick one image, preview it, and console.log for upload
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
      aspect: [1, 1], // square crop for avatar
      quality: 0.9,
      base64: false, // flip to true if your uploader needs base64
      selectionLimit: 1, // iOS 14+; ignored on Android but we only handle first asset anyway
    });

    if (result.canceled) return;

    const asset: ImagePicker.ImagePickerAsset | undefined = result.assets?.[0];
    if (!asset || !asset.uri) return;

    // Show immediately
    setLocalAvatarUri(asset.uri);

    // Placeholder upload hook
    console.log("Selected image for upload:", {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileName: asset.fileName,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
    });
    // TODO: upload to your storage, get a public URL, then persist to user profile
    // After a successful upload, you could also clear localAvatarUri and update profilePicture source of truth.
  };

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
    >
      {/* PROFILE HEADER */}
      <View className="px-4 pt-4">
        <View className="flex-row items-center gap-3">
          <Image
            source={imageSource}
            className="h-14 w-14 rounded-full"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-black">
              {userName || `${firstName} ${lastName}`}
            </Text>
            <Text className="text-sm text-neutral-600">
              joseph.kaspari@covelant.com
            </Text>
          </View>
        </View>

        <Pressable className="mt-3 pl-4 w-12" onPress={handlePickImage}>
          <Text className="text-[#0E7A3E] underline">Edit</Text>
        </Pressable>
      </View>

      {/* ACCOUNT SECTION */}
      <View className="mt-5 px-4">
        <SectionHeader title="Account" />

        {/* Row: First / Last Name */}
        <View className="mt-3 flex-row gap-3">
          <LabeledInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            containerClass="flex-1"
          />
          <LabeledInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            containerClass="flex-1"
          />
        </View>

        {/* Nationality (select by code; show demonym) */}
        <SelectField
          label="Nationality"
          valueLabel={nationalityLabel}
          onPress={() => setNationalityOpen(true)}
        />
        <SelectModal
          title="Select Nationality"
          visible={nationalityOpen}
          onClose={() => setNationalityOpen(false)}
          options={nationalityOptions}
          onSelect={(opt) => {
            setNationalityCode(opt.value);
            setNationalityOpen(false);
          }}
        />

        {/* Date of Birth (Date picker) */}
        <DateField
          label="Date of Birth"
          valueLabel={formatDateDDMMYYYY(dob)}
          onPress={() => setDobOpen(true)}
        />
        <DatePickerModal
          title="Select Date of Birth"
          visible={dobOpen}
          onClose={() => setDobOpen(false)}
          date={dob}
          onChange={setDob}
          maximumDate={new Date()} // no future dates
          minimumDate={new Date(1900, 0, 1)} // lower bound
        />

        {/* Play Hand (select) */}
        <SelectField
          label="Play Hand"
          valueLabel={hand === "right" ? "Right Hand" : "Left Hand"}
          onPress={() => setHandOpen(true)}
        />
        <SelectModal
          title="Select Play Hand"
          visible={handOpen}
          onClose={() => setHandOpen(false)}
          options={handOptions}
          onSelect={(opt) => {
            setHand(opt.value as PlayHand);
            setHandOpen(false);
          }}
        />
      </View>

      {/* SETTINGS MENU */}
      <View className="mt-7 ">
        <View className="px-4 py-3">
          <Text className="text-lg font-normal text-neutral-700">Settings</Text>
        </View>
        <View className="h-px bg-neutral-200" />

        <SettingsRow
          label="Change password"
          onPress={() =>
            router.push("/settings/change-password" as RelativePathString)
          }
        />
        <Divider />
        <SettingsRow
          label="Manage Players"
          onPress={() =>
            router.push("/settings/manage-players" as RelativePathString)
          }
        />
        <Divider />
        <SettingsRow
          label="FAQ"
          onPress={() => router.push("/settings/faq" as RelativePathString)}
        />
        <Divider />

        <Pressable className="flex-row items-center justify-between px-4 py-4">
          <Text className="text-[#E53935]">Log Out</Text>
          <Text className="text-[#E53935]">⎋</Text>
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
}
