import { AuthCardLayout } from "@/components/auth-card-layout";
import { useAuth } from "@/contexts/auth-context";
import { type Href, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, TextInput } from "react-native";

export default function Page() {
  const { signIn, isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const isSubmitDisabled = !emailAddress || !password || isLoading;

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);
    const result = await signIn(emailAddress, password);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace("/(tabs)" as Href);
  };

  if (isSignedIn) {
    return null;
  }

  return (
    <AuthCardLayout
      title="Sign in"
      subtitle="Access your workspace and continue building."
      footer={
        <Pressable
          className="mt-3 flex-row items-center gap-1"
          onPress={() => router.push("/(auth)/sign-up" as Href)}
        >
          <Text className="text-base text-gray-700">
            Do not have an account?{" "}
          </Text>
          <Text className="text-base font-semibold text-cyan-700">Sign up</Text>
        </Pressable>
      }
    >
      <Text className="text-sm font-semibold text-gray-900">Email address</Text>
      <TextInput
        className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
        editable={!isLoading}
      />
      <Text className="text-sm font-semibold text-gray-900">Password</Text>
      <TextInput
        className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666666"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        editable={!isLoading}
      />
      <Pressable
        className="mt-2 items-center rounded-lg bg-gray-900 px-6 py-3"
        style={({ pressed }) => [
          { opacity: pressed || isSubmitDisabled ? 0.6 : 1 },
        ]}
        onPress={handleSubmit}
        disabled={isSubmitDisabled}
      >
        <Text className="font-semibold text-white">Continue</Text>
      </Pressable>
      {error && <Text className="-mt-2 text-xs text-red-700">{error}</Text>}
    </AuthCardLayout>
  );
}
