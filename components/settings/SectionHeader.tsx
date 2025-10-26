import { Text } from "react-native";

type Props = { title: string };

export default function SectionHeader({ title }: Props) {
  return <Text className="text-sm font-semibold text-neutral-700">{title}</Text>;
}
