"use client";
import { useEffect, useState, useMemo } from "react";
import { getalldata } from "@/utils/api/decentralized/publicapi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Task = {
  task_id: string;
  user_id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  created_at?: string;
  deadline?: string;
  assigned_by?: string;
  assigned_to_name?: string;
  assigned_by_email?: string;
  assigned_to_email?: string;
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
    color: "#10b981",
  },
  ongoing: {
    label: "Ongoing",
    classes: "bg-blue-100 text-blue-800 ring-1 ring-blue-300",
    dot: "bg-blue-600",
    color: "#2563eb",
  },
  pending: {
    label: "Pending",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
    color: "#f59e0b",
  },
  unknown: {
    label: "—",
    classes: "bg-gray-50 text-gray-400 ring-1 ring-gray-200",
    dot: "bg-gray-300",
    color: "#9ca3af",
  },
};

const TABS = [
  { key: "all", label: "All" },
  { key: "ongoing", label: "Ongoing" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
] as const;


function CustomBlinkingDot(props: { cx?: number; cy?: number }) {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="#2563eb" className="animate-ping opacity-75" />
      <circle cx={cx} cy={cy} r={4} fill="#2563eb" />
    </g>
  );
}

function StatCardWithChart({
  label,
  value,
  children,
  className = "",
}: {
  label: string;
  value: string | number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 group hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
        </div>
      </div>
      <div className="h-40 w-full">
        {children}
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

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Status Counts
    const counts = tasks.reduce(
      (acc, t) => {
        const s = normalizeStatus(t.status);
        if (s !== "unknown") acc[s] = (acc[s] || 0) + 1;
        return acc;
      },
      { completed: 0, ongoing: 0, pending: 0 } as Record<string, number>,
    );

    const statusData = [
      { name: "Ongoing", value: counts.ongoing, color: STATUS_CONFIG.ongoing.color },
      { name: "Pending", value: counts.pending, color: STATUS_CONFIG.pending.color },
      { name: "Completed", value: counts.completed, color: STATUS_CONFIG.completed.color },
    ];

    // Tasks in 10 Days
    const next10DaysTasks: { date: string; count: number }[] = [];
    let totalIn10Days = 0;
    for (let i = 0; i < 11; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      
      const count = tasks.filter(t => t.deadline === dateStr).length;
      next10DaysTasks.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count,
      });
      totalIn10Days += count;
    }

    // Top Assigners
    const assignerMap: Record<string, { count: number; name: string }> = {};
    tasks.forEach(t => {
      const email = t.assigned_by_email || t.assigned_by || "Unknown";
      const name = t.assigned_by || "Unknown";
      if (!assignerMap[email]) assignerMap[email] = { count: 0, name };
      assignerMap[email].count++;
    });
    const topAssigners = Object.values(assignerMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top Completers
    const completerMap: Record<string, { count: number; name: string }> = {};
    tasks.forEach(t => {
      if (normalizeStatus(t.status) === "completed") {
        const email = t.assigned_to_email || "Unknown";
        const name = t.assigned_to_name || "Unknown";
        if (!completerMap[email]) completerMap[email] = { count: 0, name };
        completerMap[email].count++;
      }
    });
    const topCompleters = Object.values(completerMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { counts, statusData, next10DaysTasks, totalIn10Days, topAssigners, topCompleters };
  }, [tasks]);

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
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-700 animate-spin" />
          <p className="text-xs text-gray-400 tracking-widest uppercase">Loading tasks…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">Real-time performance and task distribution</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total System Tasks</p>
            <p className="text-4xl font-black text-gray-900">{tasks.length}</p>
          </div>
        </div>

        {/* Hero Section - Line Chart for 10 Days */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upcoming Deadlines</h2>
                <p className="text-sm text-gray-400">Total tasks due in the next 10 days</p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                <p className="text-2xl font-bold text-blue-600 leading-none">{stats.totalIn10Days}</p>
                <p className="text-[10px] font-bold text-blue-400 uppercase mt-1">Due Soon</p>
              </div>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.next10DaysTasks} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    hide 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="url(#lineGradient)" 
                    strokeWidth={4} 
                    dot={<CustomBlinkingDot />}
                    activeDot={{ r: 8, fill: '#1e40af' }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Middle Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Bar Chart */}
          <StatCardWithChart label="Status Overivew" value={stats.counts.ongoing + stats.counts.pending + stats.counts.completed}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.statusData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </StatCardWithChart>

          {/* Top Assigner Bar Chart */}
          <StatCardWithChart label="Top Assigners" value={stats.topAssigners.length > 0 ? stats.topAssigners[0].name : "—"}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topAssigners} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748b' }}
                  width={70}
                />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </StatCardWithChart>

          {/* Top Completer Bar Chart */}
          <StatCardWithChart label="Top Completers" value={stats.topCompleters.length > 0 ? stats.topCompleters[0].name : "—"}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topCompleters} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748b' }}
                  width={70}
                />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#34d399" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </StatCardWithChart>
        </div>

        {/* Existing View Section (Filtered Table) */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Task Inventory</h2>
            <div className="flex gap-4">
               {/* Search */}
               <div className="relative flex-shrink-0">
                <input
                  type="text"
                  placeholder="Filter tasks…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-4 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 w-48 transition-all duration-150"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-white">
              <div className="flex gap-2 flex-wrap">
                {TABS.map((tab) => {
                  const count =
                    tab.key === "all"
                      ? tasks.length
                      : tab.key === "ongoing"
                        ? stats.counts.ongoing
                        : tab.key === "pending"
                          ? stats.counts.pending
                          : stats.counts.completed;
                  const active = filter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key as typeof filter)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2
                        ${active ? "bg-gray-900 text-white shadow-lg shadow-gray-200" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                      {tab.label}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-100"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "600px" }}>
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                  <tr>
                    {[
                      { label: "#", width: "w-16" },
                      { label: "Task Information", width: "" },
                      { label: "Status", width: "w-32" },
                      { label: "Priority", width: "w-32" },
                      { label: "Assignee", width: "w-56" },
                      { label: "Deadline", width: "w-40" },
                    ].map((h, i) => (
                      <th key={i} className={`text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap ${h.width}`}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <p className="text-sm text-gray-400 font-medium">No results found for your query</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((task, i) => {
                      const s = normalizeStatus(task.status);
                      const cfg = STATUS_CONFIG[s];
                      return (
                        <tr key={task.task_id} className="hover:bg-blue-50/20 transition-colors group">
                          <td className="px-6 py-5 text-xs font-mono text-gray-300">{String(i + 1).padStart(2, '0')}</td>
                          <td className="px-6 py-5">
                            <p className="font-bold text-gray-800 text-sm">{task.title || "Untitled"}</p>
                            {task.description && <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{task.description}</p>}
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.classes}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.classes}`}>
                              {/* <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /> */}
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                                {(task.assigned_to_name || "??").slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-700">{task.assigned_to_name || "Unassigned"}</p>
                                <p className="text-[10px] text-gray-400">{task.assigned_to_email || "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-xs text-gray-600 font-medium">
                            {task.deadline || "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
