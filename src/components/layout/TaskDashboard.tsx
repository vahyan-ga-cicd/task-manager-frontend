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

// ─── Custom dot: only blink on the LAST point ───────────────────────────────
function CustomDot(props: {
  cx?: number;
  cy?: number;
  index?: number;
  dataLength: number;
  count?: number;
}) {
  const { cx, cy, index, dataLength } = props;
  if (cx === undefined || cy === undefined) return null;

  const isLast = index === dataLength - 1;

  if (isLast) {
    return (
      <g>
        {/* Pulsing ring */}
        <circle
          cx={cx}
          cy={cy}
          r={10}
          fill="#2563eb"
          fillOpacity={0.15}
          style={{
            animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
        <circle cx={cx} cy={cy} r={5} fill="#2563eb" />
        <circle cx={cx} cy={cy} r={3} fill="#fff" />
      </g>
    );
  }

  return <circle cx={cx} cy={cy} r={3} fill="#93c5fd" />;
}

// ─── Custom label: show count only on last point ────────────────────────────
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
      <rect
        x={(x ?? 0) - 18}
        y={(y ?? 0) - 38}
        width={36}
        height={22}
        rx={6}
        fill="#1e40af"
      />
      <text
        x={x}
        y={(y ?? 0) - 22}
        textAnchor="middle"
        fill="#fff"
        fontSize={11}
        fontWeight={700}
      >
        {value}
      </text>
      {/* small triangle */}
      <polygon
        points={`${x},${(y ?? 0) - 14} ${(x ?? 0) - 5},${(y ?? 0) - 18} ${(x ?? 0) + 5},${(y ?? 0) - 18}`}
        fill="#1e40af"
      />
    </g>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  accent,
  children,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            {label}
          </p>
          <h3
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: accent || "#111827" }}
          >
            {value}
          </h3>
          {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="h-36 w-full">{children}</div>
    </div>
  );
}

