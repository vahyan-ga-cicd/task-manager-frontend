"use client";

import { useAuthContext } from "@/context/AuthContext";
import {
  InvoiceResponse,
  InvoiceCreate,
} from "@/@types/interface/invoice.interface";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileText, LogOut } from "lucide-react";

import InvoiceStats from "./InvoiceStats";
import InvoiceTable from "./InvoiceTable";
import UserProfileCard from "./UserProfileCard";
// import InvoicePreviewModal from "./InvoicePreviewModal";
import CreateInvoiceModal from "./CreateInvoiceModal";
import {
  createInvoice,
  downloadInvoice,
  getInvoices,
  previewInvoice,
} from "@/utils/api/admin/invoice/invoice";

interface UserAccProps {
  initialUserData?: any;
  initialInvoices?: InvoiceResponse[];
}

const UserAcc = ({ initialUserData, initialInvoices }: UserAccProps) => {
  const router = useRouter();
  const {
    userData: contextUserData,
    // logout,
    authenticated,
    loading: authLoading,
  } = useAuthContext();
  const [invoices, setInvoices] = useState<InvoiceResponse[]>(
    initialInvoices || [],
  );
  console.log("Invoice Data", invoices);
  const [loading, setLoading] = useState(!initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<InvoiceResponse[]>(
    [],
  );
  const userData = initialUserData || contextUserData;

  const fetchData = useCallback(async () => {
    if (!authenticated) return;
    try {
      setLoading(true);
      const invoiceData = await getInvoices();
      setInvoices(invoiceData);
    } catch (error) {
      console.error("Failed to fetch account data:", error);
    } finally {
      setLoading(false);
    }
  }, [authenticated]);

  useEffect(() => {
    if (!authLoading) {
      if (authenticated) fetchData();
      else router.replace("/login");
    }
  }, [authLoading, authenticated, fetchData, router]);

  const handlePreview = async (invoice: InvoiceResponse) => {
    try {
      setIsPreviewLoading(true);
      const blob = await previewInvoice(invoice);
      window.open(URL.createObjectURL(blob));
    } catch {
      alert("Failed to generate preview. Please try again.");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleDownload = async (invoiceNo: string) => {
    try {
      await downloadInvoice(invoiceNo);
    } catch {
      alert("Failed to download invoice.");
    }
  };

  const handleCreateInvoice = async (data: InvoiceCreate) => {
    await createInvoice(data);
    await fetchData();
  };

  // const closePreview = () => {
  //   if (previewUrl) {
  //     URL.revokeObjectURL(previewUrl);
  //     setPreviewUrl(null);
  //   }
  // };
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("invoicetoken"); // ✅ remove invoice token
      localStorage.removeItem("token"); // (optional if you use another token)
    }

    // optional redirect
    window.location.href = "/login";
  };
  const activeInvoices =
    selectedInvoices.length > 0 ? selectedInvoices : invoices;

  const totalAmount = activeInvoices.reduce(
    (a, i) => a + Number(i.total_invoice_amount),
    0,
  );

  const totalBalance = activeInvoices.reduce(
    (a, i) => a + Number(i.balance),
    0,
  );

  // const totalProfit = activeInvoices.reduce(
  //   (a, i) => a + Number(i.received_amount || 0),
  //   0,
  // );
const totalProfit = activeInvoices.reduce((total, invoice) => {
  return (
    total +
    (Number(invoice.total_invoice_amount || 0) -
      Number(invoice.total_amount_before_tax || 0))
  );
}, 0);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pb-12 font-sans text-slate-900 bg-white">
      {/* Top Navigation / Header */}
      <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="text-white w-5 h-5" />
              </div>
              <span className="text-lg text-black sm:text-xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text ">
                InvoiceFlow
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium  hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-black">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        {/* Welcome Section */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
            Welcome back,{" "}
            <span className="text-indigo-600">
              {userData?.username || "Account"}
            </span>
            !
          </h1>
          <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">
            Here&apos;s what&apos;s happening with your invoices.
          </p>
        </div>

        {/* Stats Grid */}
        {/* <div className="flex flex-col md:flex-row gap-6 mb-8"> */}
        <InvoiceStats
          totalInvoices={invoices.length}
          totalRevenue={totalAmount}
          totalOutstanding={totalBalance}
          totalProfit={totalProfit}
        />
        {/* </div> */}

        <div className="w-full">
          <InvoiceTable
            invoices={invoices}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onDownload={handleDownload}
            onPreview={handlePreview}
            isPreviewLoading={isPreviewLoading}
            onNewInvoice={() => setIsCreateModalOpen(true)}
            onSelectionChange={setSelectedInvoices} // ✅ FIXED
          />
        </div>
      </main>

      {/* Modals */}
      {/* <InvoicePreviewModal previewUrl={previewUrl} onClose={closePreview} /> */}

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInvoice}
      />
    </div>
  );
};

export default UserAcc;
