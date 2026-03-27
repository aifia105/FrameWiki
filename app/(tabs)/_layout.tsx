import { Redirect, Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

function TabIcon({
  focused,
  label,
  emoji,
}: {
  focused: boolean;
  label: string;
  emoji: string;
}) {
  return (
    <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      {focused && <Text style={styles.tabLabel}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabIconWrapActive: {
    backgroundColor: "#1c1917",
  },
  tabEmoji: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fafaf9",
    letterSpacing: 0.2,
  },
});

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fafaf9",
          borderTopColor: "#e7e5e4",
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Home" emoji="🏠" />
          ),
        }}
      />
    </Tabs>
  );
}
