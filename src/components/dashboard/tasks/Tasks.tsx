"use client";

import React, { useState, useEffect, useMemo } from "react";
import AddTaskModal from "./AddTaskModal";
import { ITask, ICreateTask } from "@/@types/interface/tasks.interfaces";
import { Priority } from "@/@types/constant/priority.constant";
import { useTasks } from "@/hooks/useTasks";
import { useAuthContext } from "@/context/AuthContext";
import {
  Trash2,
  AlertCircle,
  ListChecks,
  Plus,
  X,
  Loader2,
  CalendarDays,
  User,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import {
  createTask,
  // deleteTask,
  updateTaskStatus,
  fetchTaskStats,
  adminDeleteTask,
} from "@/utils/api/tasksApi";
import {fetchAdminStats,assigntask,adminUpdateTask}  from "@/utils/api/admin/admin"; 
import Stats from "../stats/Stats";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = userData?.data?.user_data?.role === "admin";
  const isCoordinator = userData?.data?.user_data?.role === "coordinator";
  const isNormalUser = !isAdmin && !isCoordinator;
  const currentUserId = userData?.data?.user_data?.user_id;

  const { tasks, getTasks } = useTasks(userData?.data?.user_data?.role);
  
  const [view, setView] = useState<"all" | "assigned_to_me" | "assigned_by_me">("all");

  const displayTasks = useMemo(() => {
    if (!isCoordinator) return tasks;
    if (view === "assigned_by_me") return tasks.filter(t => t.assigned_by_id === currentUserId);
    if (view === "assigned_to_me") return tasks.filter(t => t.user_id === currentUserId);
    return tasks;
  }, [tasks, view, isCoordinator, currentUserId]);

  const calculatedStats = useMemo(() => {
    const s = {
      total: displayTasks.length,
      pending: displayTasks.filter(t => t.status === "pending").length,
      ongoing: displayTasks.filter(t => t.status === "ongoing").length,
      complete: displayTasks.filter(t => t.status === "complete").length,
      "on-hold": displayTasks.filter(t => t.status === "on-hold").length,
    };
    return s;
  }, [displayTasks]);

  // High Priority Tasks for warning bar
  const highPriorityTasks = useMemo(() => {
    if (isNormalUser) {
      return tasks.filter(t => t.priority === "High" && t.status !== "complete");
    }
    if (isCoordinator) {
      // Show high priority tasks assigned TO the coordinator, regardless of view
      return tasks.filter(t => t.user_id === currentUserId && t.priority === "High" && t.status !== "complete");
    }
    return [];
  }, [tasks, isNormalUser, isCoordinator, currentUserId]);

  useEffect(() => {
    const getStats = async () => {
      try {
        if (isAdmin) {
          await fetchAdminStats();
        } else {
          await fetchTaskStats();
        }
        // Even if we fetch, we are using calculatedStats for primary UI
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    if (userData?.data?.user_data?.role) getStats();
  }, [userData?.data?.user_data?.role, tasks, isAdmin]);

  const handleUpdateTask = async (task: ITask, updates: Partial<ITask>) => {
    try {
      if (updates.status === "ongoing") {
        // Check if the assignee already has an ongoing task
        const isSelf = task.user_id === currentUserId;
        const alreadyOngoing = tasks.some(
          (t) => t.status === "ongoing" && t.user_id === task.user_id && t.task_id !== task.task_id
        );

        if (alreadyOngoing) {
          setErrorMsg(isSelf ? "You can do one task at a time" : "This user already has an ongoing task");
          return;
        }
      }

      if (updates.status === "on-hold") {
        const userInput = window.prompt("Why do you want to put this task on hold?", task.on_hold_reason || "");
        if (userInput === null) return; // cancel update
        updates.on_hold_reason = userInput;
      }

      // if (isAdmin) {
      //   await adminUpdateTask(task.user_id, task.task_id, updates);
      // }
      // else if (isCoordinator) {
      //   await adminUpdateTask(task.user_id, task.task_id, updates);
      // } 
      // else {
        if (updates.status) {
          await updateTaskStatus(task.task_id, updates.status as "pending" | "ongoing" | "complete" | "on-hold", updates.on_hold_reason);
        } else {
          console.warn("Non-admin users can only update task status.");
        }
      // }
      await getTasks();
      await fetchUser(); 
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Failed to update task:", err);
      
      // If backend returns a generic error, we can still show our custom message if we detect it's a conflict
      if (err.message.toLowerCase().includes("failed") && updates.status === "ongoing") {
         setErrorMsg("You can do one task at a time");
      } else {
         setErrorMsg(err.message || "Operation failed");
      }
      await getTasks();
    }
  };

  const handleDelete = async (targetUserId: string, taskId: string) => {
    setDeletingId(taskId);
    try {
      if (isAdmin || isCoordinator) await adminDeleteTask(targetUserId, taskId);
      // else await deleteTask(taskId);
      await getTasks();
      await fetchUser();
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddTask = async (data: ICreateTask) => {
    try {
      if (isAdmin || isCoordinator) {
        await assigntask(data);
      } 
      
      // else {
      //   await createTask(data);
      // }
      await getTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const statusColorMap: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-300",
    ongoing: "bg-blue-100 text-blue-800 border-blue-300",
    complete: "bg-green-100 text-green-800 border-green-300",
    "on-hold": "bg-orange-100 text-orange-800 border-orange-300",
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
        .priority-left-bar-Low    { border-left: 3px solid #cbd5e1; }
        
        .high-priority-alert {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div className="tasks-root w-full max-w-5xl mx-auto space-y-6">
        
        {/* High Priority Warning Bar */}
        {highPriorityTasks.length > 0 && (
  <div className="rounded-2xl overflow-hidden border border-red-200 shadow-md shadow-red-100/50">
    {/* Top severity strip */}
    <div className="bg-red-600 px-5 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-100">
          Priority Alert · Action Required
        </span>
      </div>
      <span className="text-[10px] font-bold text-red-200 tracking-wider uppercase">
        HIGH
      </span>
    </div>

    {/* Main body */}
    <div className="bg-red-50 px-5 py-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-red-900 leading-snug">
            {highPriorityTasks.length} High Priority Task{highPriorityTasks.length > 1 ? "s" : ""} Require{highPriorityTasks.length === 1 ? "s" : ""} Attention
          </p>
          <p className="text-xs text-red-600 mt-1 leading-relaxed font-medium">
            {highPriorityTasks.map(t => t.title).join(" · ")}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0 mt-0.5">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white text-sm font-extrabold shadow-sm">
          {highPriorityTasks.length}
        </span>
      </div>
    </div>

    {/* Bottom task pills row */}
    <div className="bg-white border-t border-red-100 px-5 py-2.5 flex flex-wrap gap-2">
      {highPriorityTasks.map(t => (
        <span
          key={t.task_id}
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
            t.status === "complete"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            t.status === "complete" ? "bg-green-500" : "bg-red-500"
          }`} />
          {t.title}
          {t.status === "complete" && (
            <span className="text-[9px] uppercase tracking-wider text-green-600 font-bold ml-0.5">✓ Done</span>
          )}
        </span>
      ))}
    </div>
  </div>
)}

        <Stats stats={calculatedStats} />

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
                  {isAdmin ? "All Tasks" : (isCoordinator ? (view === "assigned_by_me" ? "Tasks You Created" : "Tasks Assigned To You") : "Your Tasks")}
                </h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  {displayTasks.length} task{displayTasks.length !== 1 ? "s" : ""} {view === "all" ? "total" : "in this view"}
                </p>
              </div>
            </div>
            {(isAdmin || isCoordinator) && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm shadow-indigo-200"
              >
                <Plus className="h-4 w-4" />
                Assign Task
              </button>
            )}
          </div>

          {/* Coordinator Switcher */}
          {isCoordinator && (
            <div className="px-6 py-2 border-b border-gray-100 bg-gray-50 flex gap-2">
               <button 
                 onClick={() => setView("all")}
                 className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${view === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}
               >
                 All
               </button>
               <button 
                 onClick={() => setView("assigned_by_me")}
                 className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${view === "assigned_by_me" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}
               >
                 Your Tasks
               </button>
               <button 
                 onClick={() => setView("assigned_to_me")}
                 className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${view === "assigned_to_me" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}
               >
                 Assigned Tasks
               </button>
            </div>
          )}

          {/* Task List */}
          <div className="p-5 space-y-3">
            {displayTasks.length === 0 ? (
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
              displayTasks.map((task: ITask) => {
                const priority = (task.priority ?? "Low") as Priority;
                const isAssignedByMe = task.assigned_by_id === currentUserId;
                const isAssignedToMe = task.user_id === currentUserId;

                const canDelete = isAdmin || (isCoordinator && isAssignedByMe && !isAssignedToMe);
                const canUpdateStatus = ((!isAdmin && !isCoordinator) || (isCoordinator && isAssignedToMe)) && task.status !== "complete";
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
                        {canDelete && (
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
                            {isAdmin || (isCoordinator && isAssignedByMe) ? "To:" : "By:"}
                          </span>
                          <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-violet-800">
                              {(isAdmin || (isCoordinator && isAssignedByMe))
                                ? task.assigned_to_name
                                : task.assigned_by}
                            </span>
                            <span className="text-[10px] text-violet-400 font-mono">
                              {(isAdmin || (isCoordinator && isAssignedByMe))
                                ? task.assigned_to_email
                                : task.assigned_by_email}
                            </span>
                          </div>
                        </div>

                        <div className="text-black flex justify-center items-center items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                          <CalendarDays className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />
                          <span className="text-rose-400 mr-2">Deadline:</span>
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
                          <div className="flex flex-col gap-2">
                            <div className=" flex items-center gap-2">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                Status
                              </span>

                              {canUpdateStatus ? (
                                <StyledSelect
                                  value={task.status}
                                  onChange={(v) =>
                                    handleUpdateTask(task, { status: v })
                                  }
                                  options={[
                                    { value: "pending", label: "Pending" },
                                    { value: "ongoing", label: "Ongoing" },
                                    { value: "complete", label: "Complete" },
                                    { value: "on-hold", label: "On-hold" },
                                  ]}
                                  colorMap={statusColorMap}
                                />
                              ) : (
                                <span
                                  className={`px-2 py-[2px] rounded text-[10px] font-bold uppercase text-black ${
                                    task.status === "pending"
                                      ? "bg-gray-200"
                                      : task.status === "ongoing"
                                        ? "bg-blue-200"
                                        : task.status === "complete"
                                          ? "bg-green-200"
                                          : task.status === "on-hold"
                                            ? "bg-yellow-200"
                                            : "bg-gray-200"
                                  }`}
                                >
                                  {task.status}
                                </span>
                              )}
                            </div>
                            {task.status === "on-hold" && task.on_hold_reason && (
                              <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-800 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                                <span className="font-bold uppercase mr-1">Reason:</span>
                                {task.on_hold_reason}
                              </div>
                            )}
                          </div>

                          <div className="w-px h-5 bg-gray-200 hidden sm:block" />

                          {/* Priority */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-[10px] font-bold uppercase tracking-widest">
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

        {(isAdmin || isCoordinator) && (
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
