"use client";

import React from "react";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    pending: number;
    ongoing: number;
    complete: number;
    "on-hold"?: number;
  };
}

export default function Stats({ stats }: StatsProps) {
  const statItems = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: ClipboardList,
      color: "bg-indigo-50 text-indigo-600",
      borderColor: "border-indigo-100"
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: AlertCircle,
      color: "bg-rose-50 text-rose-600",
      borderColor: "border-rose-100"
    },
    {
      label: "Ongoing",
      value: stats.ongoing,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      borderColor: "border-amber-100"
    },
    {
      label: "Completed",
      value: stats.complete,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
      borderColor: "border-emerald-100"
    },
    {
      label: "On Hold",
      value: stats["on-hold"] || 0,
      icon: AlertCircle, // Changed from Clock to AlertCircle or something else
      color: "bg-orange-50 text-orange-600",
      borderColor: "border-orange-100"
    }
  ];

  // Stats.tsx - replace the return block
return (
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 w-full">
    {statItems.map((item, index) => (
      <div
        key={index}
        className={`bg-white p-4 rounded-2xl border ${item.borderColor} shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">{item.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
          </div>
          <div className={`p-2.5 rounded-xl ${item.color}`}>
            <item.icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
}
