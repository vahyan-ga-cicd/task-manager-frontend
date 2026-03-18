"use client";

import { useAdmin } from "@/hooks/admin";
// import { updateuser } from "@/utils/api/admin";
import React, { useState } from "react";
import { Info, Pencil } from "lucide-react";
import { updateuser } from "@/utils/api/admin/admin";

function AdminDashboard() {
  const { users, fetchAllUsers } = useAdmin();

  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
    });
  };

  const handleUpdate = async () => {
    try {
     const res= await updateuser(editingUser.user_id, formData);

      alert(res.message );

      setEditingUser(null);
      fetchAllUsers(); 
    } catch (err:any) {
      console.error(err);
      alert(err?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Admin Dashboard
      </h1>

      {/* Users Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {users.length > 0 &&
          users.map((user) => {
            const isLegacyUser = user.hashed_password === null;

            return (
              <div
                key={user.user_id}
                className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl transition duration-300"
              >
                {/* Header */}
                <div className="mb-4 border-b pb-2 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-700">
                      {user.username}
                    </h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Info icon */}
                    {isLegacyUser && (
                      <div className="relative group cursor-pointer">
                        <Info className="w-5 h-5 text-blue-500" />
                        <div className="absolute right-0 mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100">
                          Legacy user (old password system)
                        </div>
                      </div>
                    )}

                    {/* ✏️ Edit button */}
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 rounded-full hover:bg-gray-200 transition"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">User ID:</span>{" "}
                    {user.user_id}
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">
                      Original Password:
                    </span>
                    <span className="block break-all text-red-500">
                      {user.original_password || "Not Available"}
                    </span>
                  </p>

                  <p>
                    <span className="font-medium text-gray-800">
                      Hashed Password:
                    </span>
                    <span className="block break-all text-green-600 text-xs">
                      {user.hashed_password || "Not Available"}
                    </span>
                  </p>
                </div>

             
              </div>
            );
          })}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No users found.</p>
      )}

      {/* ✅ Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Update User
            </h2>

            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full mb-3 p-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="New Password (optional)"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-between items-center">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
