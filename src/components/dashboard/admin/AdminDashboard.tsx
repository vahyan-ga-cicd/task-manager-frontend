"use client"
import { useAdmin } from '@/hooks/admin';
import React from 'react'
import { Info } from 'lucide-react';

function AdminDashboard() {
  const { users } = useAdmin();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Admin Dashboard
      </h1>

      {/* Users Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        
        {users.map((user) => {
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

                {/* Info Icon with Tooltip */}
                {isLegacyUser && (
                  <div className="relative group cursor-pointer">
                    <Info className="w-5 h-5 text-blue-500" />

                    {/* Tooltip */}
                    <div className="absolute right-0 mt-2 w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 z-10">
                      User records were created before migrating to bcrypt-based hashing. 
                      Existing credentials are incompatible with the current authentication system.
                    </div>
                  </div>
                )}
              </div>

              {/* User Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">User ID:</span> {user.user_id}
                </p>

                {/* Original Password */}
                <p>
                  <span className="font-medium text-gray-800">Original Password:</span>
                  <span className="block break-all text-red-500">
                    { user.original_password||"Not Available"}
                  </span>
                </p>

                {/* Hashed Password */}
                <p>
                  <span className="font-medium text-gray-800">Hashed Password:</span>
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
        <p className="text-center text-gray-500 mt-10">
          No users found.
        </p>
      )}
    </div>
  )
}

export default AdminDashboard