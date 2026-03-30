import { Text, View } from "react-native";

export function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center">
      <Text className="text-sm font-bold text-stone-900">{value ?? "-"}</Text>
      <Text className="text-[10px] font-semibold tracking-wide text-stone-400">
        {label}
      </Text>
    </View>
  );
}
