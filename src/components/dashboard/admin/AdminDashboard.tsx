"use client";

import { useAdmin } from "@/hooks/admin";
import React, { useState, useMemo } from "react";
import { updateuser } from "@/utils/api/admin/admin";
import Sidebar from "./Sidebar";

/* ── Inline SVG Icons ── */
const Icons = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M9.5 9.5l3 3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  Pencil: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M9.5 1.5a1.5 1.5 0 0 1 2.12 2.12L10.5 4.74 8.26 2.5 9.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8.26 2.5L2 8.76 1.5 11.5l2.74-.5L10.5 4.74 8.26 2.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 4L9 6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 2l10 10M12 2L2 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  Key: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="5" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M7.5 7.5l4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M9.5 9.5l-1.5 1.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Hash: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M2.5 4.5h8M2.5 8.5h8M5 2l-1 9M9 2l-1 9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Shield: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 1L2 3v3.5c0 2.5 1.8 4.5 4 5 2.2-.5 4-2.5 4-5V3L6 1Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M4 6l1.5 1.5L8.5 4.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Eye: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M1 6s2-4 5-4 5 4 5 4-2 4-5 4-5-4-5-4Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M1 1l10 10M4.5 3.2C5 2.8 5.5 2.5 6 2.5c3 0 5 3.5 5 3.5s-.6 1.2-1.7 2.3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M8 8.5C7.4 9 6.7 9.5 6 9.5c-3 0-5-3.5-5-3.5s.5-1 1.5-2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  ),
  Info: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M6 4v3M6 8.5v.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  ),
  EmptyState: () => (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect
        x="10"
        y="14"
        width="36"
        height="28"
        rx="4"
        stroke="#cbd5e1"
        strokeWidth="1.4"
      />
      <path d="M10 22h36" stroke="#cbd5e1" strokeWidth="1.4" />
      <rect x="16" y="27" width="10" height="2" rx="1" fill="#e2e8f0" />
      <rect x="16" y="31" width="18" height="2" rx="1" fill="#e2e8f0" />
      <rect x="16" y="35" width="7" height="2" rx="1" fill="#e2e8f0" />
      <circle
        cx="40"
        cy="38"
        r="7"
        fill="#f8fafc"
        stroke="#e2e8f0"
        strokeWidth="1.4"
      />
      <path
        d="M37.5 38h5M40 35.5v5"
        stroke="#cbd5e1"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
};

