"use client";

import { useAuthContext } from "@/context/AuthContext";
import React from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const navItems = [
  {
    id: "users",
    label: "Users",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M2.5 14.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

/* ── Decorative SVG panel illustration ── */
const PanelIllustration = () => (
  <svg width="180" height="90" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Grid dots */}
    {[0,1,2,3,4,5].map(col =>
      [0,1,2].map(row => (
        <circle
          key={`${col}-${row}`}
          cx={16 + col * 30}
          cy={12 + row * 30}
          r="1.5"
          fill="#cbd5e1"
          opacity="0.6"
        />
      ))
    )}
    {/* Bar chart shapes */}
    <rect x="20" y="52" width="12" height="26" rx="2.5" fill="#e2e8f0"/>
    <rect x="38" y="42" width="12" height="36" rx="2.5" fill="#cbd5e1"/>
    <rect x="56" y="36" width="12" height="42" rx="2.5" fill="#94a3b8"/>
    <rect x="74" y="46" width="12" height="32" rx="2.5" fill="#cbd5e1"/>
    <rect x="92" y="30" width="12" height="48" rx="2.5" fill="#64748b"/>
    <rect x="110" y="40" width="12" height="38" rx="2.5" fill="#94a3b8"/>
    <rect x="128" y="56" width="12" height="22" rx="2.5" fill="#e2e8f0"/>
    {/* Trend line */}
    <polyline
      points="26,56 44,46 62,40 80,50 98,34 116,44 134,60"
      stroke="#64748b"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray="3 2"
    />
    {/* Active dot */}
    <circle cx="98" cy="34" r="3" fill="#1e293b"/>
    <circle cx="98" cy="34" r="1.5" fill="white"/>
  </svg>
);

export default function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
    const {userData} = useAuthContext();
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
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid #e2e8f0" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#0f172a" }}
            >
              {/* Shield + check vector */}
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                <path
                  d="M9.5 2L3 5.25V10.5C3 13.9 5.9 17 9.5 17.75C13.1 17 16 13.9 16 10.5V5.25L9.5 2Z"
                  fill="white"
                  fillOpacity="0.12"
                  stroke="white"
                  strokeWidth="1.2"
                />
                <path d="M6.5 9.5L8.5 11.5L13 7" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>
                AdminPanel
              </p>
              <p style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.1em", marginTop: 3, fontWeight: 500 }}>
                CONTROL CENTER
              </p>
            </div>
          </div>
        </div>

        {/* Illustration block */}
        {/* <div
          className="mx-4 mt-4 mb-1 rounded-xl overflow-hidden flex flex-col items-center px-2 pt-3 pb-2"
          style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}
        >
          <PanelIllustration />
          <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, letterSpacing: "0.06em", marginTop: 2 }}>
            ANALYTICS OVERVIEW
          </p>
        </div> */}

        {/* Nav Label */}
        <div className="px-5 pt-5 pb-2">
          <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.1em" }}>MENU</span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ id, label, icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
                style={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#0f172a" : "#64748b",
                  background: active ? "#e2e8f0" : "transparent",
                  borderLeft: active ? "2.5px solid #0f172a" : "2.5px solid transparent",
                  transition: "none",
                }}
              >
                <span style={{ color: active ? "#0f172a" : "#94a3b8" }}>{icon}</span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #e2e8f0", margin: "0 12px" }} />

        {/* User + Logout */}
        <div className="px-3 py-4 space-y-1">
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#e2e8f0" }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="6.5" cy="4.5" r="2.2" stroke="#64748b" strokeWidth="1.2"/>
                <path d="M2 12c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1 }}>Signed in as</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginTop: 2 }}>{userData?.data?.user_data?.role}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-100 transition-colors"
            style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M5.5 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M10 10.5l3-3-3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 7.5H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex"
        style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}
      >
        {navItems.map(({ id, label, icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex-1 flex flex-col items-center gap-1 py-3"
              style={{ fontSize: 10, fontWeight: 500, color: active ? "#0f172a" : "#94a3b8" }}
            >
              {icon}
              {label}
            </button>
          );
        })}
        <button
          onClick={onLogout}
          className="flex-1 flex flex-col items-center gap-1 py-3"
          style={{ fontSize: 10, color: "#94a3b8" }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M5.5 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M10 10.5l3-3-3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 7.5H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Sign Out
        </button>
      </nav>
    </>
  );
}