"use client";

import { useAuthContext } from "@/context/AuthContext";
import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  route?: string;
};

const navItems: NavItem[] = [
  {
    id: "users",
    label: "Users",
    route: "/admin-dashboard/users",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle
          cx="8"
          cy="5"
          r="3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M2.5 14.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "invoice",
    label: "Generate Invoice",
    route: "/invoice/login",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="3"
          y="2"
          width="10"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M5 6H11M5 9H11M5 12H8"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "audit-logs",
    label: "Audit Logs",
    route: "/admin-dashboard/audit-logs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 3.5v4.5l2.5 2.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="8"
          cy="8"
          r="6.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  onLogout,
}: SidebarProps) {
  const { userData } = useAuthContext();
  const router = useRouter();

  const handleNavClick = (item: NavItem) => {
    if (item.id === "invoice") {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("invoicetoken")
          : null;

      if (token) {
        router.push("/invoice/account");
      } else {
        router.push("/invoice/login");
      }
      return;
    }

    if (item.route) {
      router.push(item.route);
    } else {
      onTabChange(item.id);
    }
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-[240px] min-h-screen fixed left-0 top-0 z-20"
        style={{
          background: "#f8fafc",
          borderRight: "1px solid #e2e8f0",
        }}
      >
        {/* Brand */}
        <div
          className="px-5 pt-6 pb-5"
          style={{ borderBottom: "1px solid #e2e8f0" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#0f172a" }}
            >
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                <path
                  d="M9.5 2L3 5.25V10.5C3 13.9 5.9 17 9.5 17.75C13.1 17 16 13.9 16 10.5V5.25L9.5 2Z"
                  fill="white"
                  fillOpacity="0.12"
                  stroke="white"
                  strokeWidth="1.2"
                />
                <path
                  d="M6.5 9.5L8.5 11.5L13 7"
                  stroke="white"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f172a]">AdminPanel</p>
              <p className="text-[10px] text-[#94a3b8] mt-1 tracking-widest">
                CONTROL CENTER
              </p>
            </div>
          </div>
        </div>

        {/* Nav Label */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[10px] font-semibold text-[#94a3b8] tracking-widest">
            MENU
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
                style={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#0f172a" : "#64748b",
                  background: active ? "#e2e8f0" : "transparent",
                  borderLeft: active
                    ? "2.5px solid #0f172a"
                    : "2.5px solid transparent",
                }}
              >
                <span style={{ color: active ? "#0f172a" : "#94a3b8" }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-3 border-t border-[#e2e8f0]" />

        {/* User + Logout */}
        <div className="px-3 py-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0]">
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#e2e8f0]">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle
                  cx="6.5"
                  cy="4.5"
                  r="2.2"
                  stroke="#64748b"
                  strokeWidth="1.2"
                />
                <path
                  d="M2 12c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"
                  stroke="#64748b"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-[#94a3b8]">Signed in as</p>
              <p className="text-xs font-semibold text-[#334155]">
                {userData?.data?.user_data?.role}
              </p>
            </div>
          </div>
         
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg 
             text-sm font-medium text-gray-700 
             hover:bg-red-100 hover:text-red-600 
             transition-all duration-200"
          >
            <LogOut size={18} strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex bg-[#f8fafc] border-t border-[#e2e8f0]">
        {navItems.map((item) => {
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px]"
              style={{
                fontWeight: 500,
                color: active ? "#0f172a" : "#94a3b8",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}

        <button
          onClick={onLogout}
          className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] text-[#94a3b8]"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              d="M5.5 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M10 10.5l3-3-3-3"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 7.5H6"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Sign Out
        </button>
      </nav>
    </>
  );
}