/* ── Stat illustrations ── */
const StatIllustration = ({
  type,
}: {
  type: "total" | "active" | "blocked";
}) => {
  if (type === "total")
    return (
      <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
        <circle cx="14" cy="11" r="5.5" fill="#e2e8f0" />
        <path
          d="M2.5 32c0-6.5 4.5-10 11.5-10"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="30" cy="11" r="5.5" fill="#e2e8f0" />
        <path
          d="M41.5 32c0-6.5-4.5-10-11.5-10"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="22" cy="13" r="6.5" fill="#94a3b8" />
        <path
          d="M10 34c0-7 5.5-11 12-11s12 4 12 11"
          stroke="#64748b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  if (type === "active")
    return (
      <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
        <circle cx="22" cy="13" r="7" fill="#d1fae5" />
        <path
          d="M10 34c0-7 5.5-11 12-11s12 4 12 11"
          stroke="#6ee7b7"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M17 13l3.5 3.5 5.5-7"
          stroke="#059669"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
      <circle cx="22" cy="13" r="7" fill="#fee2e2" />
      <path
        d="M10 34c0-7 5.5-11 12-11s12 4 12 11"
        stroke="#fca5a5"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 10l8 6M26 10l-8 6"
        stroke="#dc2626"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

function AdminDashboard() {
  const { users, fetchAllUsers } = useAdmin();

  const [activeTab, setActiveTab] = useState("users");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(
    new Set(),
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    activation_status: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      activation_status: user.activation_status || "active",
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await updateuser(editingUser.user_id, formData);
      alert(res.message);
      setEditingUser(null);
      fetchAllUsers();
    } catch (err: any) {
      alert(err?.message);
    }
  };

  const toggleReveal = (userId: string) => {
    setRevealedPasswords((prev) => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user: any) =>
        user.user_id.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((user: any) => {
        if (filterStatus === "all") return true;
        if (filterStatus === "active")
          return (user.activation_status || "active") === "active";
        if (filterStatus === "inactive")
          return user.activation_status === "inactive";
        return true;
      });
  }, [users, search, filterStatus]);

  const totalUsers = users.length;
  const activeUsers = users.filter(
    (u: any) => (u.activation_status || "active") === "active",
  ).length;
  const blockedUsers = users.filter(
    (u: any) => u.activation_status === "inactive",
  ).length;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      type: "total" as const,
      valueColor: "#334155",
    },
    {
      label: "Active",
      value: activeUsers,
      type: "active" as const,
      valueColor: "#059669",
    },
    {
      label: "Blocked",
      value: blockedUsers,
      type: "blocked" as const,
      valueColor: "#dc2626",
    },
  ];

  const inputStyle = {
    fontSize: 13,
    color: "#1e293b",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "10px 14px",
    width: "100%",
    outline: "none",
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "#f1f5f9" }}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="md:ml-[240px] pb-24 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Page Header */}
          <div className="mb-7 flex items-start justify-between flex-wrap gap-3">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle
                    cx="7"
                    cy="6.5"
                    r="3.5"
                    stroke="#475569"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M2 15.5c0-3.5 2.5-5.5 5-5.5"
                    stroke="#475569"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="13"
                    cy="6.5"
                    r="3.5"
                    stroke="#475569"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M16 15.5c0-3.5-2.5-5.5-5-5.5"
                    stroke="#475569"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                <h1
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#0f172a",
                    letterSpacing: "-0.025em",
                  }}
                >
                  User Management
                </h1>
              </div>
              <p style={{ fontSize: 12.5, color: "#94a3b8", marginLeft: 26 }}>
                View, search, and manage all registered accounts
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 99,
                fontSize: 11.5,
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              <Icons.Info />
              {filteredUsers.length} of {totalUsers} records
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-7">
            {stats.map(({ label, value, type, valueColor }) => (
              <div
                key={label}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 16,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#94a3b8",
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: 30,
                      fontWeight: 700,
                      color: valueColor,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.1,
                      marginTop: 4,
                    }}
                  >
                    {value}
                  </p>
                </div>
                <StatIllustration type={type} />
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div style={{ position: "relative", flex: 1 }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              >
                <Icons.Search />
              </span>
              <input
                type="text"
                placeholder="Search by User ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 36 }}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                ...inputStyle,
                width: "auto",
                minWidth: 140,
                cursor: "pointer",
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Blocked</option>
            </select>
          </div>

          {/* Desktop Table */}
          <div
            className="hidden md:block"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: "#fafafa",
                  }}
                >
                  {[
                    { label: "User" },
                    { label: "User ID" },
                    { label: "Status" },
                    { label: "Original Password", icon: <Icons.Key /> },
                    { label: "Hashed Password", icon: <Icons.Hash /> },
                    { label: "" },
                  ].map(({ label, icon }, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "12px 18px",
                        textAlign: i === 5 ? "right" : "left",
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#94a3b8",
                        letterSpacing: "0.09em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        {icon}
                        {label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any, idx: number) => {
                  const isActive =
                    (user.activation_status || "active") === "active";
                  const revealed = revealedPasswords.has(user.user_id);
                  return (
                    <tr
                      key={user.user_id}
                      style={{
                        borderBottom:
                          idx < filteredUsers.length - 1
                            ? "1px solid #f8fafc"
                            : "none",
                      }}
                    >
                      {/* User */}
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: "#f1f5f9",
                              color: "#475569",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {user.username?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#1e293b",
                              }}
                            >
                              {user.username}
                            </p>
                            <p
                              style={{
                                fontSize: 11,
                                color: "#94a3b8",
                                marginTop: 1,
                              }}
                            >
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* User ID */}
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: 11,
                            color: "#64748b",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            padding: "2px 8px",
                            borderRadius: 6,
                            display: "inline-block",
                          }}
                        >
                          {user.user_id}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 600,
                            color: isActive ? "#059669" : "#dc2626",
                            background: isActive ? "#d1fae5" : "#fee2e2",
                            border: `1px solid ${isActive ? "#a7f3d0" : "#fecaca"}`,
                          }}
                        >
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: isActive ? "#10b981" : "#ef4444",
                              display: "inline-block",
                            }}
                          />
                          {isActive ? "Active" : "Blocked"}
                        </span>
                      </td>

                      {/* Original Password */}
                      <td style={{ padding: "14px 18px" }}>
                        {user.original_password ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "monospace",
                                fontSize: 11,
                                color: revealed ? "#b91c1c" : "#94a3b8",
                                background: revealed ? "#fff1f2" : "#f8fafc",
                                border: `1px solid ${revealed ? "#fecaca" : "#e2e8f0"}`,
                                padding: "2px 8px",
                                borderRadius: 6,
                                display: "inline-block",
                                maxWidth: 130,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {revealed ? user.original_password : "••••••••"}
                            </span>
                            <button
                              onClick={() => toggleReveal(user.user_id)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "3px 7px",
                                fontSize: 10,
                                color: "#64748b",
                                background: "#f1f5f9",
                                border: "1px solid #e2e8f0",
                                borderRadius: 6,
                                cursor: "pointer",
                                fontWeight: 500,
                                flexShrink: 0,
                              }}
                            >
                              {revealed ? <Icons.EyeOff /> : <Icons.Eye />}
                              {revealed ? "Hide" : "Show"}
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 13, color: "#e2e8f0" }}>
                            —
                          </span>
                        )}
                      </td>

                      {/* Hashed Password */}
                      <td
                        style={{
                          padding: "14px 18px",
                          maxWidth: 220,
                          textAlign: "center", // centers the box horizontally
                        }}
                      >
                        {user.hashed_password ? (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,

                              backgroundColor: "green", // FULL box green
                              color: "#fff",

                              borderRadius: 8,
                              padding: "6px 12px",
                              minWidth: 80,
                            }}
                          >
                            <span
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Icons.Shield />
                            </span>

                            <span
                              style={{
                                fontFamily: "monospace",
                                fontSize: 11,
                              }}
                            >
                              True
                            </span>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,

                              backgroundColor: "red",
                              color: "#fff",

                              borderRadius: 8,
                              padding: "6px 12px",
                              minWidth: 80,
                            }}
                          >
                            False
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <button
                          onClick={() => handleEdit(user)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 500,
                            color: "#334155",
                            background: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            cursor: "pointer",
                          }}
                        >
                          <Icons.Pencil />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "56px 0",
                  gap: 12,
                }}
              >
                <Icons.EmptyState />
                <p style={{ fontSize: 13, color: "#94a3b8" }}>
                  No users found matching your criteria
                </p>
              </div>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredUsers.map((user: any) => {
              const isActive =
                (user.activation_status || "active") === "active";
              const revealed = revealedPasswords.has(user.user_id);
              return (
                <div
                  key={user.user_id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background: "#f1f5f9",
                          color: "#475569",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {user.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#1e293b",
                          }}
                        >
                          {user.username}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            marginTop: 1,
                          }}
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        background: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                        cursor: "pointer",
                        color: "#64748b",
                      }}
                    >
                      <Icons.Pencil />
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        color: "#94a3b8",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        padding: "2px 6px",
                        borderRadius: 5,
                      }}
                    >
                      {user.user_id}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "3px 8px",
                        borderRadius: 7,
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: isActive ? "#059669" : "#dc2626",
                        background: isActive ? "#d1fae5" : "#fee2e2",
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: isActive ? "#10b981" : "#ef4444",
                          display: "inline-block",
                        }}
                      />
                      {isActive ? "Active" : "Blocked"}
                    </span>
                  </div>

                  {user.original_password && (
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap" as const,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 10,
                          color: "#94a3b8",
                        }}
                      >
                        <Icons.Key /> Password:
                      </span>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 11,
                          color: revealed ? "#b91c1c" : "#94a3b8",
                        }}
                      >
                        {revealed ? user.original_password : "••••••••"}
                      </span>
                      <button
                        onClick={() => toggleReveal(user.user_id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: 10,
                          color: "#64748b",
                          background: "#f1f5f9",
                          border: "1px solid #e2e8f0",
                          borderRadius: 5,
                          padding: "2px 6px",
                          cursor: "pointer",
                        }}
                      >
                        {revealed ? <Icons.EyeOff /> : <Icons.Eye />}
                        {revealed ? "Hide" : "Show"}
                      </button>
                    </div>
                  )}

                  {user.hashed_password && (
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 10,
                          color: "#94a3b8",
                          marginTop: 1,
                          flexShrink: 0,
                        }}
                      >
                        <Icons.Hash /> Hash:
                      </span>

                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 10,
                          color: "#fff",
                          wordBreak: "break-all",
                          padding: "2px 6px",
                          borderRadius: 4,
                          backgroundColor: user.hashed_password
                            ? "green"
                            : "red",
                        }}
                      >
                        {user.hashed_password ? "True" : "False"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredUsers.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "48px 0",
                  gap: 12,
                }}
              >
                <Icons.EmptyState />
                <p style={{ fontSize: 13, color: "#94a3b8" }}>No users found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "0 16px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 440,
              border: "1px solid #e2e8f0",
              boxShadow: "0 24px 64px rgba(0,0,0,0.10)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#f1f5f9",
                    color: "#475569",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {editingUser.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p
                    style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}
                  >
                    Edit User
                  </p>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                    {editingUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <Icons.Close />
              </button>
            </div>

            {/* Body */}
            <div
              style={{
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {[
                {
                  label: "Username",
                  key: "username",
                  type: "text",
                  placeholder: "Username",
                },
                {
                  label: "Email",
                  key: "email",
                  type: "email",
                  placeholder: "Email address",
                },
                {
                  label: "New Password",
                  key: "password",
                  type: "password",
                  placeholder: "Leave blank to keep current",
                },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#64748b",
                      marginBottom: 6,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    value={(formData as any)[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "#64748b",
                    marginBottom: 6,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                  }}
                >
                  Account Status
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {[
                    {
                      value: "active",
                      label: "Active",
                      color: "#059669",
                      bg: "#d1fae5",
                      border: "#a7f3d0",
                    },
                    {
                      value: "inactive",
                      label: "Blocked",
                      color: "#dc2626",
                      bg: "#fee2e2",
                      border: "#fecaca",
                    },
                  ].map(({ value, label, color, bg, border }) => {
                    const selected = formData.activation_status === value;
                    return (
                      <button
                        key={value}
                        onClick={() =>
                          setFormData({ ...formData, activation_status: value })
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 7,
                          padding: "10px",
                          borderRadius: 10,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                          color: selected ? color : "#94a3b8",
                          background: selected ? bg : "#f8fafc",
                          border: `1.5px solid ${selected ? border : "#e2e8f0"}`,
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: selected ? color : "#cbd5e1",
                            display: "inline-block",
                          }}
                        />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
                padding: "14px 24px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <button
                onClick={() => setEditingUser(null)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#64748b",
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "#0f172a",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
