import { Text, View } from "react-native";
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-3 px-5 pt-6">
      <Text className="text-[11px] font-bold uppercase tracking-[1.2px] text-stone-400">
        {title}
      </Text>
      {children}
    </View>
  );
}
