import { Redirect, Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { TabIcon } from "@/components/tabIcon";
import { useAuth } from "@/contexts/auth-context";

export default function TabLayout() {
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
