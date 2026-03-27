import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: "Please enter a valid email address" };
      }

      // Validate password
      if (password.length < 6) {
        return { error: "Password must be at least 6 characters" };
      }

      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem("users");
      const users = existingUsers ? JSON.parse(existingUsers) : {};

      if (users[email]) {
        return { error: "An account with this email already exists" };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
      };

      // Hash password (simple approach - in production use proper bcrypt)
      users[email] = {
        id: newUser.id,
        password: btoa(password), // Simple base64 encoding for demo
      };

      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);

      return {};
    } catch (error) {
      return { error: "Sign up failed" };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const existingUsers = await AsyncStorage.getItem("users");
      const users = existingUsers ? JSON.parse(existingUsers) : {};

      if (!users[email]) {
        return { error: "No account found with this email" };
      }

      const storedPassword = users[email].password;
      const hashedPassword = btoa(password);

      if (storedPassword !== hashedPassword) {
        return { error: "Invalid password" };
      }

      const newUser: User = {
        id: users[email].id,
        email,
      };

      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);

      return {};
    } catch (error) {
      return { error: "Sign in failed" };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