// ─── Mini stat badge ─────────────────────────────────────────────────────────
function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl px-4 py-3 min-w-[90px]"
      style={{ background: color + "12", border: `1px solid ${color}30` }}
    >
      <span
        className="text-2xl font-black"
        style={{ color }}
      >
        {value}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "completed" | "ongoing" | "pending"
  >("all");
  const [search, setSearch] = useState("");

  // ── Fix: StrictMode double-mount causes ResizeObserver to fire before
  // ── the DOM is painted → ResponsiveContainer gets width=0 and renders
  // ── nothing in dev. Guard all charts behind this flag so they only
  // ── mount after the container has a real size. Works identically in prod.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    // ── Use a fixed 10-day window: today-9 → today ──────────────────────────
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
      {
        name: "Ongoing",
        value: counts.ongoing,
        color: STATUS_CONFIG.ongoing.color,
      },
      {
        name: "Pending",
        value: counts.pending,
        color: STATUS_CONFIG.pending.color,
      },
      {
        name: "Completed",
        value: counts.completed,
        color: STATUS_CONFIG.completed.color,
      },
    ];

    // ── 10-day window ending TODAY (today-9 … today) ─────────────────────
    // Each point = tasks whose deadline falls on that date
    const last10DaysTasks: { date: string; rawDate: string; count: number; isToday: boolean }[] = [];
    let totalIn10Days = 0;

    for (let i = 9; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0]; // "YYYY-MM-DD"

      const count = tasks.filter((t) => t.deadline === dateStr).length;
      last10DaysTasks.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        rawDate: dateStr,
        count,
        isToday: i === 0,
      });
      totalIn10Days += count;
    }

    // ── Y-axis domain: always show at least 0–5 so line is visible ─────────
    const maxCount = Math.max(...last10DaysTasks.map((d) => d.count), 5);

    // Top Assigners
    const assignerMap: Record<string, { count: number; name: string }> = {};
    tasks.forEach((t) => {
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
    tasks.forEach((t) => {
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

    return {
      counts,
      statusData,
      last10DaysTasks,
      totalIn10Days,
      maxCount,
      topAssigners,
      topCompleters,
    };
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
          <p className="text-xs text-gray-400 tracking-widest uppercase">
            Loading tasks…
          </p>
        </div>
      </div>
    );
  }

  const dataLen = stats.last10DaysTasks.length;

  return (
    <>
      {/* Keyframe for blinking dot — injected once */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <div className="min-h-screen bg-[#f7f8fa] font-sans pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Real-time performance and task distribution
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                Total System Tasks
              </p>
              <p className="text-4xl font-black text-gray-900">{tasks.length}</p>
            </div>
          </div>

          {/* ── Hero: 10-day task deadline line chart ────────────────────── */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-visible">
            <div className="p-8">
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Task Deadlines — Last 10 Days
                  </h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Tasks with deadlines from{" "}
                    <span className="font-semibold text-gray-600">
                      {stats.last10DaysTasks[0]?.date}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-600">
                      {stats.last10DaysTasks[dataLen - 1]?.date}
                    </span>
                  </p>
                </div>

                {/* Summary badges */}
                <div className="flex items-center gap-3 flex-wrap">
                  <MiniStat
                    label="Due This Window"
                    value={stats.totalIn10Days}
                    color="#2563eb"
                  />
                  <MiniStat
                    label="Completed"
                    value={stats.counts.completed}
                    color="#10b981"
                  />
                  <MiniStat
                    label="Ongoing"
                    value={stats.counts.ongoing}
                    color="#f59e0b"
                  />
                </div>
              </div>

              {/* Line chart — padded top so label has room */}
              {/* minHeight prevents collapse before mount; mounted guard fixes StrictMode ResizeObserver timing */}
              <div className="h-[300px] w-full" style={{ minHeight: 300, paddingTop: 8 }}>
                {mounted && <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.last10DaysTasks}
                    margin={{ top: 40, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>

                    {/* Always render grid so chart never looks empty */}
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />

                    {/* Always show X axis — dates always present */}
                    <XAxis
                      dataKey="date"
                      axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
                      dy={10}
                    />

                    {/* Always show Y axis with minimum range 0–5 so it's visible even with no data */}
                    <YAxis
                      axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      domain={[0, stats.maxCount]}
                      allowDecimals={false}
                      width={28}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                      formatter={(val: number) => [val, "Tasks due"]}
                      cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    />

                    {/* Vertical reference line at today */}
                    <ReferenceLine
                      x={stats.last10DaysTasks[dataLen - 1]?.date}
                      stroke="#2563eb"
                      strokeDasharray="4 3"
                      strokeOpacity={0.35}
                    />

                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="url(#lineGradient)"
                      strokeWidth={3}
                      dot={(dotProps: { cx?: number; cy?: number; index?: number }) => (
                        <CustomDot
                          key={`dot-${dotProps.index}`}
                          {...dotProps}
                          dataLength={dataLen}
                        />
                      )}
                      activeDot={{ r: 7, fill: "#1e40af" }}
                      animationDuration={1200}
                      isAnimationActive={true}
                    >
                      {/* Show count label only on last point */}
                      <LabelList
                        dataKey="count"
                        content={(labelProps: {
                          x?: number;
                          y?: number;
                          value?: number;
                          index?: number;
                        }) => (
                          <CustomLabel
                            key={`label-${labelProps.index}`}
                            {...labelProps}
                            dataLength={dataLen}
                          />
                        )}
                      />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>}
              </div>
            </div>
          </div>

          {/* ── Stats Row ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Status Overview */}
            <StatCard
              label="Status Overview"
              value={stats.counts.ongoing + stats.counts.pending + stats.counts.completed}
              sub="Total tracked tasks"
              accent="#111827"
            >
              {/* Status Overview — always render chart skeleton even with 0 data */}
              <div style={{ minHeight: 144, height: "100%" }}>
              {mounted && <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.statusData}
                  layout="vertical"
                  margin={{ top: 4, right: 40, left: 0, bottom: 4 }}
                  barCategoryGap="25%"
                >
                  {/* Always-visible grid */}
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f1f5f9"
                  />
                  {/* X axis — always visible, minimum domain 0–1 so axis shows even with no data */}
                  <XAxis
                    type="number"
                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    allowDecimals={false}
                    domain={[0, (max: number) => Math.max(max, 1)]}
                  />
                  {/* Y axis — always visible */}
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
                    width={68}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18} minPointSize={3}>
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
              </ResponsiveContainer>}
              </div>
            </StatCard>

            {/* Top Assigners */}
            <StatCard
              label="Top Assigners"
              value={stats.topAssigners.length > 0 ? stats.topAssigners[0].name : "—"}
              sub={
                stats.topAssigners.length > 0
                  ? `${stats.topAssigners[0].count} tasks assigned`
                  : "No data yet"
              }
              accent="#4f46e5"
            >
              {/* Top Assigners — always render chart skeleton even with no data */}
              <div style={{ minHeight: 144, height: "100%" }}>
              {mounted && <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topAssigners.length > 0 ? stats.topAssigners : [{ name: "—", count: 0 }]}
                  layout="vertical"
                  margin={{ top: 4, right: 40, left: 0, bottom: 4 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f1f5f9"
                  />
                  {/* X axis — always visible */}
                  <XAxis
                    type="number"
                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    allowDecimals={false}
                    domain={[0, (max: number) => Math.max(max, 1)]}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#64748b", fontWeight: 600 }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={14} minPointSize={3}>
                    <LabelList
                      dataKey="count"
                      position="right"
                      style={{ fontSize: "10px", fontWeight: 700, fill: "#4f46e5" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>}
              </div>
            </StatCard>

            {/* Top Completers */}
            <StatCard
              label="Top Completers"
              value={
                stats.topCompleters.length > 0 ? stats.topCompleters[0].name : "—"
              }
              sub={
                stats.topCompleters.length > 0
                  ? `${stats.topCompleters[0].count} tasks completed`
                  : "No completions yet"
              }
              accent="#059669"
            >
              {/* Top Completers — always render chart skeleton even with no data */}
              <div style={{ minHeight: 144, height: "100%" }}>
              {mounted && <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topCompleters.length > 0 ? stats.topCompleters : [{ name: "—", count: 0 }]}
                  layout="vertical"
                  margin={{ top: 4, right: 40, left: 0, bottom: 4 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f1f5f9"
                  />
                  {/* X axis — always visible */}
                  <XAxis
                    type="number"
                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    allowDecimals={false}
                    domain={[0, (max: number) => Math.max(max, 1)]}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#64748b", fontWeight: 600 }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#34d399" radius={[0, 4, 4, 0]} barSize={14} minPointSize={3}>
                    <LabelList
                      dataKey="count"
                      position="right"
                      style={{ fontSize: "10px", fontWeight: 700, fill: "#059669" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>}
              </div>
            </StatCard>
          </div>

          {/* ── Task Inventory Table ─────────────────────────────────────── */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Task Inventory</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter tasks…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-4 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 w-48 transition-all duration-150"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Tabs */}
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
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-100"}`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table */}
              <div
                className="overflow-x-auto overflow-y-auto"
                style={{ maxHeight: "600px" }}
              >
                <table className="w-full text-sm border-collapse">
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
                        <th
                          key={i}
                          className={`text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap ${h.width}`}
                        >
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-24 text-center">
                          <p className="text-sm text-gray-400 font-medium">
                            No results found for your query
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((task, i) => {
                        const s = normalizeStatus(task.status);
                        const cfg = STATUS_CONFIG[s];
                        return (
                          <tr
                            key={task.task_id}
                            className="hover:bg-blue-50/20 transition-colors group"
                          >
                            <td className="px-6 py-5 text-xs font-mono text-gray-300">
                              {String(i + 1).padStart(2, "0")}
                            </td>
                            <td className="px-6 py-5">
                              <p className="font-bold text-gray-800 text-sm">
                                {task.title || "Untitled"}
                              </p>
                              {task.description && (
                                <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                                  {task.description}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.classes}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                                />
                                {cfg.label}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.classes}`}
                              >
                                {task.priority || "Normal"}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                                  {(task.assigned_by || "??").slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-700">
                                    {task.assigned_by || "Unknown"}
                                  </p>
                                  <p className="text-[10px] text-gray-400 line-clamp-1">
                                    {task.assigned_by_email || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-500 uppercase">
                                  {(task.assigned_to_name || "??").slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-700">
                                    {task.assigned_to_name || "Unassigned"}
                                  </p>
                                  <p className="text-[10px] text-gray-400 line-clamp-1">
                                    {task.assigned_to_email || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-xs text-gray-600 font-medium whitespace-nowrap">
                              {task.deadline || "—"}
                            </td>
                            <td className="px-6 py-5 text-xs text-gray-400 font-medium whitespace-nowrap">
                              {task.created_at
                                ? new Date(task.created_at).toLocaleDateString()
                                : "—"}
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