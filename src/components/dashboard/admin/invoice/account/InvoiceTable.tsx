import React, { useState } from "react";
import { Search, Plus, Calendar, Download, Eye, FileText } from "lucide-react";
import { InvoiceResponse } from "@/@types/interface/invoice.interface";

interface InvoiceTableProps {
  invoices: InvoiceResponse[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onDownload: (invoiceNo: string) => Promise<void>;
  onPreview: (invoice: InvoiceResponse) => Promise<void>;
  isPreviewLoading: boolean;
  onNewInvoice: () => void;
}

const InvoiceTable = ({
  invoices,
  searchQuery,
  setSearchQuery,
  onDownload,
  onPreview,
  isPreviewLoading,
  onNewInvoice,
}: InvoiceTableProps) => {
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const filtered = invoices
    .filter((inv) => {
      const query = searchQuery.toLowerCase();

      return (
        inv.invoice_no?.toLowerCase().includes(query) ||
        inv.bill_to_name?.toLowerCase().includes(query) ||
        inv.date?.toLowerCase().includes(query) ||
        String(inv.total_invoice_amount).includes(query)
      );
    })
    .sort((a, b) =>
      b.invoice_no.localeCompare(a.invoice_no, undefined, { numeric: true }),
    );

  const handlePreview = async (invoice: InvoiceResponse) => {
    setPreviewingId(invoice.invoice_no);
    try {
      await onPreview(invoice);
    } finally {
      setPreviewingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
      <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative w-full">
            {/* Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>

            <input
              type="text"
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm transition-all"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex-shrink-0">
          <button
            onClick={onNewInvoice}
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all gap-2"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-5 sm:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-5 sm:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Client
              </th>
              <th className="px-5 sm:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 sm:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Date
              </th>
              {/* <th className="px-5 sm:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Status
              </th> */}
              <th className="px-5 sm:px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? (
              filtered.map((invoice) => (
                <tr
                  key={invoice.invoice_no}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-900">
                      #{invoice.invoice_no}
                    </span>
                  </td>
                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {invoice.bill_to_name}
                    </div>
                  </td>
                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">
                      ₹{Number(invoice.total_invoice_amount).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      {invoice.date}
                    </div>
                  </td>
                  {/* <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        Number(invoice.balance) === 0
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {Number(invoice.balance) === 0 ? "Paid" : "Pending"}
                    </span>
                  </td> */}
                  <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDownload(invoice.invoice_no)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePreview(invoice)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Preview Invoice"
                      >
                        {previewingId === invoice.invoice_no &&
                        isPreviewLoading ? (
                          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 sm:px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="w-12 h-12 text-slate-200" />
                    <p className="text-slate-500 font-medium">
                      No invoices found matching your search.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 sm:px-6 py-4 bg-slate-50/50 border-t border-slate-200">
        <p className="text-xs text-slate-600 font-medium">
          Showing {filtered.length} of {invoices.length} total invoices
        </p>
      </div>
    </div>
  );
};

export default InvoiceTable;
