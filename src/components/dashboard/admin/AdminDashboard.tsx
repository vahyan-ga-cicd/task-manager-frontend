"use client";

import { useAdmin } from "@/hooks/admin";
import React, { useState, useMemo, useEffect } from "react";
import { Pencil } from "lucide-react";
import { updateuser } from "@/utils/api/admin/admin";

function AdminDashboard() {
  const { users, fetchAllUsers } = useAdmin();

  const [editingUser, setEditingUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    activation_status: "",
  });

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ✅ Edit User
  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      activation_status: user.activation_status || "active",
    });
  };

  // ✅ Update User
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

  // ✅ Filter + Search
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
      });
  }, [users, search, filterStatus]);
  useEffect(() => {
    if (editingUser) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editingUser]);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 🔷 Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center md:text-left">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by User ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-black p-3 border border-gray-300 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-black p-3 border border-gray-300 rounded-lg w-full md:w-1/4 focus:outline-none"
        >
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="inactive">Blocked</option>
        </select>
      </div>

      {/* 👥 Users Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user: any) => (
          <div
            key={user.user_id}
            className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="mb-4 border-b pb-3 flex justify-between items-start gap-2">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 break-words">
                  {user.username}
                </h2>
                <p className="text-sm text-gray-700 break-all">{user.email}</p>
              </div>

              <button
                onClick={() => handleEdit(user)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Pencil className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-3">
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  user.activation_status === "active"
                    ? "bg-green-100 text-green-700"
                    : user.activation_status === "inactive"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.activation_status ?? "null"}
              </span>
            </div>

            {/* Details */}
            <p className="text-sm text-gray-800 break-all">
              <span className="font-medium">User ID:</span> {user.user_id}
            </p>

            <p className="text-black text-xs break-all mt-2 p-2 rounded">
              Orginal Password :{" "}
              <span className="text-red-500">
                {" "}
                {user.original_password || "No password"}
              </span>
            </p>
            <p className="text-black text-xs break-all mt-2  p-2 rounded">
              Hashed Password :{" "}
              <span className="text-green-700">
                {user.hashed_password || "No password"}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* ✏️ Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 ">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Update User
            </h2>

            <input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="text-black w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none"
              placeholder="Username"
            />

            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="text-black w-full mb-3 p-2 border border-gray-300 rounded"
              placeholder="Email"
            />

            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="text-black w-full mb-3 p-2 border border-gray-300 rounded"
              placeholder="New Password"
            />

            {/* Status */}
            <select
              value={formData.activation_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  activation_status: e.target.value,
                })
              }
              className="text-black w-full mb-4 p-2 border border-gray-300 rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Blocked</option>
            </select>

            <div className="flex justify-between">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
