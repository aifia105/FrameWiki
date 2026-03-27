import { useAuth } from "@/contexts/auth-context";
import { useWarframes, type Warframe } from "@/hooks/use-warframes";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const FILTERS = ["All", "Warframe", "Prime", "Archwing"];

function WarframeCard({
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center">
      <Text className="text-sm font-bold text-stone-900">{value ?? "-"}</Text>
      <Text className="text-[10px] font-semibold tracking-wide text-stone-400">
        {label}
      </Text>
    </View>
  );
}

export default function Page() {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const { data, loading, error } = useWarframes();
  const name = (user?.email ?? "Tenno").split("@")[0];

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    return data.filter((w) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Prime" && w.name.includes("Prime")) ||
        (activeFilter === "Warframe" &&
          !w.name.includes("Prime") &&
          w.type === "Warframe") ||
        (activeFilter === "Archwing" && w.type === "Archwing");
      const matchesQuery =
        !query ||
        w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.description?.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [data, query, activeFilter]);

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      {/* Header */}
      <View className="flex-row items-end justify-between px-5 pb-4 pt-5">
        <View>
          <Text className="mb-0.5 text-[11px] font-bold uppercase tracking-widest text-stone-400">
            FrameWiki
          </Text>
          <Text className="text-3xl font-black tracking-tight text-stone-900">
            Welcome, {name}
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

      {/* Search */}
      <View className="mx-5 mb-3.5 flex-row items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3.5 py-2.5">
        <Text className="text-lg text-stone-400">⌕</Text>
        <TextInput
          className="flex-1 text-sm text-stone-900"
          placeholder="Search Warframes..."
          placeholderTextColor="#a8a29e"
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 8,
          paddingBottom: 4,
        }}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 ${
              activeFilter === f
                ? "border-stone-900 bg-stone-900"
                : "border-stone-200 bg-stone-100"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${activeFilter === f ? "text-stone-50" : "text-stone-600"}`}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Count */}
      {!loading && (
        <View className="px-5 pb-2 pt-3.5">
          <Text className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            {filtered.length} {filtered.length === 1 ? "frame" : "frames"}
          </Text>
        </View>
      )}

      {/* States */}
      {loading && (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#1c1917" />
          <Text className="text-sm font-medium text-stone-400">
            Loading Warframes...
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

      {/* List */}
      {!loading && !error && (
        <FlatList
          data={filtered}
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
      )}
    </SafeAreaView>
  );
}
