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
import { getallusers } from "@/pages/api/admin/admin";
import { useAdmin } from "@/hooks/admin";
// import { getUser } from "@/pages/api/auth";
function UserPage() {
  const { userData, authenticated, loading, logout } = useAuthContext();

  // console.log("UserPage render:", userData);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tasks Area */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Tasks />
          </div>

          <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Stats
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg shadow-sm">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        Total Tasks
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      {tasksInfo?.tasks_count || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100/60 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg shadow-sm">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-emerald-800">
                        Completed
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-700">
                      {tasksInfo?.completed_tasks || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl hover:bg-amber-100/60 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg shadow-sm">
                        <Clock className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-amber-800">
                        Pending
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-amber-700">
                      {tasksInfo?.pending_tasks || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100/60 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
                        <LoaderCircle className="w-5 h-5 text-blue-500 animate-spin [animation-duration:2s]" />{" "}
                      </div>
                      <span className="text-sm font-semibold text-blue-800">
                        Ongoing
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-blue-700">
                      {tasksInfo?.ongoing_tasks || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-xl shadow-md overflow-hidden text-white relative">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full blur-lg"></div>

              {/* <div className="px-6 py-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">Quick Tip</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-indigo-100 text-sm leading-relaxed mb-5">
                  Stay on top of your game! Updating tasks regularly keeps your
                  dashboard precise and helps you organize your schedule
                  efficiently.
                </p>
                <button className="text-sm font-semibold bg-white/20 hover:bg-white/30 transition-colors py-2 px-4 rounded-lg w-full">
                  Learn more
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
