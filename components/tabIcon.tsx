import { Text, View } from "react-native";

export function TabIcon({
  focused,
  label,
  emoji,
}: {
  focused: boolean;
  label: string;
  emoji: string;
}) {
  return (
    <View
      className={`flex-row items-center gap-1 rounded-full px-3.5 py-2 ${focused ? "bg-stone-900" : ""}`}
    >
      <Text className="text-base">{emoji}</Text>
      {focused && (
        <Text className="text-[13px] font-semibold tracking-[0.2px] text-stone-50">
          {label}
        </Text>
      )}
    </View>
  );
}
