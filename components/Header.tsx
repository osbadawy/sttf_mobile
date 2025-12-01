import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { HeaderColor } from "@/schemas/components/HeaderTypes";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, router } from "expo-router";
import { useState } from "react";
import { Image, Platform, Pressable, Text, TouchableOpacity, View } from "react-native";
import HeaderDateSelector from "./HeaderDateSelector";
import {
  Arrow,
  ArrowBig,
  HeaderBgIcon,
  ProfilePictureDefaultIcon,
} from "./icons";
import CalendarIcon from "./icons/CalendarIcon";
import DatePickerModal from "./settings/DatePickerModal";

export interface HeaderNotification {
  title: string;
  message: string;
  path: RelativePathString;
  icon?: React.ReactNode;
}

export interface HeaderProps {
  title?: string;
  name?: string;
  profilePicture?: string;
  showDateSelector?: boolean;
  showBackButton?: boolean;
  customBackPath?: RelativePathString;
  customBackParams?: Record<string, string>;
  color?: HeaderColor;
  notification?: HeaderNotification;
  useDateState?: [Date, (date: Date) => void];
  showBGImage?: boolean;
  showCalendarIcon?: boolean;
  customDescription?: React.ReactNode | string;
  disableFutureDates?: boolean;
}

export default function Header({
  title,
  name,
  profilePicture,
  showDateSelector,
  showBackButton = false,
  customBackPath,
  customBackParams,
  color = HeaderColor.BG,
  notification,
  useDateState = [new Date(), () => {}],
  showBGImage = true,
  showCalendarIcon = true,
  customDescription,
  disableFutureDates,
}: HeaderProps) {
  /**
   * Header is on Z-index 50 and 60
   *
   * Either pass the title, or name, but not both
   */
  if (!!title === !!name)
    throw new Error("Exactly one of 'title' or 'name' must be provided");

  const [date, setDate] = useDateState;
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const isToday = date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  const isToday = false;
  const { t, isRTL } = useLocalization("common");

  const textColor = color === HeaderColor.primary ? "text-white" : "text-black";

  if (typeof customDescription === "string") {
    customDescription = (
      <Text className="font-inter-light text-xs text-center">
        {customDescription}
      </Text>
    );
  }

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const ParentContainer = ({ children }: { children: React.ReactNode }) => {
    const className = "z-50 rounded-b-[72px] overflow-hidden";

    if (color === HeaderColor.primary) {
      return (
        <View className={className}>
          <LinearGradient
            colors={[
              colors.primaryDark,
              colors.primaryDark,
              colors.primaryLight,
            ]}
            locations={[0, 0.65, 1]}
            className="pt-16 px-4"
          >
            {children}
          </LinearGradient>
        </View>
      );
    }
    return <View className={`${className} pt-16 px-4`}>{children}</View>;
  };

  const DateText = ({ className = "" }: { className?: string }) => {
    return (
      <Text
        className={`${className} effra-regular text-base opacity-80 ${textColor}`}
      >
        {isToday
          ? t("today")
          : date.toLocaleDateString(`${isRTL ? "ar" : "en-US"}`, {
              weekday: "short",
            }) + " "}
        {date
          .toLocaleDateString("en-US", { day: "2-digit", month: "2-digit" })
          .replace("/", ".")}
      </Text>
    );
  };

  return (
    <ParentContainer>
      {showBGImage && (
        <HeaderBgIcon
          svgProps={{
            style: {
              position: "absolute",
              top: -70,
              left: -70,
              zIndex: 50,
              opacity: color === HeaderColor.primary ? 0.6 : 0.3,
            },
          }}
        />
      )}
      <View style={{ zIndex: 50 }}>
        <View
          className={`flex justify-center ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          {showBackButton && (
            <Pressable
              className="mx-4 items-center justify-center"
              onPress={() => {
                if (customBackPath) {
                  router.push({
                    pathname: customBackPath as RelativePathString,
                    params: customBackParams,
                  });
                } else {
                  router.back();
                }
              }}
              hitSlop={14} // extra invisible touch area around the button
              style={({ pressed }) => ({
                width: 58, // bigger touch box
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                transform: [{ scale: pressed ? 0.9 : 1 }], // responsive snap
              })}
            >
              <Arrow
                direction={isRTL ? "right" : "left"}
                stroke={color === HeaderColor.primary ? "white" : "black"}
              />
            </Pressable>
          )}
          <View className="flex-1 justify-center">
            {title ? (
              <>
                <Text
                  className={`effra-medium text-2xl text-center ${textColor}`}
                >
                  {title}
                </Text>
                {customDescription ? (
                  <Text className="font-inter-light text-xs text-center">
                    {customDescription}
                  </Text>
                ) : (
                  <DateText className="text-center" />
                )}
              </>
            ) : (
              <>
                <View
                  className={`flex-row items-center ${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Pressable
                    onPress={() => router.push("/settings")}
                    hitSlop={16} // generous invisible area around the whole block
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6, // increases tap area vertically
                      paddingHorizontal: 8, // increases tap area horizontally
                      borderRadius: 999, // makes hit area rounded, feels like a pill
                    }}
                  >
                    {profilePicture !== undefined &&
                      (profilePicture !== "" ? (
                        // Avatar with real profile picture
                        <Image
                          source={{ uri: profilePicture }}
                          className="w-[40px] h-[40px] rounded-full mx-4"
                        />
                      ) : (
                        // Default avatar
                        <View className="w-[40px] h-[40px] rounded-full mx-4 items-center justify-center bg-[#E5E5E5]">
                          <ProfilePictureDefaultIcon />
                        </View>
                      ))}

                    <View>
                      <Text
                        className={`effra-medium text-2xl text-start ${textColor}`}
                      >
                        {name}
                      </Text>
                      {customDescription ? (
                        <Text className="font-inter-light text-xs text-start">
                          {customDescription}
                        </Text>
                      ) : (
                        <DateText className="text-start" />
                      )}
                    </View>
                  </Pressable>
                </View>
              </>
            )}
          </View>
          {showCalendarIcon ? (
            <TouchableOpacity
              className="bg-white w-[48px] h-[48px] rounded-full items-center justify-center mx-4"
              onPress={showDatePickerModal}
            >
              <CalendarIcon />
            </TouchableOpacity>
          ) : (
            <View className="w-[48px] h-[48px]" />
          )}
        </View>

        {showDateSelector && (
          <HeaderDateSelector
            selectedDate={date}
            onDateSelect={setDate}
            color={color}
            disableFutureDates={disableFutureDates}
          />
        )}
      </View>
      {notification && (
        <View
          style={{ zIndex: 50 }}
          className={`items-center justify-between mx-10 my-7 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          {notification.icon ? (
            <View className="w-[45px] h-[45px] rounded-full bg-white items-center justify-center">
              {notification.icon}
            </View>
          ) : (
            <></>
          )}
          <View>
            <Text className="effra-medium text-base text-white">
              {notification.title}
            </Text>
            <Text className="effra-light text-sm text-white">
              {notification.message}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push(notification.path as RelativePathString)}
          >
            <ArrowBig direction={isRTL ? "left" : "right"} />
          </TouchableOpacity>
        </View>
      )}
      {/* iOS: Use DatePickerModal */}
      {Platform.OS === "ios" && (
        <DatePickerModal
          visible={showDatePicker}
          date={date}
          onChange={handleDateChange}
          onClose={closeDatePicker}
          maximumDate={disableFutureDates ? new Date() : undefined}
        />
      )}

      {/* Android: Use DateTimePicker directly */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          maximumDate={disableFutureDates ? new Date() : undefined}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (event.type === "set" && selectedDate) {
              handleDateChange(selectedDate);
            }
          }}
        />
      )}
    </ParentContainer>
  );
}
