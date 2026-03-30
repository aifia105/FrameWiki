import { Row } from "@/components/warframe/row";
import { Section } from "@/components/warframe/section";
import { StatBlock } from "@/components/warframe/statBlock";
import { useWarframe } from "@/hooks/use-warframes";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WarframePage() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const { data: frame, loading, error } = useWarframe(name ?? "");

  const isPrime = frame?.name?.includes("Prime");

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <View className="border-b border-stone-200 px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-1.5 self-start"
          style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
        >
          <Text className="text-[30px] leading-[30px] text-stone-900">←</Text>
          <Text className="text-[15px] font-semibold text-stone-900">
            Warframes
          </Text>
        </Pressable>
      </View>

      {loading && (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#1c1917" />
          <Text className="text-sm text-stone-400">Loading...</Text>
        </View>
      )}

      {error && (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-sm text-red-600">{error}</Text>
        </View>
      )}

      {!loading && !error && frame && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          <View className="flex-row items-start gap-4 bg-stone-900 p-5">
            <View className="h-[150px] w-[120px] items-center justify-center rounded-xl bg-stone-800 p-2">
              <Image
                source={{ uri: frame.thumbnail }}
                className="h-[134px] w-[104px]"
                resizeMode="contain"
              />
            </View>
            <View className="flex-1 gap-1.5 pt-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-2xl font-extrabold tracking-tight text-stone-50">
                  {frame.name}
                </Text>
                {isPrime && (
                  <View className="rounded-full bg-amber-100 px-2 py-0.5">
                    <Text className="text-[10px] font-bold tracking-wide text-amber-800">
                      PRIME
                    </Text>
                  </View>
                )}
              </View>
              {frame.introduced?.name && (
                <Text className="text-xs font-semibold tracking-[0.3px] text-stone-500">
                  Update {frame.introduced.name}
                </Text>
              )}
              <Text
                className="mt-0.5 text-[13px] leading-5 text-stone-400"
                numberOfLines={4}
              >
                {frame.description}
              </Text>
            </View>
          </View>

          <Section title="Base Stats">
            <View className="flex-row flex-wrap gap-2.5">
              <StatBlock label="Health" value={frame.health} />
              <StatBlock label="Shield" value={frame.shield} />
              <StatBlock label="Armor" value={frame.armor} />
              <StatBlock label="Energy" value={frame.power} />
              <StatBlock label="Speed" value={frame.speed} />
              <StatBlock label="MR" value={frame.mr} />
            </View>
          </Section>

          {isPrime ||
          (frame.prime_health && frame.prime_health !== frame.health) ? (
            <Section title="Prime Stats">
              <View className="flex-row flex-wrap gap-2.5">
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

          <Section title="Details">
            <View className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
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

          {frame.polarities?.length > 0 && (
            <Section title="Polarities">
              <View className="flex-row flex-wrap gap-2">
                {frame.polarities.map((p, i) => (
                  <View
                    key={`${p}-${i}`}
                    className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5"
                  >
                    <Text className="text-[13px] font-semibold text-stone-700">
                      {p}
                    </Text>
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
