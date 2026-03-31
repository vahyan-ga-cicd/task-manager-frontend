import React, { useState } from "react";
import { ChevronDown, ChevronUp, RotateCw, FileText, User, Clock, Tag, Activity, MessageSquare } from "lucide-react";
import { AuditLog } from "@/@types/interface/auditlogs.interface";

// export interface AuditLog {
//   log_id: string;
//   performed_by_id: string;
//   performed_by_name: string;
//   performed_by_email: string;
//   performed_by_role: string;
//   task_id: string;
//   task_title: string;
//   action: string;
//   details: string;
//   timestamp: string;
//   task_owner_id?: string;
//   task_assigned_by_id?: string;
//   priority?: string;
//   department?: string;
//   comment?: string;
//   payload?: string;
// }

interface AuditLogsTableProps {
  logs: AuditLog[];
  loading: boolean;
  onRefresh?: () => void;
  currentUserId?: string;
  currentUserName?: string;
  currentUserEmail?: string;
}

const AuditLogsTable: React.FC<AuditLogsTableProps> = ({
  logs,
  loading,
  onRefresh,
  currentUserId,
  currentUserName,
  currentUserEmail,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sanitizeDetails = (text: string) => {
    if (!text) return text;
    let sanitized = text;
    const identities: string[] = [];
    if (currentUserName && currentUserEmail) identities.push(`${currentUserName} (${currentUserEmail})`);
    if (currentUserEmail) identities.push(currentUserEmail);
    if (currentUserName) identities.push(currentUserName);
    identities.forEach((identity) => {
      const escaped = identity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      sanitized = sanitized.replace(new RegExp(escaped, "gi"), "you");
    });
    return sanitized;
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getActionConfig = (action: string) => {
    switch (action) {
      case "TASK_ASSIGNED":
        return { label: "Assigned", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" };
      case "STATUS_UPDATE":
        return { label: "Status Update", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" };
      case "TASK_DELETED":
        return { label: "Deleted", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" };
      case "TASK_CREATED":
        return { label: "Created", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" };
      case "COMMENT_ADDED":
        return { label: "Comment", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" };
      default:
        return { label: action.replace(/_/g, " "), bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", dot: "bg-gray-400" };
    }
  };

  const getPriorityConfig = (priority?: string) => {
    if (!priority) return null;
    const p = priority.toLowerCase();
    if (p === "high") return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" };
    if (p === "medium") return { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" };
    return { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" };
  };

  const renderPayload = (payloadString?: string) => {
    if (!payloadString) return null;
    try {
      const parsed = JSON.parse(payloadString);
      return (
        <pre className="text-[11px] font-mono whitespace-pre-wrap text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-auto max-h-64">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return (
        <pre className="text-[11px] font-mono whitespace-pre-wrap text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-auto max-h-64">
          {payloadString}
        </pre>
      );
    }
  };

  const totalPages = Math.ceil((logs?.length || 0) / itemsPerPage);
  const currentLogs = logs?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];

  const getAvatarColor = (name: string) => {
    const idx = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[idx];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-100"></div>
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin absolute inset-0"></div>
        </div>
        <p className="text-sm text-gray-400 font-medium">Loading audit logs…</p>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <FileText className="w-6 h-6 text-gray-300" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600">No history found</p>
          <p className="text-xs text-gray-400 mt-0.5">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      {/* Header bar */}
      {onRefresh && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">
            {logs.length} {logs.length === 1 ? "entry" : "entries"} found
          </p>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      )}

      {/* ── DESKTOP TABLE (md+) ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3.5 w-10"></th>
                <th className="px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Clock size={11} />Time</div>
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><User size={11} />User</div>
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Tag size={11} />Task</div>
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Activity size={11} />Action</div>
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><MessageSquare size={11} />Details</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentLogs.map((log) => {
                const isExpanded = expandedRows.has(log.log_id);
                const hasPayload = !!log.payload;
                const actionCfg = getActionConfig(log.action);
                const priorityCfg = getPriorityConfig(log.priority);
                const isCurrentUser = log.performed_by_id === currentUserId;

                return (
                  <React.Fragment key={log.log_id}>
                    <tr className={`transition-colors group ${isExpanded ? "bg-indigo-50/30" : "hover:bg-gray-50/60"}`}>
                      {/* Expand toggle */}
                      <td className="px-5 py-4 align-middle">
                        {hasPayload ? (
                          <button
                            onClick={() => toggleRow(log.log_id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
                          >
                            {isExpanded ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
                          </button>
                        ) : (
                          <div className="w-7" />
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        <span className="text-xs font-mono text-gray-500 tabular-nums">{log.timestamp}</span>
                      </td>

                      {/* User */}
                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${isCurrentUser ? "bg-indigo-100 text-indigo-700" : getAvatarColor(log.performed_by_name)}`}>
                            {isCurrentUser ? "You" : getInitials(log.performed_by_name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                              {isCurrentUser ? "You" : log.performed_by_name}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">{log.performed_by_email}</p>
                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{log.performed_by_role}</span>
                              {log.department && (
                                <>
                                  <span className="text-gray-300 text-[10px]">·</span>
                                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">{log.department}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Task */}
                      <td className="px-4 py-4 align-middle max-w-[200px]">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug truncate">
                          {log.task_title}
                        </p>
                        {priorityCfg && (
                          <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wide ${priorityCfg.bg} ${priorityCfg.text} ${priorityCfg.border}`}>
                            {log.priority}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 align-middle whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${actionCfg.bg} ${actionCfg.text} ${actionCfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${actionCfg.dot}`}></span>
                          {actionCfg.label}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="px-4 py-4 align-middle max-w-[280px]">
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                          {sanitizeDetails(log.details)}
                        </p>
                        {log.comment && (
                          <div className="mt-1.5 px-2.5 py-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
                            <p className="text-[11px] text-indigo-600 italic leading-relaxed line-clamp-2">
                              &ldquo;{log.comment}&rdquo;
                            </p>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* Expanded payload */}
                    {isExpanded && hasPayload && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={6} className="px-5 py-5 border-b border-slate-100">
                          <div className="ml-11">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center">
                                <FileText size={11} className="text-slate-500" />
                              </div>
                              <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Audit Payload</h4>
                            </div>
                            {renderPayload(log.payload)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MOBILE CARDS (below md) ── */}
      <div className="md:hidden space-y-2">
        {currentLogs.map((log) => {
          const isExpanded = expandedRows.has(log.log_id);
          const hasPayload = !!log.payload;
          const actionCfg = getActionConfig(log.action);
          const priorityCfg = getPriorityConfig(log.priority);
          const isCurrentUser = log.performed_by_id === currentUserId;

          return (
            <div
              key={log.log_id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${isExpanded ? "border-indigo-200 shadow-md" : "border-gray-200 shadow-sm"}`}
            >
              {/* Card Header */}
              <div className="px-4 pt-4 pb-3">
                {/* Top row: action badge + timestamp */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${actionCfg.bg} ${actionCfg.text} ${actionCfg.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${actionCfg.dot}`}></span>
                    {actionCfg.label}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400 tabular-nums flex-shrink-0">{log.timestamp}</span>
                </div>

                {/* Task title */}
                <p className="text-sm font-bold text-gray-900 leading-snug mb-1">{log.task_title}</p>

                {/* Priority */}
                {priorityCfg && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wide mb-2 ${priorityCfg.bg} ${priorityCfg.text} ${priorityCfg.border}`}>
                    {log.priority}
                  </span>
                )}

                {/* Details */}
                <p className="text-sm text-gray-500 leading-relaxed">{sanitizeDetails(log.details)}</p>

                {/* Comment */}
                {log.comment && (
                  <div className="mt-2 px-3 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-[11px] text-indigo-600 italic leading-relaxed">&ldquo;{log.comment}&rdquo;</p>
                  </div>
                )}
              </div>

              {/* Card Footer: user info + expand */}
              <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${isCurrentUser ? "bg-indigo-100 text-indigo-700" : getAvatarColor(log.performed_by_name)}`}>
                    {isCurrentUser ? "Me" : getInitials(log.performed_by_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {isCurrentUser ? "You" : log.performed_by_name}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">{log.performed_by_role}</span>
                      {log.department && (
                        <>
                          <span className="text-gray-300 text-[10px]">·</span>
                          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide">{log.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {hasPayload && (
                  <button
                    onClick={() => toggleRow(log.log_id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all flex-shrink-0"
                  >
                    {isExpanded ? <><ChevronUp size={12} />Hide</> : <><ChevronDown size={12} />Payload</>}
                  </button>
                )}
              </div>

              {/* Expanded payload on mobile */}
              {isExpanded && hasPayload && (
                <div className="px-4 py-4 border-t border-indigo-100 bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Audit Payload</p>
                  {renderPayload(log.payload)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── PAGINATION ── */}
      {logs.length > itemsPerPage && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
          {/* Result count */}
          <p className="text-xs text-gray-500 font-medium hidden sm:block">
            <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, logs.length)}</span>
            {" "}of{" "}
            <span className="font-bold text-gray-800">{logs.length}</span>
          </p>

          {/* Mobile: just prev/next */}
          <div className="flex sm:hidden gap-2 w-full justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="flex items-center px-4 text-sm font-semibold text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Desktop: numbered pages */}
          <nav className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-gray-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Smart page numbers: show ellipsis for large ranges */}
            {(() => {
              const pages: (number | "…")[] = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 3) pages.push("…");
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
                if (currentPage < totalPages - 2) pages.push("…");
                pages.push(totalPages);
              }
              return pages.map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                      currentPage === p
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                        : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                )
              );
            })()}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-gray-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AuditLogsTable;