"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface UserData {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  mobile: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  userRole: string | null;
  userStatus: string | null;
  logout: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (cancelled) return;

        if (response.ok) {
          const data = await response.json();
          if (cancelled) return;

          const userData: UserData = {
            uid: data.user.uid,
            email: data.user.email || null,
            name: data.user.name || null,
            photoURL: data.user.photoURL || null,
            mobile: data.user.mobile || "",
            role: data.user.role || "user",
            status: data.user.status || "active",
          };

          setUser(userData);
          setUserRole(userData.role);
          setUserStatus(userData.status);
        } else {
          setUser(null);
          setUserRole(null);
          setUserStatus(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Auth check error:", error);
          setUser(null);
          setUserRole(null);
          setUserStatus(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [refetchIndex]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setUserRole(null);
      setUserStatus(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refetch = useCallback(() => {
    setLoading(true);
    setRefetchIndex((i) => i + 1);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, userRole, userStatus, refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
