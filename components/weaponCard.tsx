import { Weapon } from "@/hooks/use-weapons";
import { Image, Text, View } from "react-native";
import { Stat } from "./stat";

export function WeaponCard({ item }: { item: Weapon }) {
  return (
    <View className="flex-row overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <View className="w-24 items-center justify-center bg-stone-900 p-2">
        {item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            className="h-[100px] w-[84px]"
            resizeMode="contain"
          />
        ) : (
          <Text className="text-xs font-semibold uppercase tracking-wider text-stone-300">
            Weapon
          </Text>
        )}
      </View>
      <View className="flex-1 gap-1.5 p-3">
        <View className="flex-row items-center justify-between gap-1.5">
          <Text
            className="flex-1 text-base font-bold tracking-tight text-stone-900"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View className="rounded-full bg-stone-100 px-2 py-0.5">
            <Text className="text-[10px] font-bold tracking-wide text-stone-700">
              {item.type}
            </Text>
          </View>
        </View>
        <Text className="text-xs leading-4.5 text-stone-600" numberOfLines={2}>
          {item.description || "No description available."}
        </Text>
        <View className="mt-0.5 flex-row gap-3">
          <Stat label="MR" value={item.masteryReq} />
          <Stat label="DMG" value={item.totalDamage} />
          <Stat label="CRIT" value={item.criticalChance} />
          <Stat label="ACC" value={item.accuracy} />
        </View>
      </View>
    </View>
  );
}
