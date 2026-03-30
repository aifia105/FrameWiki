import { Warframe } from "@/hooks/use-warframes";
import { Image, Pressable, Text, View } from "react-native";
import { Stat } from "./stat";

export function WarframeCard({
  item,
  onPress,
}: {
  item: Warframe;
  onPress: () => void;
}) {
  const isPrime = item.name.includes("Prime");
  return (
    <Pressable
      onPress={onPress}
      className="flex-row overflow-hidden rounded-2xl border border-stone-200 bg-white"
      style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
    >
      <View className="w-24 items-center justify-center bg-stone-900 p-2">
        <Image
          source={{ uri: item.thumbnail }}
          className="h-[100px] w-[84px]"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 gap-1.5 p-3">
        <View className="flex-row items-center justify-between gap-1.5">
          <Text
            className="flex-1 text-base font-bold tracking-tight text-stone-900"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          {isPrime && (
            <View className="rounded-full bg-amber-100 px-2 py-0.5">
              <Text className="text-[10px] font-bold tracking-wide text-amber-900">
                PRIME
              </Text>
            </View>
          )}
        </View>
        <Text className="text-xs leading-4.5 text-stone-600" numberOfLines={2}>
          {item.description}
        </Text>
        <View className="mt-0.5 flex-row gap-3">
          <Stat label="HP" value={item.health} />
          <Stat label="SHD" value={item.shield} />
          <Stat label="ARM" value={item.armor} />
          <Stat label="NRG" value={item.power} />
        </View>
      </View>
    </Pressable>
  );
}
