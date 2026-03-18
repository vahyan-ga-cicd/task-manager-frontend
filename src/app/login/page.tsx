"use client";
import Login from "@/components/login/Login";
import { useAuthContext } from "@/context/AuthContext";
// import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function LoginPage() {
    const { authenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {

    if (!loading && authenticated) {
      router.replace("/");
    }

  }, [authenticated, loading, router]);

  if (loading) return <p>Loading...</p>;

  return <Login />;

 
}
