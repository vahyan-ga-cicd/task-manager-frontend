import { IUser } from "@/@types/interface/admin.interfaces";
import { getallusers } from "@/pages/api/admin/admin";
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
 
  return {  users };
};
