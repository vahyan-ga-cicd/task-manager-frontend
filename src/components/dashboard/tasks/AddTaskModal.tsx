"use client";

import { ICreateTask } from "@/@types/interface/tasks.interfaces";
import { Priority } from "@/@types/constant/priority.constant";
import { useAuthContext } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";

interface User {
  user_id: string;
  username: string;
  email: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (data: ICreateTask) => void | Promise<void>;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
}: AddTaskModalProps) {
  const { fetchUser, userData } = useAuthContext();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Low");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = userData?.data?.user_data?.role === "admin";
  const isCoordinator = userData?.data?.user_data?.role === "coordinator";
  const currentUserId = userData?.data?.user_data?.user_id;

  const isAssigningPossible = isAdmin || isCoordinator;

  useEffect(() => {
    if (isOpen && isAssigningPossible) {
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
  }, [isOpen, isAssigningPossible]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);

    try {
      const taskData = isAssigningPossible
        ? {
            title: newTaskTitle,
            description: newTaskDescription,
            assigned_to: assignedTo,
            deadline,
            priority,
          }
        : { title: newTaskTitle, description: newTaskDescription, priority };

      await onAddTask(taskData);

      await fetchUser();

      setNewTaskTitle("");
      setNewTaskDescription("");
      setPriority("Low");
      setAssignedTo("");
      setDeadline("");
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
                  {
                    id: "Low",
                    color:
                      "bg-blue-50 text-blue-600 border-blue-200 ring-blue-500",
                    label: "Low",
                  },
                  {
                    id: "Medium",
                    color:
                      "bg-amber-50 text-amber-600 border-amber-200 ring-amber-500",
                    label: "Medium",
                  },
                  {
                    id: "High",
                    color: "bg-red-50 text-black border-red-200 ring-red-500",
                    label: "High",
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as Priority)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                      priority === p.id
                        ? `${p.color} border-2 ring-2 ring-offset-1`
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {isAssigningPossible && (
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
                      .filter((user) => user.user_id !== currentUserId)
                      .map((user) => (
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
                  <div className="relative">
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 bg-white cursor-pointer
        [&::-webkit-calendar-picker-indicator]:opacity-0
        [&::-webkit-calendar-picker-indicator]:absolute
        [&::-webkit-calendar-picker-indicator]:inset-0
        [&::-webkit-calendar-picker-indicator]:w-full
        [&::-webkit-calendar-picker-indicator]:h-full
        [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  {deadline && (
                    <p className="mt-1.5 text-xs text-indigo-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                      {new Date(deadline + "T00:00:00").toLocaleDateString(
                        "en-GB",
                        {
                          weekday: "short",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  )}
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
