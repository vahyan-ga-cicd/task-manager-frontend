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
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
          {/* Left Section */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-semibold text-white tracking-wide">
              Invoice Preview
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Download Button */}
            <a
              href={previewUrl}
              download="invoice.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white rounded-lg hover:bg-gray-100 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all backdrop-blur-sm"
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
