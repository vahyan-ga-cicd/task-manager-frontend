"use client";
import { IUser } from "@/@types/interface/admin.interfaces";
import { useAuthContext } from "@/context/AuthContext";
import { getallusers } from "@/utils/api/admin/admin";
import { useRouter } from "next/navigation";
// import getallusers from "@/pages/api/admin/admin";
// import { getallusers } from "@/pages/api/admin/admin";
import {  useEffect, useState } from "react";

export const useAdmin = () => {
    const [users, setUsers] = useState<IUser[]>([]);
  const fetchAllUsers = async () => {
    try {
      const users = await getallusers();
        setUsers(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  };
 useEffect(() => {
   fetchAllUsers();
 }, [])
 
  return {  users,fetchAllUsers };
};


export function RequireRole({ roleRequired, children }: any) {
  const { role, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== roleRequired) {
      router.replace("/login");
    }
  }, [role, loading]);

  if (loading || role !== roleRequired) return null;

  return children;
}