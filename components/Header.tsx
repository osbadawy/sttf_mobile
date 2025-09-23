import colors from "@/colors";
import { useLocalization } from "@/contexts/LocalizationContext";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import HeaderDateSelector from "./HeaderDateSelector";
import {
  Arrow,
  ArrowBig,
  HeaderBgIcon,
  ProfilePictureDefaultIcon,
} from "./icons";
import CalendarIcon from "./icons/CalendarIcon";

export enum HeaderColor {
  BG,
  primary,
}

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
  backLink?: RelativePathString;
  color?: HeaderColor;
  notification?: HeaderNotification;
  useDateState: [Date, (date: Date) => void];
}

export default function Header({
  title,
  name,
  profilePicture,
  showDateSelector,
  backLink,
  color = HeaderColor.BG,
  notification,
  useDateState,
}: HeaderProps) {
  /**
   * Header is on Z-index 50 and 60
   *
   * Either pass the title, or name, but not both
   */
  if (!!title === !!name)
    throw new Error("Exactly one of 'title' or 'name' must be provided");

  const [date, setDate] = useDateState;
  // const isToday = date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  const isToday = false;
  const { t, isRTL } = useLocalization("common");

  const textColor = color === HeaderColor.primary ? "text-white" : "text-black";


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
            })}{" "}
        {date
          .toLocaleDateString("en-US", { day: "2-digit", month: "2-digit" })
          .replace("/", ".")}
      </Text>
    );
  };

  return (
    <ParentContainer>
      <HeaderBgIcon
        svgProps={{
          style: {
            position: "absolute",
            top: -50,
            left: -50,
            zIndex: 50,
            filter: "blur(4px)",
            opacity: color === HeaderColor.primary ? 1 : 0.4,
          },
        }}
      />
      <View style={{ zIndex: 50 }}>
        <View
          className={`flex justify-center ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          {backLink && (
            <TouchableOpacity
              className="flex mx-4 items-center justify-center"
              onPress={() => router.push(backLink as RelativePathString)}
            >
              <Arrow
                direction={isRTL ? "right" : "left"}
                stroke={color === HeaderColor.primary ? "white" : "black"}
              />
            </TouchableOpacity>
          )}
          <View className="flex-1 justify-center">
            {title ? (
              <>
                <Text
                  className={`effra-medium text-2xl text-center ${textColor}`}
                >
                  {title}
                </Text>
                <DateText className="text-center" />
              </>
            ) : (
              <>
                <View
                  className={`flex-row items-center ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                >
                  {profilePicture !== undefined &&
                    (profilePicture !== "" ? (
                      <Image
                        source={{ uri: profilePicture }}
                        className="w-[40px] h-[40px] rounded-full mx-4"
                      />
                    ) : (
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
                    <DateText className="text-start" />
                  </View>
                </View>
              </>
            )}
          </View>
          <View className="bg-white w-[48px] h-[48px] rounded-full items-center justify-center mx-4">
            <CalendarIcon />
          </View>
        </View>

        {showDateSelector && (
          <HeaderDateSelector
            selectedDate={date}
            onDateSelect={setDate}
            color={color}
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
    </ParentContainer>
  );
}
