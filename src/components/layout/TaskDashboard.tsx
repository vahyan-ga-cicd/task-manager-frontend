"use client";
import { useEffect, useState } from "react";
import { getalldata } from "@/utils/api/decentralized/publicapi";

type Task = {
  task_id: string;
  user_id: string;
  title?: string;
  description?: string;
  status?: string;
  created_at?: string;
  deadline?: string;
  assigned_by?: string;
  assigned_to_name?: string;
};

function normalizeStatus(
  status?: string,
): "completed" | "ongoing" | "pending" | "unknown" {
  if (!status) return "unknown";
  const s = status.toLowerCase().trim();
  if (s === "completed" || s === "complete") return "completed";
  if (s === "ongoing") return "ongoing";
  if (s === "pending") return "pending";
  return "unknown";
}

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  ongoing: {
    label: "Ongoing",
    classes: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    dot: "bg-sky-500",
  },
  pending: {
    label: "Pending",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
  },
  unknown: {
    label: "—",
    classes: "bg-gray-50 text-gray-400 ring-1 ring-gray-200",
    dot: "bg-gray-300",
  },
};

const TABS = [
  { key: "all", label: "All" },
  { key: "ongoing", label: "Ongoing" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
] as const;

function formatDate(d?: string) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function Initials({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const palettes = [
    "bg-violet-100 text-violet-600",
    "bg-sky-100 text-sky-600",
    "bg-emerald-100 text-emerald-600",
    "bg-rose-100 text-rose-600",
    "bg-amber-100 text-amber-600",
    "bg-indigo-100 text-indigo-600",
  ];
  const palette = palettes[name.charCodeAt(0) % palettes.length];
  const dim = size === "md" ? "w-8 h-8 text-xs" : "w-6 h-6 text-[10px]";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold uppercase shrink-0 ${dim} ${palette}`}
    >
      {name.slice(0, 2)}
    </span>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "ongoing" | "pending">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getalldata();
        setTasks(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = tasks.reduce(
    (acc, t) => {
      const s = normalizeStatus(t.status);
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    { completed: 0, ongoing: 0, pending: 0, unknown: 0 } as Record<string, number>,
  );

  const filtered = tasks
    .filter((t) => filter === "all" || normalizeStatus(t.status) === filter)
    .filter(
      (t) =>
        !search ||
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.assigned_to_name?.toLowerCase().includes(search.toLowerCase()) ||
        t.assigned_by?.toLowerCase().includes(search.toLowerCase()),
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin" />
          <p className="text-xs text-gray-400 tracking-wide">Loading tasks…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Task Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">
              {tasks.length} tasks across the platform
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Tasks"
            value={tasks.length}
            accent="bg-gray-100"
            icon={
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard
            label="Ongoing"
            value={counts.ongoing}
            accent="bg-sky-50"
            icon={
              <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
          <StatCard
            label="Pending"
            value={counts.pending}
            accent="bg-amber-50"
            icon={
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            }
          />
          <StatCard
            label="Completed"
            value={counts.completed}
            accent="bg-emerald-50"
            icon={
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            {/* Tabs */}
            <div className="flex gap-1">
              {TABS.map((tab) => {
                const count =
                  tab.key === "all" ? tasks.length
                  : tab.key === "ongoing" ? counts.ongoing
                  : tab.key === "pending" ? counts.pending
                  : counts.completed;
                const active = filter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as typeof filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5
                      ${active
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {tab.label}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                      ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative">
              {/* <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg> */}
              <input
                type="text"
                placeholder="Search tasks or assignees…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white w-52 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["#", "Task", "Status", "Assigned To", "Assigned By", "Deadline", "Created"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-300">
                        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p className="text-xs text-gray-400">No tasks match your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((task, i) => {
                    const s = normalizeStatus(task.status);
                    const cfg = STATUS_CONFIG[s];
                    const isOverdue =
                      task.deadline &&
                      new Date(task.deadline) < new Date() &&
                      s !== "completed";

                    return (
                      <tr
                        key={`${i}-${task.task_id}`}
                        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group"
                      >
                        {/* # */}
                        <td className="px-5 py-3.5 text-xs text-gray-300 font-medium w-10">
                          {String(i + 1).padStart(2, "0")}
                        </td>

                        {/* Task */}
                        <td className="px-5 py-3.5 max-w-[200px]">
                          <p className="font-semibold text-gray-800 truncate text-sm group-hover:text-gray-900 transition-colors">
                            {task.title || <span className="text-gray-300 font-normal italic text-xs">Untitled</span>}
                          </p>
                          {task.description && (
                            <p className="text-[11px] text-gray-400 truncate mt-0.5 max-w-[180px]">
                              {task.description}
                            </p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.classes}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>

                        {/* Assigned To */}
                        <td className="px-5 py-3.5">
                          {task.assigned_to_name ? (
                            <div className="flex items-center gap-2">
                              <Initials name={task.assigned_to_name} />
                              <span className="text-xs text-gray-700 truncate max-w-[100px]">{task.assigned_to_name}</span>
                            </div>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Assigned By */}
                        <td className="px-5 py-3.5">
                          {task.assigned_by ? (
                            <div className="flex items-center gap-2">
                              <Initials name={task.assigned_by} />
                              <span className="text-xs text-gray-700 truncate max-w-[100px]">{task.assigned_by}</span>
                            </div>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Deadline */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {task.deadline ? (
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg
                              ${isOverdue
                                ? "bg-red-50 text-red-500 ring-1 ring-red-200"
                                : "bg-gray-50 text-gray-500 ring-1 ring-gray-200"
                              }`}
                            >
                              {isOverdue && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              )}
                              {formatDate(task.deadline)}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>

                        {/* Created */}
                        <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(task.created_at) || "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-600">{tasks.length}</span>{" "}
              tasks
            </p>
            <div className="flex items-center gap-4">
              {[
                { dot: "bg-sky-500", label: "Ongoing" },
                { dot: "bg-amber-400", label: "Pending" },
                { dot: "bg-emerald-500", label: "Completed" },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${l.dot}`} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}