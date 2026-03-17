"use client";

import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal";
// import { createTask, deleteTask, updateTaskStatus } from "@/pages/api/tasksApi";
import { useTasks } from "@/hooks/useTasks";
import { useAuthContext } from "@/context/AuthContext";
import { Trash } from "lucide-react";
import { createTask, deleteTask, updateTaskStatus } from "@/utils/api/tasksApi";

type TaskStatus = "pending" | "ongoing" | "complete";

export default function Tasks() {
  const { fetchUser } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const res = await updateTaskStatus(taskId, newStatus);
    console.log("update status res", res);
    await getTasks();
    await fetchUser();
  };

  const handleDelete = async (taskId: string) => {
    const res = await deleteTask(taskId);
    console.log("update status res", res);
    await getTasks();
    await fetchUser();
  };

  const { tasks, getTasks } = useTasks();

  const handleAddTask = async (title: string, description: string) => {
    try {
      await createTask({
        title,
        description,
      });
      await getTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "complete":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full max-w-4xl mx-auto">
      {/* Header - Responsive */}
      <div className="px-4 py-4 sm:px-6 sm:py-5 md:border-b md:border-gray-200 md:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            Your Tasks
          </h3>
          <span className="bg-indigo-100 text-indigo-800 text-xs sm:text-sm px-3 py-1.5 rounded-full font-semibold shadow-sm order-first sm:order-last">
            {tasks.length} Total Tasks
          </span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 min-h-[44px] md:min-h-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Task
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 sm:p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto sm:h-16 sm:w-16 text-gray-400 mb-3 sm:mb-6 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <p className="text-gray-500 font-medium text-base sm:text-lg">
              No tasks remaining!
            </p>
            <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">
              You&apos;re all caught up for now.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {tasks.map((task) => (
              <div
                key={task.task_id}
                className="relative bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(task.task_id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                  title="Delete task"
                >
                  <Trash className="h-4 w-4" />
                </button>

                <div className="flex flex-col gap-4">
                  {/* Title */}
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
                    {task.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Bottom section */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase font-semibold text-gray-500">
                        Status
                      </span>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(
                            task.task_id,
                            e.target.value as TaskStatus,
                          )
                        }
                        className={`text-sm px-4 py-1.5 rounded-md border font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer ${getStatusColor(
                          task.status,
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="complete">Complete</option>
                      </select>
                    </div>

                    {/* Created Date */}
                    <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                      <span className="font-medium text-gray-600">Created</span>
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md border text-gray-700">
                        {new Date(task.created_at).toLocaleString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
