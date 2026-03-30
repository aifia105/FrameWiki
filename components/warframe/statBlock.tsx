import { Text, View } from "react-native";

export function StatBlock({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View className="basis-[31%] items-center gap-0.5 rounded-xl border border-stone-200 bg-white p-3">
      <Text className="text-[20px] font-extrabold tracking-tight text-stone-900">
        {value || "—"}
      </Text>
      <Text className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
        {label}
      </Text>
    </View>
  );
}
