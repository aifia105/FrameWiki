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
  StyleSheet,
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
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardImageWrap}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          {isPrime && (
            <View style={styles.primeBadge}>
              <Text style={styles.primeBadgeText}>PRIME</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.statsRow}>
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
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>FrameWiki</Text>
          <Text style={styles.title}>Welcome, {name}</Text>
        </View>
        <Pressable
          onPress={() => signOut()}
          style={({ pressed }) => [
            styles.signOutBtn,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Warframes…"
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
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                activeFilter === f && styles.chipTextActive,
              ]}
            >
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Count */}
      {!loading && (
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {filtered.length} {filtered.length === 1 ? "frame" : "frames"}
          </Text>
        </View>
      )}

      {/* States */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1c1917" />
          <Text style={styles.loadingText}>Loading Warframes…</Text>
        </View>
      )}
      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* List */}
      {!loading && !error && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.uniqueName}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>◎</Text>
              <Text style={styles.emptyText}>No Warframes found.</Text>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fafaf9" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#a8a29e",
    marginBottom: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1c1917",
    letterSpacing: -0.5,
  },
  signOutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#d6d3d1",
    backgroundColor: "#fff",
  },
  signOutText: { fontSize: 13, fontWeight: "600", color: "#78716c" },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e7e5e4",
    gap: 8,
  },
  searchIcon: { fontSize: 18, color: "#a8a29e", marginTop: -1 },
  searchInput: { flex: 1, fontSize: 15, color: "#1c1917" },

  filtersRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#f5f5f4",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e7e5e4",
  },
  chipActive: { backgroundColor: "#1c1917", borderColor: "#1c1917" },
  chipText: { fontSize: 13, fontWeight: "500", color: "#78716c" },
  chipTextActive: { color: "#fafaf9" },

  countRow: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "#a8a29e",
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontSize: 14, color: "#a8a29e", fontWeight: "500" },
  errorText: { fontSize: 14, color: "#dc2626", fontWeight: "500" },

  list: { paddingHorizontal: 20, paddingBottom: 32 },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e7e5e4",
    overflow: "hidden",
  },
  cardPressed: { backgroundColor: "#f5f5f4" },
  cardImageWrap: {
    width: 100,
    backgroundColor: "#1c1917",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  cardImage: { width: 84, height: 100 },
  cardBody: { flex: 1, padding: 12, gap: 6 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  cardName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1c1917",
    letterSpacing: -0.2,
  },
  primeBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  primeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#92400e",
    letterSpacing: 0.4,
  },
  cardDesc: { fontSize: 12, lineHeight: 17, color: "#78716c" },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 2 },
  stat: { alignItems: "center", gap: 1 },
  statValue: { fontSize: 13, fontWeight: "700", color: "#1c1917" },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#a8a29e",
    letterSpacing: 0.3,
  },

  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyIcon: { fontSize: 32, color: "#d6d3d1" },
  emptyText: { fontSize: 15, color: "#a8a29e", fontWeight: "500" },
});
