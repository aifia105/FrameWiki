import { Text, View } from "react-native";
export function Row({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | undefined;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <View className="flex-row items-center justify-between border-b border-stone-100 px-3.5 py-2.5">
      <Text className="text-sm font-medium text-stone-500">{label}</Text>
      <Text className="max-w-[60%] text-right text-sm font-semibold text-stone-900">
        {String(value)}
      </Text>
    </View>
  );
}
