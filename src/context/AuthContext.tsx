"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/api/auth";
// import { getUser } from "@/pages/api/auth";

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

  // console.log("Context", localStorage.getItem("token"));
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    try {
      // console.log(token);

      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      const res = await getUser();

      setUserData(res);
      setAuthenticated(true);
    } catch (error) {
      console.log("Auth failed:", error);
      // setAuthenticated(false);
      // localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
}
