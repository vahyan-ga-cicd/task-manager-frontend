import axios, { isAxiosError } from "axios";
// import { axiosClient } from "@/config/axios";
import { InvoiceCreate, InvoiceResponse } from "@/@types/interface/invoice.interface";
// import { axiosClient } from "@/config/axios";
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("invoicetoken");
};
export async function getInvoices(): Promise<InvoiceResponse[]> {
  const token = getToken();

  if (!token) return [];

  try {
    const res = await axios.get("/api/admin/Invoice/invoices/get-invoice", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch invoices");
    }
    throw error;
  }
}


export async function previewInvoice(data: InvoiceCreate): Promise<Blob> {
  const token = getToken();
  if (!token || token === "null" || token === "undefined") {
    throw new Error("No valid token found");
  }
  try {
    const res = await axios.post("/api/admin/Invoice/invoices/preview", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
    return res.data;
  } catch (error) {
    console.error("Error previewing invoice:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to preview invoice");
    }
    throw error;
  }
}


export async function createInvoice(data: InvoiceCreate): Promise<InvoiceResponse> {
  const token = getToken();
  if (!token || token === "null" || token === "undefined") {
    throw new Error("No valid token found");
  }
  try {
    const res = await axios.post("/api/admin/Invoice/invoices/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create invoice");
    }
    throw error;
  }
}


export async function downloadInvoice(invoiceNo: string): Promise<void> {
  const token = getToken();
  if (!token || token === "null" || token === "undefined") {
    throw new Error("No valid token found");
  }
  try {
    const res = await axios.get(`/api/admin/Invoice/invoices/${invoiceNo}/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
    
    // Create a temporary link to trigger the download
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_${invoiceNo}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to download invoice");
    }
    throw error;
  }
}
