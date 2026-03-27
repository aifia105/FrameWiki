import { useWarframe } from "@/hooks/use-warframes";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function StatBlock({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statBlockValue}>{value || "—"}</Text>
      <Text style={styles.statBlockLabel}>{label}</Text>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | undefined;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{String(value)}</Text>
    </View>
  );
}

export default function WarframePage() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const { data: frame, loading, error } = useWarframe(name ?? "");

  const isPrime = frame?.name?.includes("Prime");

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back button */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Warframes</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1c1917" />
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && frame && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroImageWrap}>
              <Image
                source={{ uri: frame.thumbnail }}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.heroInfo}>
              <View style={styles.heroNameRow}>
                <Text style={styles.heroName}>{frame.name}</Text>
                {isPrime && (
                  <View style={styles.primeBadge}>
                    <Text style={styles.primeBadgeText}>PRIME</Text>
                  </View>
                )}
              </View>
              {frame.introduced?.name && (
                <Text style={styles.heroSub}>
                  Update {frame.introduced.name}
                </Text>
              )}
              <Text style={styles.heroDesc} numberOfLines={4}>
                {frame.description}
              </Text>
            </View>
          </View>

          {/* Base stats grid */}
          <Section title="Base Stats">
            <View style={styles.statsGrid}>
              <StatBlock label="Health" value={frame.health} />
              <StatBlock label="Shield" value={frame.shield} />
              <StatBlock label="Armor" value={frame.armor} />
              <StatBlock label="Energy" value={frame.power} />
              <StatBlock label="Speed" value={frame.speed} />
              <StatBlock label="MR" value={frame.mr} />
            </View>
          </Section>

          {/* Prime stats — only if different */}
          {isPrime ||
          (frame.prime_health && frame.prime_health !== frame.health) ? (
            <Section title="Prime Stats">
              <View style={styles.statsGrid}>
                {frame.prime_health ? (
                  <StatBlock label="Health" value={frame.prime_health} />
                ) : null}
                {frame.prime_shield ? (
                  <StatBlock label="Shield" value={frame.prime_shield} />
                ) : null}
                {frame.prime_armor ? (
                  <StatBlock label="Armor" value={frame.prime_armor} />
                ) : null}
                {frame.prime_power ? (
                  <StatBlock label="Energy" value={frame.prime_power} />
                ) : null}
                {frame.prime_speed ? (
                  <StatBlock label="Speed" value={frame.prime_speed} />
                ) : null}
                {frame.prime_mr ? (
                  <StatBlock label="MR" value={frame.prime_mr} />
                ) : null}
              </View>
            </Section>
          ) : null}

          {/* Details */}
          <Section title="Details">
            <View style={styles.detailsCard}>
              <Row label="Aura" value={frame.aura} />
              {frame.prime_aura && frame.prime_aura !== frame.aura && (
                <Row label="Prime Aura" value={frame.prime_aura} />
              )}
              <Row label="Type" value={frame.type} />
              <Row label="Tradable" value={frame.tradable ? "Yes" : "No"} />
              <Row label="Location" value={frame.location} />
              {frame.introduced?.date && (
                <Row label="Introduced" value={frame.introduced.date} />
              )}
            </View>
          </Section>

          {/* Polarities */}
          {frame.polarities?.length > 0 && (
            <Section title="Polarities">
              <View style={styles.polaritiesRow}>
                {frame.polarities.map((p, i) => (
                  <View key={i} style={styles.polarityPill}>
                    <Text style={styles.polarityText}>{p}</Text>
                  </View>
                ))}
              </View>
            </Section>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fafaf9" },

  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e7e5e4",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  backArrow: { fontSize: 20, color: "#1c1917", lineHeight: 22 },
  backText: { fontSize: 15, fontWeight: "600", color: "#1c1917" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { fontSize: 14, color: "#a8a29e" },
  errorText: { fontSize: 14, color: "#dc2626" },

  scroll: { paddingBottom: 48 },

  // Hero
  hero: {
    backgroundColor: "#1c1917",
    flexDirection: "row",
    padding: 20,
    gap: 16,
    alignItems: "flex-start",
  },
  heroImageWrap: {
    width: 120,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#292524",
    borderRadius: 12,
    padding: 8,
  },
  heroImage: { width: 104, height: 134 },
  heroInfo: { flex: 1, gap: 6, paddingTop: 4 },
  heroNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  heroName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fafaf9",
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#78716c",
    letterSpacing: 0.3,
  },
  heroDesc: { fontSize: 13, lineHeight: 19, color: "#a8a29e", marginTop: 2 },
  primeBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  primeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#92400e",
    letterSpacing: 0.5,
  },

  // Section
  section: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#a8a29e",
  },

  // Stats grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statBlock: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e7e5e4",
    padding: 12,
    alignItems: "center",
    gap: 2,
  },
  statBlockValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1c1917",
    letterSpacing: -0.5,
  },
  statBlockLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#a8a29e",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  // Details card
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e7e5e4",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f5f5f4",
  },
  rowLabel: { fontSize: 14, color: "#78716c", fontWeight: "500" },
  rowValue: {
    fontSize: 14,
    color: "#1c1917",
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },

  // Polarities
  polaritiesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  polarityPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e7e5e4",
  },
  polarityText: { fontSize: 13, fontWeight: "600", color: "#44403c" },
});
