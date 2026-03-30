import { WarframeCard } from "@/components/warframeCard";
import { WeaponCard } from "@/components/weaponCard";
import { useAuth } from "@/contexts/auth-context";
import { useWarframes } from "@/hooks/use-warframes";
import { useWeapons } from "@/hooks/use-weapons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WARFRAME_FILTERS = ["All", "Warframe", "Prime", "Archwing"];
const WEAPON_FILTERS = ["All", "Primary", "Secondary", "Melee"];

export default function Page() {
  const { signOut } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [warframeFilter, setWarframeFilter] = useState("All");
  const [weaponFilter, setWeaponFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"warframes" | "weapons">(
    "warframes",
  );
  const {
    data: warframeData,
    loading: warframesLoading,
    error: warframesError,
  } = useWarframes();
  const {
    data: weaponData,
    loading: weaponsLoading,
    error: weaponsError,
  } = useWeapons(activeTab === "weapons");

  const filteredWarframes = useMemo(() => {
    return warframeData.filter((w) => {
      const matchesFilter =
        warframeFilter === "All" ||
        (warframeFilter === "Prime" && w.name.includes("Prime")) ||
        (warframeFilter === "Warframe" &&
          !w.name.includes("Prime") &&
          w.type === "Warframe") ||
        (warframeFilter === "Archwing" && w.type === "Archwing");
      const matchesQuery =
        !query ||
        w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.description?.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [warframeData, query, warframeFilter]);

  const filteredWeapons = useMemo(() => {
    return weaponData.filter((w) => {
      const matchesFilter =
        weaponFilter === "All" ||
        w.type.toLowerCase().includes(weaponFilter.toLowerCase());
      const matchesQuery =
        !query ||
        w.name.toLowerCase().includes(query.toLowerCase()) ||
        (w.description ?? "").toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [weaponData, query, weaponFilter]);

  const isWarframesTab = activeTab === "warframes";
  const activeFilters = isWarframesTab ? WARFRAME_FILTERS : WEAPON_FILTERS;
  const activeFilter = isWarframesTab ? warframeFilter : weaponFilter;
  const loading = isWarframesTab ? warframesLoading : weaponsLoading;
  const error = isWarframesTab ? warframesError : weaponsError;
  const totalCount = isWarframesTab
    ? filteredWarframes.length
    : filteredWeapons.length;

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <View className="flex-row items-end justify-between px-5 pb-4 pt-5">
        <View>
          <Text className="mb-0.5 text-2xl font-bold uppercase tracking-widest text-stone-400">
            FrameWiki
          </Text>
        </View>
        <Pressable
          onPress={() => signOut()}
          className="rounded-lg border border-stone-300 bg-white px-3.5 py-2"
          style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
        >
          <Text className="text-xs font-semibold text-stone-500">Sign out</Text>
        </Pressable>
      </View>

      <View className="mb-3 flex-row px-5">
        <View className="flex-row rounded-xl border border-stone-200 bg-white p-1">
          <Pressable
            onPress={() => {
              setActiveTab("warframes");
              setIsFilterOpen(false);
            }}
            className={`rounded-lg px-4 py-2 ${isWarframesTab ? "bg-stone-900" : "bg-transparent"}`}
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text
              className={`text-xs font-semibold uppercase tracking-wide ${isWarframesTab ? "text-white" : "text-stone-500"}`}
            >
              Warframes
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveTab("weapons");
              setIsFilterOpen(false);
            }}
            className={`rounded-lg px-4 py-2 ${!isWarframesTab ? "bg-stone-900" : "bg-transparent"}`}
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text
              className={`text-xs font-semibold uppercase tracking-wide ${!isWarframesTab ? "text-white" : "text-stone-500"}`}
            >
              Weapons
            </Text>
          </Pressable>
        </View>
      </View>

      <View
        className="relative mx-5 mb-3.5"
        style={{ zIndex: 30, elevation: 30 }}
      >
        <View className="flex-row items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3.5 py-2.5">
          <Text className="text-lg text-stone-400">⌕</Text>
          <TextInput
            className="flex-1 text-sm text-stone-900"
            placeholder={
              isWarframesTab ? "Search Warframes..." : "Search Weapons..."
            }
            placeholderTextColor="#a8a29e"
            value={query}
            onChangeText={setQuery}
            clearButtonMode="while-editing"
          />
          <Pressable
            onPress={() => setIsFilterOpen((prev) => !prev)}
            className="h-8 w-8 items-center justify-center rounded-xl border border-stone-200 bg-stone-100"
            style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
            accessibilityRole="button"
            accessibilityLabel="Open filter options"
          >
            <MaterialIcons name="filter-list" size={16} color="#57534e" />
          </Pressable>
        </View>

        {isFilterOpen && (
          <View
            className="absolute right-0 top-full z-50 mt-1.5 self-end overflow-hidden rounded-xl border border-stone-200 bg-white"
            style={{ elevation: 40 }}
          >
            {activeFilters.map((f) => (
              <Pressable
                key={f}
                onPress={() => {
                  if (isWarframesTab) {
                    setWarframeFilter(f);
                  } else {
                    setWeaponFilter(f);
                  }
                  setIsFilterOpen(false);
                }}
                className={`min-w-36 px-3.5 py-2.5 ${activeFilter === f ? "bg-stone-100" : "bg-white"}`}
                style={({ pressed }) =>
                  pressed ? { opacity: 0.8 } : undefined
                }
              >
                <Text
                  className={`text-xs font-semibold ${activeFilter === f ? "text-stone-900" : "text-stone-600"}`}
                >
                  {f}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {!loading && (
        <View className="px-5 pb-2 pt-3.5">
          <Text className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            {totalCount}{" "}
            {totalCount === 1
              ? isWarframesTab
                ? "frame"
                : "weapon"
              : isWarframesTab
                ? "frames"
                : "weapons"}
          </Text>
        </View>
      )}

      {loading && (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#1c1917" />
          <Text className="text-sm font-medium text-stone-400">
            {isWarframesTab ? "Loading Warframes..." : "Loading Weapons..."}
          </Text>
        </View>
      )}
      {error && (
        <View className="flex-1 items-center justify-center gap-2 px-6">
          <Text className="text-center text-sm font-medium text-red-600">
            {error}
          </Text>
          <Text className="text-center text-xs text-stone-400">
            Check your connection and try again.
          </Text>
        </View>
      )}

      {!loading &&
        !error &&
        (isWarframesTab ? (
          <FlatList
            data={filteredWarframes}
            keyExtractor={(item) => item.uniqueName}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-2.5" />}
            ListEmptyComponent={
              <View className="items-center gap-3 pt-14">
                <Text className="text-3xl text-stone-300">◎</Text>
                <Text className="text-sm font-medium text-stone-400">
                  No Warframes found.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <WarframeCard
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/warframe/[name]",
                    params: { name: item.name },
                  })
                }
              />
            )}
          />
        ) : (
          <FlatList
            data={filteredWeapons}
            keyExtractor={(item) => item.uniqueName}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-2.5" />}
            ListEmptyComponent={
              <View className="items-center gap-3 pt-14">
                <Text className="text-3xl text-stone-300">◎</Text>
                <Text className="text-sm font-medium text-stone-400">
                  No Weapons found.
                </Text>
              </View>
            }
            renderItem={({ item }) => <WeaponCard item={item} />}
          />
        ))}
    </SafeAreaView>
  );
}
