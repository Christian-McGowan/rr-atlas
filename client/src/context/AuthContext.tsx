import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { AlertPreferences, AuthUser, Place, SavedLocation } from "../lib/types";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (input: { name: string }) => Promise<void>;
  updatePreferences: (preferences: AlertPreferences) => Promise<void>;
  saveLocation: (place: Place) => Promise<void>;
  removeLocation: (slug: string) => Promise<void>;
};

const TOKEN_STORAGE_KEY = "rr-atlas-auth-token";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toSavedLocation(place: Place): SavedLocation {
  return {
    slug: place.slug,
    label: place.label,
    type: place.type,
    state: place.state,
    center: place.center,
    addedAt: new Date().toISOString()
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(Boolean(token));

  const storeSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const nextUser = await api.authMe(token);
      setUser(nextUser);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession, token]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (input: LoginInput) => {
      const result = await api.login(input);
      storeSession(result.token, result.user);
    },
    [storeSession]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const result = await api.register(input);
      storeSession(result.token, result.user);
    },
    [storeSession]
  );

  const updateProfile = useCallback(
    async (input: { name: string }) => {
      if (!token) throw new Error("You must be signed in to update your profile.");
      const nextUser = await api.updateAccount(token, input);
      setUser(nextUser);
    },
    [token]
  );

  const updatePreferences = useCallback(
    async (preferences: AlertPreferences) => {
      if (!token) throw new Error("You must be signed in to update alert preferences.");
      const nextUser = await api.updateAccount(token, { preferences });
      setUser(nextUser);
    },
    [token]
  );

  const saveLocation = useCallback(
    async (place: Place) => {
      if (!token) throw new Error("Create an account or sign in to save this location.");
      const nextUser = await api.saveLocation(token, toSavedLocation(place));
      setUser(nextUser);
    },
    [token]
  );

  const removeLocation = useCallback(
    async (slug: string) => {
      if (!token) throw new Error("You must be signed in to remove saved locations.");
      const nextUser = await api.removeLocation(token, slug);
      setUser(nextUser);
    },
    [token]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout: clearSession,
      refreshUser,
      updateProfile,
      updatePreferences,
      saveLocation,
      removeLocation
    }),
    [clearSession, loading, login, refreshUser, register, removeLocation, saveLocation, token, updatePreferences, updateProfile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
