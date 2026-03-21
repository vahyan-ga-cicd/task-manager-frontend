import React from "react";
import { FileText, TrendingUp, Wallet, Zap } from "lucide-react";

interface InvoiceStatsProps {
  totalInvoices: number;
  totalRevenue: number;
  totalOutstanding: number;
  totalProfit: number;
}

const cards = [
  {
    key: "invoices",
    label: "Total Invoices",
    icon: FileText,
    from: "from-violet-500",
    to: "to-violet-600",
    ring: "ring-violet-100",
    text: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    key: "revenue",
    label: "Total Revenue",
    icon: TrendingUp,
    from: "from-emerald-500",
    to: "to-teal-500",
    ring: "ring-emerald-100",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
  },
   {
    key: "profit",
    label: "P & L",
    icon: Zap,
    from: "from-indigo-500",
    to: "to-blue-500",
    ring: "ring-indigo-100",
    text: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    key: "outstanding",
    label: "Total Balance Credit",
    icon: Wallet,
    from: "from-amber-400",
    to: "to-orange-500",
    ring: "ring-amber-100",
    text: "text-amber-600",
    bg: "bg-amber-50",
  },
 
];

const InvoiceStats = ({
  totalInvoices,
  totalRevenue,
  totalOutstanding,
  totalProfit,
}: InvoiceStatsProps) => {
  const values: Record<string, string | number> = {
    invoices: totalInvoices,
    revenue: `₹${totalRevenue.toLocaleString("en-IN")}`,
    outstanding: `₹${totalOutstanding.toLocaleString("en-IN")}`,
    profit: `₹${totalProfit.toLocaleString("en-IN")}`
  };

  return (
    <div className="flex gap-5 mb-8">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className={`flex-1 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ring-1 ${c.ring} p-5 flex items-center gap-4`}
          >
            <div
              className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className={`w-5 h-5 ${c.text}`} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {c.label}
              </p>
              <p className="text-xl font-bold text-gray-900 truncate">
                {values[c.key]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvoiceStats;
