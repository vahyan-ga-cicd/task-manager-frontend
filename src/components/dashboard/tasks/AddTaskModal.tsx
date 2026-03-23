"use client";

import { useAuthContext } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (data: any) => void;
}

type Priority = "Normal" | "Medium" | "High";

export default function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
}: AddTaskModalProps) {
  const { fetchUser, userData } = useAuthContext();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Normal");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = userData?.data?.user_data?.role === "admin";
  const currentUserId = userData?.data?.user_data?.user_id;

  useEffect(() => {
    if (isOpen && isAdmin) {
      const loadUsers = async () => {
        const { getuserslist } = await import("@/utils/api/admin/admin");
        try {
          const users = await getuserslist();
          setUsersList(users);
        } catch (err) {
          console.error("Failed to load users", err);
        }
      };
      loadUsers();
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newTaskTitle.trim()) return;

  setIsSubmitting(true);

  try {
    const taskData = isAdmin 
      ? { title: newTaskTitle, description: newTaskDescription, assigned_to: assignedTo, deadline, priority }
      : { title: newTaskTitle, description: newTaskDescription, priority };

    await onAddTask(taskData);

    await fetchUser();

    setNewTaskTitle('');
    setNewTaskDescription('');
    setPriority('Normal');
    setAssignedTo('');
    setDeadline('');
    onClose();
  } catch (err) {
    console.log(err);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Add New Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1.5 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-gray-900"
                placeholder="e.g., Design homepage"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Description
              </label>
              <textarea
                id="description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none placeholder-gray-400 text-gray-900"
                placeholder="Enter task details..."
              ></textarea>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority Level
              </label>
              <div className="flex gap-3">
                {[
                  { id: 'Normal', color: 'bg-blue-50 text-blue-600 border-blue-200 ring-blue-500', label: 'Normal' },
                  { id: 'Medium', color: 'bg-amber-50 text-amber-600 border-amber-200 ring-amber-500', label: 'Medium' },
                  { id: 'High', color: 'bg-red-50 text-black border-red-200 ring-red-500', label: 'High' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as Priority)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                      priority === p.id 
                        ? `${p.color} border-2 ring-2 ring-offset-1` 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {isAdmin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Assign to Employee <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                  >
                    <option value="">Select Employee</option>
                    {usersList
                      .filter((user: any) => user.user_id !== currentUserId)
                      .map((user: any) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                  />
                </div>
              </>
            )}
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
