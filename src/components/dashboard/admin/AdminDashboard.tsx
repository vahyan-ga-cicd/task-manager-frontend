"use client";

import { useAdmin } from "@/hooks/admin";
import React, { useState, useMemo } from "react";
import { Pencil, Search, X, Users, UserCheck, UserX } from "lucide-react";
import { updateuser } from "@/utils/api/admin/admin";
import Sidebar from "./Sidebar";

function AdminDashboard() {
  const { users, fetchAllUsers } = useAdmin();

  const [activeTab, setActiveTab] = useState("users");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="md:ml-60 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage and monitor all registered users
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Total Users",
                value: totalUsers,
                icon: Users,
                color: "text-gray-700",
              },
              {
                label: "Active",
                value: activeUsers,
                icon: UserCheck,
                color: "text-emerald-600",
              },
              {
                label: "Blocked",
                value: blockedUsers,
                icon: UserX,
                color: "text-red-500",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {label}
                  </span>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className={`text-2xl font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by User ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition placeholder:text-black"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="sm:w-40 px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Blocked</option>
            </select>
          </div>

          {/* Table — desktop */}
          <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3.5">
                    User
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3.5">
                    User ID
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3.5">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3.5">
                    Original Password
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3.5">
                    Hashed Password
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3.5">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user: any) => (
                  <tr
                    key={user.user_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                          {user.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 font-mono text-xs">
                      {user.user_id}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          (user.activation_status || "active") === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {(user.activation_status || "active") === "active"
                          ? "Active"
                          : "Blocked"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-red-500 max-w-[140px] truncate">
                      {user.original_password || "—"}
                    </td>
                    <td
                      className="px-5 py-4 font-mono text-xs text-gray-400 max-w-[160px] truncate"
                      title={user.hashed_password || ""}
                    >
                      {user.hashed_password
                        ? user.hashed_password.slice(0, 24) + "…"
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleEdit(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-400">
                No users found
              </div>
            )}
          </div>

          {/* Cards — mobile */}
          <div className="sm:hidden space-y-3">
            {filteredUsers.map((user: any) => (
              <div
                key={user.user_id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                      {user.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">
                    {user.user_id}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                      (user.activation_status || "active") === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {(user.activation_status || "active") === "active"
                      ? "Active"
                      : "Blocked"}
                  </span>
                </div>
                {user.original_password && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-400">Password: </span>
                    <span className="text-xs font-mono text-red-500">
                      {user?.original_password === null
                        ? "User records were created before migrating to bcrypt-based hashing. Existing credentials are incompatible with the current authentication system."
                        : user.original_password}
                    </span>
                  </div>
                )}
                {user.hashed_password && (
                  <div className="mt-1">
                    <span className="text-xs text-gray-400">Hash: </span>
                    <span className="text-xs font-mono text-gray-400 break-all">
                      {user.hashed_password.slice(0, 32)}…
                    </span>
                  </div>
                )}
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-center py-10 text-sm text-gray-400">
                No users found
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                Edit User
              </h2>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Username
                </label>
                <input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition text-black"
                  placeholder="Username"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Email
                </label>
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="text-black w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="text-black w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition"
                  placeholder="Leave blank to keep current"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.activation_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activation_status: e.target.value,
                    })
                  }
                  className=" text-black w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition text-gray-700"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Blocked</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
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
