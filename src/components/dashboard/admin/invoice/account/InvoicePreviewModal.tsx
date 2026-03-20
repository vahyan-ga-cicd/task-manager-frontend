import React from "react";
import { Eye, X, Download } from "lucide-react";

interface InvoicePreviewModalProps {
  previewUrl: string | null;
  onClose: () => void;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  previewUrl,
  onClose,
}) => {
  if (!previewUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: "900px", height: "calc(100vh - 48px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-indigo-600 shrink-0">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4.5 h-4.5 text-black" />
            <p className="text-base font-bold text-black">Invoice Preview</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={previewUrl}
              download="invoice.pdf"
              className="p-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 rounded-xl transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF iframe — fills all remaining height */}
        <div className="flex-1 bg-gray-100 overflow-hidden">
          <iframe
            src={previewUrl}
            className="w-full h-full border-none"
            title="Invoice Preview"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
