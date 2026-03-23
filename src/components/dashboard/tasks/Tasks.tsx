"use client";

import React, { useState, useEffect } from "react";
import AddTaskModal from "./AddTaskModal";
import { useTasks } from "@/hooks/useTasks";
import { useAuthContext } from "@/context/AuthContext";
import {
  Trash2,
  AlertCircle,
  ListChecks,
  Plus,
  X,
  Clock,
  CheckCircle2,
  Loader2,
  CalendarDays,
  User,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import {
  createTask,
  deleteTask,
  updateTaskStatus,
  fetchTaskStats,
  adminDeleteTask,
} from "@/utils/api/tasksApi";
import Stats from "../stats/Stats";

type TaskStatus = "pending" | "ongoing" | "complete";
type Priority = "Normal" | "Medium" | "High";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  ongoing: {
    label: "Ongoing",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-400",
  },
  complete: {
    label: "Complete",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
} as const;

const PRIORITY_CONFIG = {
  High: {
    label: "High",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    icon: "🔥",
  },
  Medium: {
    label: "Medium",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
    icon: "⚡",
  },
  Normal: {
    label: "Normal",
    bg: "bg-slate-50",
    text: "text-slate-500",
    border: "border-slate-200",
    icon: "·",
  },
} as const;

function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const cfg = PRIORITY_CONFIG[priority as Priority] ?? PRIORITY_CONFIG.Normal;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className="text-[10px]">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

function StyledSelect<T extends string>({
  value,
  onChange,
  options,
  colorMap,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  colorMap: Record<string, string>;
}) {
  return (
    <div className="relative">
      <select
  value={value}
  onChange={(e) => onChange(e.target.value as T)}
  style={{ backgroundColor: "inherit" }}
  className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg border text-xs font-semibold outline-none cursor-pointer transition-all focus:ring-2 focus:ring-indigo-300
${colorMap[value] || "bg-gray-50 text-gray-700 border-gray-200"}
bg-opacity-100 text-black`}
>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-50" />
    </div>
  );
}

export default function Tasks() {
  const { fetchUser, userData } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    ongoing: 0,
    complete: 0,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = userData?.data?.user_data?.role === "admin";

  const getStats = React.useCallback(async () => {
    try {
      let res;
      if (isAdmin) {
        const { fetchAdminStats } = await import("@/utils/api/admin/admin");
        res = await fetchAdminStats();
      } else {
        res = await fetchTaskStats();
      }
      if (res?.data) setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, [isAdmin]);

  const { tasks, getTasks } = useTasks(userData?.data?.user_data?.role);

  useEffect(() => {
    if (userData?.data?.user_data?.role) getStats();
  }, [userData?.data?.user_data?.role, tasks, getStats]);

  const handleUpdateTask = async (
    task: any,
    updates: { status?: TaskStatus; priority?: Priority },
  ) => {
    setErrorMsg(null);
    try {
      if (isAdmin) {
        // const { adminUpdateTask } = await import("@/utils/api/admin/admin");
        // await adminUpdateTask(task.user_id, task.task_id, updates);
      } else if (updates.status) {
        await updateTaskStatus(task.task_id, updates.status);
      }
      await getTasks();
      await getStats();
      await fetchUser();
    } catch (error: any) {
      console.error("Failed to update task:", error);
      setErrorMsg(error.message || "Operation failed");
      await getTasks();
    }
  };

  const handleDelete = async (targetUserId: string, taskId: string) => {
    setDeletingId(taskId);
    try {
      if (isAdmin) await adminDeleteTask(targetUserId, taskId);
      else await deleteTask(taskId);
      await getTasks();
      await getStats();
      await fetchUser();
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddTask = async (data: any) => {
    try {
      if (isAdmin) {
        const { assigntask } = await import("@/utils/api/admin/admin");
        await assigntask(data);
      } else {
        await createTask(data);
      }
      await getTasks();
      await getStats();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

const statusColorMap: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  ongoing: "bg-blue-100 text-blue-800 border-blue-300",   // ✅ FIX
  complete: "bg-green-100 text-green-800 border-green-300",
};
  const priorityColorMap: Record<string, string> = {
    Normal: "bg-slate-50  text-slate-600  border-slate-200",
    Medium: "bg-orange-50 text-orange-600 border-orange-200",
    High: "bg-red-50    text-red-600    border-red-200",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .tasks-root { font-family: 'Sora', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .task-card { animation: fadeUp 0.3s ease both; }
        .task-card:nth-child(1)   { animation-delay: 0.04s; }
        .task-card:nth-child(2)   { animation-delay: 0.08s; }
        .task-card:nth-child(3)   { animation-delay: 0.12s; }
        .task-card:nth-child(4)   { animation-delay: 0.16s; }
        .task-card:nth-child(5)   { animation-delay: 0.20s; }
        .task-card:nth-child(n+6) { animation-delay: 0.24s; }

        .task-card {
          transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .task-card:hover {
          box-shadow: 0 6px 24px rgba(99,102,241,0.10);
          border-color: #a5b4fc !important;
          transform: translateY(-2px);
        }

        .delete-btn { transition: color 0.15s, transform 0.15s; }
        .delete-btn:hover { color: #e11d48; transform: scale(1.18); }

        .error-banner { animation: slideDown 0.25s ease; }

        .priority-left-bar-High   { border-left: 3px solid #f87171; }
        .priority-left-bar-Medium { border-left: 3px solid #fb923c; }
        .priority-left-bar-Normal { border-left: 3px solid #cbd5e1; }
      `}</style>

      <div className="tasks-root w-full max-w-5xl mx-auto space-y-6">
        <Stats stats={stats} />

        {errorMsg && (
          <div className="text-black error-banner flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
            <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-rose-700 font-medium flex-1">
              {errorMsg}
            </p>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-rose-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                <ListChecks className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {isAdmin ? "All Tasks" : "Your Tasks"}
                </h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm shadow-indigo-200"
              >
                <Plus className="h-4 w-4" />
                Assign Task
              </button>
            )}
          </div>

          {/* Task List */}
          <div className="p-5 space-y-3">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mb-4">
                  <ListChecks className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-gray-600 font-semibold text-sm">
                  No tasks yet
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {isAdmin
                    ? "Assign a task to get started."
                    : "Tasks assigned to you will appear here."}
                </p>
              </div>
            ) : (
              tasks.map((task: any) => {
                const priority = (task.priority ?? "Normal") as Priority;
                return (
                  <div
                    key={task.task_id}
                    className={`task-card group relative bg-white rounded-xl overflow-hidden priority-left-bar-${priority}`}
                    style={{ border: "1px solid #e5e7eb" }}
                  >
                    <div className="p-5">
                      {/* Row 1: Title + delete */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 leading-snug truncate">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() =>
                              handleDelete(task.user_id, task.task_id)
                            }
                            disabled={deletingId === task.task_id}
                            className="delete-btn flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-300 disabled:opacity-50 mt-0.5"
                            title="Delete task"
                          >
                            {deletingId === task.task_id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Row 2: Assignee + Deadline */}
                      <div className="text-black flex flex-wrap gap-2 mt-3">
                        <div className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-100 text-violet-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                          {isAdmin ? (
                            <ShieldCheck className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />
                          ) : (
                            <User className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />
                          )}
                          <span className="text-violet-500">
                            {isAdmin ? "To:" : "By:"}
                          </span>
                          <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-violet-800">
                              {isAdmin
                                ? task.assigned_to_name
                                : task.assigned_by}
                            </span>
                            <span className="text-[10px] text-violet-400 font-mono">
                              {isAdmin
                                ? task.assigned_to_email
                                : task.assigned_by_email}
                            </span>
                          </div>
                        </div>

                        <div className="text-black flex justify-center items-center items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                          <CalendarDays className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />
                          <span className="text-rose-400 mr-2">DateLine:</span>
                          <span className="font-semibold font-mono text-rose-700">
                            {task.deadline
                              ? new Date(task.deadline).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </span>
                        </div>
                      </div>

                      {/* Row 3: Controls + Timestamp */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3.5 border-t border-gray-100">
                        <div className="flex flex-wrap items-center gap-3">
                          {/* Status */}
                          <div className=" flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                              Status
                            </span>

                            {isAdmin ? (
                              // 👇 Admin → only view
                              <span
                                className={`px-2 py-[2px] rounded text-[10px] font-bold uppercase text-black ${
                                  task.status === "pending"
                                    ? "bg-gray-200"
                                    : task.status === "ongoing"
                                      ? "bg-blue-200"
                                      : task.status === "complete"
                                        ? "bg-green-200"
                                        : "bg-gray-200"
                                }`}
                              >
                                {task.status}
                              </span>
                            ) : (
                              // 👇 User → dropdown
                              <StyledSelect
                                value={task.status}
                                onChange={(v) =>
                                  handleUpdateTask(task, { status: v })
                                }
                                options={[
                                  { value: "pending", label: "Pending" },
                                  { value: "ongoing", label: "Ongoing" },
                                  { value: "complete", label: "Complete" },
                                ]}
                                colorMap={statusColorMap}
                              />
                            )}
                          </div>

                          <div className="w-px h-5 bg-gray-200 hidden sm:block" />

                          {/* Priority */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-[10px] font-bold uppercase tracking-widest">
                              {/* <span className="text-gray-400">Priority :</span> */}

                              <span
                                className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap
    ${
      task?.priority === "High"
        ? "text-red-500"
        : task?.priority === "Medium"
          ? "text-yellow-500"
          : task?.priority === "Low"
            ? "text-green-500"
            : "text-gray-400"
    }
  `}
                              >
                                Priority : {task?.priority}
                              </span>
                            </div>
                            {/* {isAdmin ? (
                              <StyledSelect<Priority>
                                value={priority}
                                onChange={(v) =>
                                  handleUpdateTask(task, { priority: v })
                                }
                                options={[
                                  { value: "Normal", label: "· Normal" },
                                  { value: "Medium", label: " Medium" },
                                  { value: "High", label: " High" },
                                ]}
                                colorMap={priorityColorMap}
                              />
                            ) : (
                              <PriorityBadge priority={priority} />
                            )} */}
                          </div>
                        </div>

                        {/* Created timestamp */}
                        <span className="text-[10px] text-gray-400 font-mono bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                          Created at{" "}
                          {new Date(task.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                          {" · "}
                          {new Date(task.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {isAdmin && (
          <AddTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddTask={handleAddTask}
          />
        )}
      </div>
    </>
  );
}
