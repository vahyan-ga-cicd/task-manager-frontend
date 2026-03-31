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
  updateTaskStatus,
  fetchTaskStats,
  adminDeleteTask,
} from "@/utils/api/tasksApi";
import {
  fetchAdminStats,
  assigntask,
} from "@/utils/api/admin/admin";
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

  // Status Action Modal States
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionModalConfig, setActionModalConfig] = useState<{
    title: string;
    placeholder: string;
    confirmText: string;
    targetStatus: "complete" | "on-hold";
    task: ITask | null;
  }>({
    title: "",
    placeholder: "",
    confirmText: "",
    targetStatus: "on-hold",
    task: null,
  });
  const [actionComment, setActionComment] = useState("");
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const isAdmin = userData?.data?.user_data?.role === "admin";
  const isCoordinator = userData?.data?.user_data?.role === "coordinator";
  const isNormalUser = !isAdmin && !isCoordinator;
  const currentUserId = userData?.data?.user_data?.user_id;

  const { tasks, getTasks } = useTasks(userData?.data?.user_data?.role);

  const [view, setView] = useState<"all" | "assigned_to_me" | "assigned_by_me">(
    "all",
  );

  const displayTasks = useMemo(() => {
    if (!isCoordinator) return tasks;
    if (view === "assigned_by_me")
      return tasks.filter(
        (t) => t.assigned_by_id === currentUserId && t.user_id !== currentUserId,
      );
    if (view === "assigned_to_me")
      return tasks.filter((t) => t.user_id === currentUserId);
    return tasks;
  }, [tasks, view, isCoordinator, currentUserId]);

  const calculatedStats = useMemo(() => {
    return {
      total: displayTasks.length,
      pending: displayTasks.filter((t) => t.status === "pending").length,
      ongoing: displayTasks.filter((t) => t.status === "ongoing").length,
      complete: displayTasks.filter((t) => t.status === "complete").length,
      "on-hold": displayTasks.filter((t) => t.status === "on-hold").length,
    };
  }, [displayTasks]);

  const highPriorityTasks = useMemo(() => {
    if (isNormalUser) {
      return tasks.filter(
        (t) => t.priority === "High" && t.status !== "complete",
      );
    }
    if (isCoordinator) {
      return tasks.filter(
        (t) =>
          t.user_id === currentUserId &&
          t.priority === "High" &&
          t.status !== "complete",
      );
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
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    if (userData?.data?.user_data?.role) getStats();
  }, [userData?.data?.user_data?.role, tasks, isAdmin]);

  const handleUpdateTask = async (task: ITask, updates: Partial<ITask>) => {
    try {
      if (updates.status === "ongoing") {
        const alreadyOngoing = tasks.some(
          (t) =>
            t.status === "ongoing" &&
            t.user_id === task.user_id &&
            t.task_id !== task.task_id,
        );

        if (alreadyOngoing) {
          setErrorMsg(
            task.user_id === currentUserId
              ? "You can do one task at a time"
              : "This user already has an ongoing task",
          );
          return;
        }
      }

      const isForceComplete =
        isCoordinator && updates.status === "complete" && view !== "assigned_to_me";

      if (updates.status === "on-hold" || isForceComplete) {
        setActionModalConfig({
          task,
          targetStatus: updates.status as "complete" | "on-hold",
          title: isForceComplete ? "Force Complete Task" : "Put Task On Hold",
          placeholder: isForceComplete
            ? "Enter reason for force completing this task..."
            : "Why do you want to put this task on hold?",
          confirmText: isForceComplete ? "Force Complete" : "Confirm On-Hold",
        });
        setActionComment(task.on_hold_reason || "");
        setIsActionModalOpen(true);
        return;
      }

      if (updates.status) {
        await updateTaskStatus(
          task.user_id,
          task.task_id,
          updates.status as "pending" | "ongoing" | "complete" | "on-hold",
          updates.on_hold_reason,
          updates.verified_by_coordinator,
          updates.coordinator_comment,
        );
      }
      await getTasks();
      await fetchUser();
    } catch (error: unknown) {
      console.error("Failed to update task:", error);
      setErrorMsg((error as Error).message || "Operation failed");
    }
  };

  const handleActionModalConfirm = async () => {
    if (!actionComment.trim()) {
      setErrorMsg("Please provide a reason/comment");
      return;
    }

    const { task, targetStatus } = actionModalConfig;
    if (!task) return;

    setIsActionSubmitting(true);
    try {
      const isForceComplete = targetStatus === "complete";
      
      await updateTaskStatus(
        task.user_id,
        task.task_id,
        targetStatus,
        !isForceComplete ? actionComment : undefined,
        isForceComplete ? true : undefined,
        isForceComplete ? actionComment : undefined,
      );

      await getTasks();
      await fetchUser();
      setIsActionModalOpen(false);
      setActionComment("");
    } catch (error: unknown) {
      setErrorMsg((error as Error).message || "Action failed");
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleDelete = async (targetUserId: string, taskId: string) => {
    setDeletingId(taskId);
    try {
      if (isAdmin || isCoordinator) await adminDeleteTask(targetUserId, taskId);
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
        .task-card { animation: fadeUp 0.3s ease both; transition: all 0.2s ease; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .task-card:hover { box-shadow: 0 6px 24px rgba(99,102,241,0.10); border-color: #a5b4fc !important; transform: translateY(-2px); }
        .priority-left-bar-High { border-left: 3px solid #f87171; }
        .priority-left-bar-Medium { border-left: 3px solid #fb923c; }
        .priority-left-bar-Low { border-left: 3px solid #cbd5e1; }
      `}</style>

      <div className="tasks-root w-full space-y-6">
        {highPriorityTasks.length > 0 && (
          <div className="rounded-2xl overflow-hidden border border-red-200 shadow-md">
            <div className="bg-red-600 px-5 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-100">Priority Alert</span>
              </div>
            </div>
            <div className="bg-red-50 px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-red-900">{highPriorityTasks.length} High Priority Tasks Need Attention</p>
                <p className="text-xs text-red-600 truncate">{highPriorityTasks.map(t => t.title).join(" · ")}</p>
              </div>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">{highPriorityTasks.length}</span>
            </div>
          </div>
        )}

        <Stats stats={calculatedStats} />

        {errorMsg && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-700 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="flex-1 font-medium">{errorMsg}</p>
            <button onClick={() => setErrorMsg(null)}><X className="h-4 w-4" /></button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                <ListChecks className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {isAdmin ? "All Tasks" : isCoordinator ? (view === "assigned_by_me" ? "Tasks You Created" : "Tasks Assigned To You") : "Your Tasks"}
                </h3>
              </div>
            </div>
            {(isAdmin || isCoordinator) && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                <Plus className="h-4 w-4" /> Assign Task
              </button>
            )}
          </div>

          {isCoordinator && (
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-2">
              {(["all", "assigned_by_me", "assigned_to_me"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${view === v ? "bg-indigo-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}
                >
                  {v === "assigned_by_me" ? "Tasks Created By Me" : v === "assigned_to_me" ? "Tasks Assigned To Me" : "All Tasks"}
                </button>
              ))}
            </div>
          )}

          <div className="p-5 space-y-3">
            {displayTasks.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <ListChecks className="h-10 w-10 mx-auto opacity-20 mb-2" />
                <p className="text-sm font-medium">No tasks found</p>
              </div>
            ) : (
              displayTasks.map((task) => {
                const priority = (task.priority ?? "Low") as Priority;
                const isAssignedByMe = task.assigned_by_id === currentUserId;
                const isAssignedToMe = task.user_id === currentUserId;

                const canDelete = isAdmin || (isCoordinator && isAssignedByMe && !isAssignedToMe);
                const canUpdateStatus = !task.verified_by_coordinator && (!task.status.includes("complete") && (isNormalUser || isAssignedToMe || isAssignedByMe));

                return (
                  <div key={task.task_id} className={`task-card group bg-white rounded-xl border border-gray-100 p-4 priority-left-bar-${priority}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{task.title}</h4>
                        {task.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</p>}
                      </div>
                      {canDelete && (
                        <button onClick={() => handleDelete(task.user_id, task.task_id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                          {deletingId === task.task_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 bg-violet-50 text-violet-700 px-2 py-1 rounded-lg text-[10px] font-bold w-fit">
                          <User className="h-3 w-3" />
                          <span>{isAssignedByMe ? `To: ${task.assigned_to_name}` : `By: ${task.assigned_by}`}</span>
                        </div>
                        {isAssignedByMe ? 
                          task.assigned_to_email && <span className="text-[9px] text-gray-400 ml-1 leading-none">{task.assigned_to_email}</span> :
                          task.assigned_by_email && <span className="text-[9px] text-gray-400 ml-1 leading-none">{task.assigned_by_email}</span>
                        }
                      </div>
                      <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2 py-1 rounded-lg text-[10px] font-bold h-fit">
                        <CalendarDays className="h-3 w-3" />
                        <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : "No Deadline"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                          <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">Status</span>
                          {canUpdateStatus ? (
                            isCoordinator && !isAssignedToMe ? (
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${statusColorMap[task.status]}`}>{task.status}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-gray-400">Force:</span>
                                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-full border border-gray-200">
                                    <button
                                      onClick={() => {}} 
                                      className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold transition-all ${task.status !== 'complete' ? 'bg-white shadow-sm text-gray-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                      N
                                    </button>
                                    <button
                                      onClick={() => handleUpdateTask(task, { status: "complete" })}
                                      className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold transition-all ${task.status === 'complete' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-indigo-600'}`}
                                    >
                                      Y
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <StyledSelect
                                value={task.status}
                                onChange={(v) => handleUpdateTask(task, { status: v })}
                                options={[{value:"pending", label:"Pending"},{value:"ongoing", label:"Ongoing"},{value:"complete", label:"Complete"},{value:"on-hold", label:"On-hold"}]}
                                colorMap={statusColorMap}
                              />
                            )
                          ) : (
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${statusColorMap[task.status]}`}>{task.status}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {task.status === "complete" && task.completed_at && (
                          <span className="text-[10px] text-indigo-500 font-bold font-mono bg-indigo-50 px-2 py-0.5 rounded">
                            Done: {new Date(task.completed_at).toLocaleString()}
                          </span>
                        )}
                        <span className="text-[9px] text-gray-400 font-mono pr-1">Created: {new Date(task.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {(task.status === "on-hold" && task.on_hold_reason) && (
                      <div className="mt-2 p-2 bg-amber-50 text-[10px] text-amber-800 rounded-lg border border-amber-100 italic">
                        On-Hold Reason: {task.on_hold_reason}
                      </div>
                    )}
                    {task.verified_by_coordinator && task.coordinator_comment && (
                      <div className="mt-2 p-2 bg-emerald-50 text-[10px] text-emerald-800 rounded-lg border border-emerald-100 italic">
                        Verified: {task.coordinator_comment}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} />

        {isActionModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`h-5 w-5 ${actionModalConfig.targetStatus === "complete" ? "text-green-600" : "text-orange-600"}`} />
                  <h3 className="text-lg font-bold text-gray-900">{actionModalConfig.title}</h3>
                </div>
                <button onClick={() => setIsActionModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-xl transition-all"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <textarea
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  rows={4}
                  autoFocus
                  placeholder={actionModalConfig.placeholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm placeholder-black text-black"
                />
                <div className="flex gap-3">
                  <button onClick={() => setIsActionModalOpen(false)} className="flex-1 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm">Cancel</button>
                  <button
                    onClick={handleActionModalConfirm}
                    disabled={isActionSubmitting || !actionComment.trim()}
                    className={`flex-1 px-5 py-2.5 text-white rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${actionModalConfig.targetStatus === "complete" ? "bg-indigo-600" : "bg-orange-500"}`}
                  >
                    {isActionSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : actionModalConfig.confirmText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
