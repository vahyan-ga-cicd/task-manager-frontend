"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Tasks from "@/components/dashboard/tasks/Tasks";
import { useAuthContext } from "@/context/AuthContext";
import { Mail, LogOut, ClipboardList, History } from "lucide-react";
import Link from "next/link";
import {
  fetchCoordinatorAuditLogs,
  fetchUserAuditLogs,
} from "@/utils/api/auditApi";
import AuditLogsTable from "../../audit/AuditLogsTable";
import { AuditLog } from "@/@types/interface/auditlogs.interface";
// import { getallusers } from "@/pages/api/admin/admin";
// import { getUser } from "@/pages/api/auth";
function UserPage() {
  const { userData, loading, logout } = useAuthContext();

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

  const [activeTab, setActiveTab] = useState("tasks");
  const [logCategory, setLogCategory] = useState<"my" | "delegated">("my");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const user = userData?.data?.user_data;

  useEffect(() => {
    if (activeTab === "logs" && user) {
      const getLogs = async () => {
        setLogsLoading(true);
        try {
          const res =
            user.role === "coordinator"
              ? await fetchCoordinatorAuditLogs()
              : await fetchUserAuditLogs();

          let filteredLogs = res.data;
          if (user.role === "coordinator") {
            if (logCategory === "my") {
              // Logs where the task belongs to the coordinator
              filteredLogs = res.data.filter(
                (l: AuditLog) => l.task_owner_id === user.user_id,
              );
            } else {
              // Logs where the coordinator performed the action or assigned it, but task belongs to someone else
              filteredLogs = res.data.filter(
                (l: AuditLog) => l.task_owner_id !== user.user_id,
              );
            }
          }
          setLogs(filteredLogs);
        } catch (error) {
          console.error(error);
        } finally {
          setLogsLoading(false);
        }
      };
      getLogs();
    }
  }, [activeTab, user, logCategory, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const username = user?.username || "User";
  const email = user?.email || "No email available";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* LEFT SECTION */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full">
              {/* Avatar */}
              <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold shadow-lg ring-2 sm:ring-4 ring-indigo-50 shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>

              {/* Text Content */}
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-gray-500 mb-1">
                  <Link href="/" className="hover:text-indigo-600 transition">
                    {"<-"} Back to home
                  </Link>
                </div>

                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight truncate">
                  Welcome back,{" "}
                  <span className="text-indigo-600">
                    {username.split(" ")[0]}!
                  </span>
                </h1>

                <p className="text-gray-500 mt-1 font-medium flex items-center gap-2 text-xs sm:text-sm truncate">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </p>
              </div>
            </div>

            {/* RIGHT SECTION (BUTTONS) */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
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

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "tasks"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Tasks
            </div>
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "logs"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Task Logs
            </div>
          </button>
        </div>

        <div className="w-full space-y-4">
          {activeTab === "logs" && user?.role === "coordinator" && (
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                onClick={() => setLogCategory("my")}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  logCategory === "my"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tasks Created By Me
              </button>
              <button
                onClick={() => setLogCategory("delegated")}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  logCategory === "delegated"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tasks Assigned to Others
              </button>
            </div>
          )}
          {activeTab === "tasks" ? (
            <Tasks />
          ) : (
            <AuditLogsTable
              logs={logs}
              loading={logsLoading}
              onRefresh={handleRefresh}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;
