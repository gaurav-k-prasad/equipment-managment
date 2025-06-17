
"use client";

import type { User } from "firebase/auth";
import type { UserProfile } from "@/types";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthContextType {
  // No user-specific data will be provided.
  // We keep isAdmin for now, defaulting to a state that allows access for a demo-like experience
  // or it can be removed if no part of the app strictly needs a non-functional isAdmin.
  // For now, let's assume no admin-like restrictions are needed.
  loading: boolean; // A generic loading might still be useful for app shell.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true); // Simulate app loading briefly

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200); // Short delay to mimic loading
    return () => clearTimeout(timer);
  }, []);


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  // Return a structure that won't break components expecting isAdmin or userProfile,
  // but signifies no actual auth.
  return { ...context, currentUser: null, userProfile: null, isAdmin: true }; // Default to isAdmin: true to make all features accessible
}
