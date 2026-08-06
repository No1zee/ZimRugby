"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import { FanProfile, getLocalFanProfile, signOutFan as performSignOut } from "@/lib/supabase/auth";

interface AuthContextType {
  user: FanProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInFan: (profile: FanProfile) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signInFan: () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FanProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initial hydration from local profile / Supabase Auth session
    const local = getLocalFanProfile();
    if (local) {
      setUser(local);
    }

    // 2. Subscribe to Supabase auth state change (onAuthStateChange)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        const profile: FanProfile = {
          email: session.user.email || "",
          name: meta.full_name || meta.name || session.user.email?.split("@")[0] || "VIP Fan",
          favoriteTeam: meta.favorite_team || "Sables",
          vipCode: meta.vip_code || "SABLES2027",
        };
        setUser(profile);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
      setIsLoading(false);
    });

    setIsLoading(false);

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signInFan = (profile: FanProfile) => {
    setUser(profile);
  };

  const signOut = async () => {
    await performSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signInFan,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
