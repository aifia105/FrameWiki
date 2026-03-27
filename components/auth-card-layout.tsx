import React, { type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

type AuthCardLayoutProps = {
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
};

export function AuthCardLayout({
  title,
  subtitle,
  footer,
  children,
}: AuthCardLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#EAEFEF] ">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-5 py-10">
            <View className="mb-6">
              <Text className="text-2xl font-bold uppercase tracking-[1px] text-gray-500 text-center mb-7">
                FrameWiki
              </Text>
              <Text className="text-2xl font-bold leading-10 text-gray-900 mb-2">
                {title}
              </Text>
              {subtitle ? (
                <Text className="text-base leading-6 text-gray-600">
                  {subtitle}
                </Text>
              ) : null}
            </View>

            <View className="gap-3 rounded-2xl border border-gray-200 bg-white p-5">
              {children}
            </View>

            {footer ? (
              <View className="mt-4 items-center">{footer}</View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
