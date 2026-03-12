"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/api/auth";

export interface UserData {
  data: {
    task_data: {
      completed_tasks: number;
      pending_tasks: number;
      ongoing_tasks: number;
      tasks_count: number;
    };

    user_data: {
      id: string;
      username: string;
      email: string;
    };
  };
}

interface AuthContextType {
  userData: UserData | null;
  authenticated: boolean;
  loading: boolean;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      const res = await getUser();

      setUserData(res);
      setAuthenticated(true);
    } catch (err) {
      console.log("Not authenticated", err);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUserData(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ userData, authenticated, loading, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
