"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Tasks from "@/components/dashboard/tasks/Tasks";
import { useAuthContext } from "@/context/AuthContext";
import {
  Mail,
  LogOut,
  Clock,
  CheckCircle,
  ClipboardList,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
// import { getallusers } from "@/pages/api/admin/admin";
import { useAdmin } from "@/hooks/admin";
// import { getUser } from "@/pages/api/auth";
function UserPage() {
  const { userData, authenticated, loading, logout } = useAuthContext();

  console.log("UserPage render:", userData);
  const router = useRouter();
  // const [current,setCurrentUser]=useState()
  // async function fetchUser(){
  //   const res=await getUser()
  //   setCurrentUser(res)
  // }
  // useEffect(() => {
  //   fetchUser()
  // }, [])

  // useEffect(() => {
  //   if (!loading && !authenticated) {
  //     router.replace("/login");
  //   }
  // }, [authenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const user = userData?.data?.user_data;
  const username = user?.username || "User";
  const email = user?.email || "No email available";
  const tasksInfo = userData?.data?.task_data;

  return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
  <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-indigo-50">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  <Link href="/">{"<-"} Back to home</Link>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Welcome back,{" "}
                  <span className="text-indigo-600">
                    {username.split(" ")[0]}!
                  </span>
                </h1>
                <p className="text-gray-500 mt-1 font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {email}
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button
                className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
              >
                <LogOut className="h-4 w-4 text-gray-400" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="w-full">
  <Tasks />
</div>
      </div>
    </div>
  );
}

export default UserPage;
