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
  ReferenceLine,
  LabelList,
} from "recharts";
import { Search } from "lucide-react";
import { ITaskResponse } from "@/@types/interface/decentralized.interface";



function normalizeStatus(
  status?: string,
): "completed" | "ongoing" | "pending" | "on-hold" | "unknown" {
  if (!status) return "unknown";
  const s = status.toLowerCase().trim();
  if (s === "completed" || s === "complete") return "completed";
  if (s === "ongoing") return "ongoing";
  if (s === "pending") return "pending";
  if (s === "on-hold") return "on-hold";
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
  "on-hold": {
    label: "On-hold",
    classes: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    dot: "bg-yellow-400",
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
  { key: "on-hold", label: "On-hold" },
] as const;

function CustomDot(props: {
  cx?: number;
  cy?: number;
  index?: number;
  dataLength: number;
}) {
  const { cx, cy, index = 0 } = props;
  if (cx === undefined || cy === undefined) return null;
  const beginDelay = `${index * 0.2}s`;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#2563eb" fillOpacity={0.3}>
        <animate attributeName="r" values="5;16;5" dur="1.8s" begin={beginDelay} repeatCount="indefinite" />
        <animate attributeName="fill-opacity" values="0.4;0;0.4" dur="1.8s" begin={beginDelay} repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={5} fill="#2563eb" />
      <circle cx={cx} cy={cy} r={2.5} fill="#fff" />
    </g>
  );
}

function CustomLabel(props: {
  x?: number;
  y?: number;
  value?: number;
  index?: number;
  dataLength: number;
}) {
  const { x, y, value, index, dataLength } = props;
  if (index !== dataLength - 1 || value === undefined || value === 0) return null;
  return (
    <g>
      <rect x={(x ?? 0) - 18} y={(y ?? 0) - 38} width={36} height={22} rx={6} fill="#1e40af" />
      <text x={x} y={(y ?? 0) - 22} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
        {value}
      </text>
      <polygon
        points={`${x},${(y ?? 0) - 14} ${(x ?? 0) - 5},${(y ?? 0) - 18} ${(x ?? 0) + 5},${(y ?? 0) - 18}`}
        fill="#1e40af"
      />
    </g>
  );
}

function CustomLineTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: { assigned: number; due: number; completed: number } }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const rows = [
    { label: "Assigned", value: d.assigned, color: "#2563eb" },
    { label: "Completed", value: d.completed, color: "#10b981" },
    { label: "Due", value: d.due, color: "#ef4444" },
  ];
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      boxShadow: "0 12px 32px -4px rgba(0,0,0,0.13)",
      padding: "12px 16px",
      minWidth: 172,
      outline: "none",
    }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: "#111827", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </p>
      {rows.map((row) => (
        <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7, gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{row.label}</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: row.color }}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({
  label, value, sub, accent, children,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: accent || "#111827" }}>
            {value}
          </h3>
          {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="h-32 sm:h-36 w-full">{children}</div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[76px] sm:min-w-[90px]"
      style={{ background: color + "12", border: `1px solid ${color}30` }}
    >
      <span className="text-xl sm:text-2xl font-black" style={{ color }}>{value}</span>
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 text-center leading-tight" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

// Shared tooltip style — no border/outline on focus or click
const sharedTooltipStyle = {
  borderRadius: "8px",
  border: "none",
  outline: "none",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  fontSize: "12px",
  color: "#000",
};

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<ITaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "ongoing" | "pending" | "on-hold">("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

  const departments = useMemo(() => {
    const depts = new Set<string>(["IT", "Accounts", "Traffic"]);
    tasks.forEach(t => {
      if (t.assigned_to_dept) depts.add(t.assigned_to_dept);
      if (t.assigned_by_dept) depts.add(t.assigned_by_dept);
    });
    return Array.from(depts).sort();
  }, [tasks]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counts = tasks.reduce(
      (acc, t) => {
        const s = normalizeStatus(t.status);
        if (s !== "unknown") acc[s] = (acc[s] || 0) + 1;
        return acc;
      },
      { completed: 0, ongoing: 0, pending: 0, "on-hold": 0 } as Record<string, number>,
    );

    const statusData = [
      { name: "Ongoing", value: counts.ongoing, color: STATUS_CONFIG.ongoing.color },
      { name: "Pending", value: counts.pending, color: STATUS_CONFIG.pending.color },
      { name: "Completed", value: counts.completed, color: STATUS_CONFIG.completed.color },
      { name: "On-hold", value: counts["on-hold"], color: STATUS_CONFIG["on-hold"].color },
    ];

    // Build 10-day window centered around today
    const last10DaysTasks: {
      date: string;
      rawDate: string;
      count: number;
      assigned: number;
      completed: number;
      due: number;
      isToday: boolean;
    }[] = [];

    let totalDueWindow = 0;

    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i - 5);
      const dateStr = d.toLocaleDateString("en-CA"); // "YYYY-MM-DD"

      // Assigned: tasks whose created_at date matches
      const assigned = tasks.filter((t) => {
        if (!t.created_at) return false;
        return t.created_at.slice(0, 10) === dateStr;
      }).length;

      // Completed: tasks whose completed_at date matches
      const completed = tasks.filter((t) => {
        if (!t.completed_at) return false;
        return t.completed_at.slice(0, 10) === dateStr;
      }).length;

      // Due: tasks whose deadline falls on this date AND are NOT completed
      const dueNotCompleted = tasks.filter((t) => {
        if (!t.deadline) return false;
        return (
          t.deadline.slice(0, 10) === dateStr &&
          normalizeStatus(t.status) !== "completed"
        );
      }).length;

      last10DaysTasks.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        rawDate: dateStr,
        count: assigned,
        assigned,
        completed,
        due: dueNotCompleted,
        isToday: dateStr === today.toLocaleDateString("en-CA"),
      });

      totalDueWindow += dueNotCompleted;
    }

    const maxCount = Math.max(...last10DaysTasks.map((d) => d.count), 5);

    // Top assigners
    const assignerMap: Record<string, { count: number; name: string }> = {};
    tasks.forEach((t) => {
      const email = t.assigned_by_email || t.assigned_by || "Unknown";
      const name = t.assigned_by || "Unknown";
      if (!assignerMap[email]) assignerMap[email] = { count: 0, name };
      assignerMap[email].count++;
    });
    const topAssigners = Object.values(assignerMap).sort((a, b) => b.count - a.count).slice(0, 5);

    const getTopNames = (list: { name: string; count: number }[]) => {
      if (list.length === 0) return "—";
      const max = list[0].count;
      const topList = list.filter(item => item.count === max);
      if (topList.length <= 2) return topList.map(t => t.name).join(", ");
      return `${topList[0].name}, ${topList[1].name} +${topList.length - 2} others`;
    };

    const topAssignerNames = getTopNames(topAssigners);

    // Top completers
    const completerMap: Record<string, { count: number; name: string }> = {};
    tasks.forEach((t) => {
      if (normalizeStatus(t.status) === "completed") {
        const email = t.assigned_to_email || "Unknown";
        const name = t.assigned_to_name || "Unknown";
        if (!completerMap[email]) completerMap[email] = { count: 0, name };
        completerMap[email].count++;
      }
    });
    const topCompleters = Object.values(completerMap).sort((a, b) => b.count - a.count).slice(0, 5);
    const topCompleterNames = getTopNames(topCompleters);

    return { counts, statusData, last10DaysTasks, totalDueWindow, maxCount, topAssigners, topCompleters, topAssignerNames, topCompleterNames };
  }, [tasks]);


  const filtered = tasks
    .filter((t) => filter === "all" || normalizeStatus(t.status) === filter)
    .filter((t) => deptFilter === "all" || t.assigned_to_dept === deptFilter || t.assigned_by_dept === deptFilter)
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

  const dataLen = stats.last10DaysTasks.length;

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .recharts-wrapper:focus,
        .recharts-surface:focus,
        .recharts-wrapper *:focus {
          outline: none !important;
          border: none !important;
        }
      `}</style>

      <div className="min-h-screen bg-[#f7f8fa] font-sans pb-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          {/* <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-15 sm:mt-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">Real-time performance and task distribution</p>
            </div>
            <div className="sm:text-right flex sm:flex-col flex-row items-center sm:items-end gap-2 sm:gap-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest sm:mb-1">Total System Tasks</p>
              <p className="text-3xl sm:text-4xl font-black text-gray-900">{tasks.length}</p>
            </div>
          </div> */}

          {/* ── Hero: 10-day line chart ──────────────────────────────────── */}
          <div className="bg-white rounded-2xl mt-15 sm:rounded-3xl border border-gray-100 shadow-xl overflow-visible">
            <div className="p-4 sm:p-8">
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <h2 className="text-base sm:text-xl font-bold text-gray-900">Task Deadlines</h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                    Tasks from{" "}
                    <span className="font-semibold text-gray-600">{stats.last10DaysTasks[0]?.date}</span>
                    {" "}to{" "}
                    <span className="font-semibold text-gray-600">{stats.last10DaysTasks[dataLen - 1]?.date}</span>
                  </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 flex-wrap">
                  {[
                    { label: "Assigned", color: "#2563eb" },
                    { label: "Completed", color: "#10b981" },
                    { label: "Due", color: "#ef4444" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: l.color }} />
                      <span className="text-[11px] font-semibold text-gray-500">{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* Summary badges */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
                  <MiniStat label="Due This Window" value={stats.totalDueWindow} color="#ef4444" />
                  <MiniStat label="Completed" value={stats.counts.completed} color="#10b981" />
                  <MiniStat label="Ongoing" value={stats.counts.ongoing} color="#2563eb" />
                </div>
              </div>

              {/* Line chart */}
              <div className="h-[220px] sm:h-[300px] w-full" style={{ minHeight: 220, paddingTop: 8 }}>
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={stats.last10DaysTasks}
                      margin={{ top: 40, right: 16, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#93c5fd" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 600 }}
                        dy={10}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: "#94a3b8" }}
                        domain={[0, stats.maxCount]}
                        allowDecimals={false}
                        width={24}
                      />
                      <Tooltip
                        content={<CustomLineTooltip />}
                        cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 2" }}
                      />
                      <ReferenceLine
                        x={stats.last10DaysTasks.find((d) => d.isToday)?.date}
                        stroke="#2563eb"
                        strokeDasharray="4 3"
                        strokeOpacity={0.35}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="url(#lineGradient)"
                        strokeWidth={3}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        dot={(dotProps: any) => (
                          <CustomDot
                            key={`dot-${dotProps.index}`}
                            cx={dotProps.cx}
                            cy={dotProps.cy}
                            index={dotProps.index}
                            dataLength={dataLen}
                          />
                        )}
                        activeDot={{ r: 7, fill: "#1e40af", stroke: "none" }}
                        animationDuration={1200}
                        isAnimationActive={true}
                      >
                        <LabelList
                          dataKey="count"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          content={(labelProps: any) => (
                            <CustomLabel
                              key={`label-${labelProps.index}`}
                              x={labelProps.x}
                              y={labelProps.y}
                              value={labelProps.value}
                              index={labelProps.index}
                              dataLength={dataLen}
                            />
                          )}
                        />
                      </Line>
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* ── Stats Row ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

            {/* Status Overview */}
            <StatCard
              label="Status Overview"
              value={tasks.length}
              sub="Total tracked tasks"
              accent="#111827"
            >
              <div style={{ minHeight: 128, height: "100%" }}>
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.statusData}
                      layout="vertical"
                      margin={{ top: 4, right: 36, left: 0, bottom: 4 }}
                      barCategoryGap="25%"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis
                        type="number"
                        axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: "#94a3b8" }}
                        allowDecimals={false}
                        domain={[0, (max: number) => Math.max(max, 1)]}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
                        width={64}
                      />
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={sharedTooltipStyle}
                        wrapperStyle={{ outline: "none", border: "none" }}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16} minPointSize={3}>
                        <LabelList
                          dataKey="value"
                          position="right"
                          style={{ fontSize: "10px", fontWeight: 700, fill: "#374151" }}
                        />
                        {stats.statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </StatCard>

            {/* Top Assigners */}
            <StatCard
              label="Top Assigners"
              value={stats.topAssignerNames}
              sub={stats.topAssigners.length > 0 ? `${stats.topAssigners[0].count} tasks assigned` : "No data yet"}
              accent="#4f46e5"
            >
              <div style={{ minHeight: 128, height: "100%" }}>
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.topAssigners.length > 0 ? stats.topAssigners : [{ name: "—", count: 0 }]}
                      layout="vertical"
                      margin={{ top: 4, right: 36, left: 0, bottom: 4 }}
                      barCategoryGap="20%"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis
                        type="number"
                        axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: "#94a3b8" }}
                        allowDecimals={false}
                        domain={[0, (max: number) => Math.max(max, 1)]}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: "#64748b", fontWeight: 600 }}
                        width={76}
                      />
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={sharedTooltipStyle}
                        wrapperStyle={{ outline: "none", border: "none" }}
                      />
                      <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={14} minPointSize={3}>
                        <LabelList
                          dataKey="count"
                          position="right"
                          style={{ fontSize: "10px", fontWeight: 700, fill: "#4f46e5" }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </StatCard>

            {/* Top Completers */}
            <StatCard
              label="Top Completers"
              value={stats.topCompleterNames}
              sub={stats.topCompleters.length > 0 ? `${stats.topCompleters[0].count} tasks completed` : "No completions yet"}
              accent="#059669"
            >
              <div style={{ minHeight: 128, height: "100%" }}>
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.topCompleters.length > 0 ? stats.topCompleters : [{ name: "—", count: 0 }]}
                      layout="vertical"
                      margin={{ top: 4, right: 36, left: 0, bottom: 4 }}
                      barCategoryGap="20%"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis
                        type="number"
                        axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: "#94a3b8" }}
                        allowDecimals={false}
                        domain={[0, (max: number) => Math.max(max, 1)]}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                        tickLine={false}
                        tick={{ fontSize: 9, fill: "#64748b", fontWeight: 600 }}
                        width={76}
                      />
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={sharedTooltipStyle}
                        wrapperStyle={{ outline: "none", border: "none" }}
                      />
                      <Bar dataKey="count" fill="#34d399" radius={[0, 4, 4, 0]} barSize={14} minPointSize={3}>
                        <LabelList
                          dataKey="count"
                          position="right"
                          style={{ fontSize: "10px", fontWeight: 700, fill: "#059669" }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </StatCard>
          </div>

          {/* ── Task Inventory ───────────────────────────────────────────── */}
          <div className="space-y-4 pt-2 sm:pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Task Inventory</h2>
               
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-white">
                <div className="flex justify-between overflow-x-auto pb-0.5 -mx-1 px-1 no-scrollbar">
                 <div className=" flex">
                   {TABS.map((tab) => {
                    const count =
                      tab.key === "all" ? tasks.length
                      : tab.key === "ongoing" ? stats.counts.ongoing
                      : tab.key === "pending" ? stats.counts.pending
                      : tab.key === "on-hold" ? stats.counts["on-hold"]
                      : stats.counts.completed
                    const active = filter === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key as typeof filter)}
                        className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0
                          ${active ? "bg-gray-900 text-white shadow-lg shadow-gray-200" : "text-gray-500 hover:bg-gray-50"}`}
                      >
                        {tab.label}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-100"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                 </div>
                   <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                >
                  <option value="all">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "600px" }}>
                <table className="min-w-max w-full text-sm border-collapse">
                  <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    <tr>
                      {[
                        { label: "#", width: "w-16" },
                        { label: "Task Information", width: "" },
                        { label: "Status", width: "w-32" },
                        { label: "Priority", width: "w-32" },
                        { label: "Assigned By", width: "w-56" },
                        { label: "Assigned To", width: "w-56" },
                        { label: "Deadline", width: "w-40" },
                        { label: "Created", width: "w-40" },
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
                        <td colSpan={8} className="py-24 text-center">
                          <p className="text-sm text-gray-400 font-medium">No results found for your query</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((task, i) => {
                        const s = normalizeStatus(task.status);
                        const cfg = STATUS_CONFIG[s];
                        return (
                          <tr key={task.task_id} className="hover:bg-blue-50/20 transition-colors">
                            <td className="px-6 py-5 text-xs font-mono text-gray-300">
                              {String(i + 1).padStart(2, "0")}
                            </td>
                            <td className="px-6 py-5">
                              <p className="font-bold text-gray-800 text-sm">{task.title || "Untitled"}</p>
                              {task.description && (
                                <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.classes}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {cfg.label}
                              </span>
                              {task.status === "on-hold" && task.on_hold_reason && (
                                <div className="mt-2 p-1.5 bg-yellow-50 border border-yellow-100 rounded text-[8px] text-yellow-800 max-w-[150px]">
                                  <span className="font-bold uppercase mr-1 text-[8px]">Reason:</span>
                                  {task.on_hold_reason}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                ${task.priority === "High" ? "bg-red-100 text-red-700"
                                  : task.priority === "Medium" ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"}`}>
                                {task.priority || "Normal"}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                                  {(task.assigned_by || "??").slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-700">{task.assigned_by || "Unknown"}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-bold uppercase tracking-tighter">
                                      {task.assigned_by_role || "ADMIN"}
                                    </span>
                                    <span className="text-[10px] text-gray-400 line-clamp-1">{task.assigned_by_dept || "IT"}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-500 uppercase">
                                  {(task.assigned_to_name || "??").slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-700">{task.assigned_to_name || "Unassigned"}</p>
                                  <p className="text-[10px] text-gray-400 line-clamp-1">{task.assigned_to_dept || "IT"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-xs text-gray-600 font-medium whitespace-nowrap">
                              {task.deadline || "—"}
                            </td>
                            <td className="px-6 py-5 text-xs text-gray-400 font-medium whitespace-nowrap">
                              {task.created_at ? new Date(task.created_at).toLocaleDateString() : "—"}
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
    </>
  );
}