import { Text } from "react-native";

type Props = { title: string; isRTL: boolean };

export default function SectionHeader({ title, isRTL }: Props) {
  return (
    <Text className="text-sm font-semibold text-neutral-700">{title}</Text>
  );
}
