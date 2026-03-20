import { isAxiosError } from "axios";
import { axiosClient, getAuthHeaders, InvoiceaxiosClient } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token || token === "null" || token === "undefined") {
      return NextResponse.json({ message: "No valid token provided" }, { status: 401 });
    }

    const data = await request.json();

    const res = await InvoiceaxiosClient.post(
      "/invoices/preview",
      data,
      {
        ...getAuthHeaders(token),
        responseType: "arraybuffer", // Important for PDF stream
      }
    );
    
    return new Response(res.data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=preview.pdf",
      },
    });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
        console.error("Preview invoice error:", error.response?.data || error.message);
        return NextResponse.json(
          { message: error.response?.data?.detail || "Assistant: Something went wrong while generating preview" },
          { status: error.response?.status || 500 }
        );
    }
    console.error("Unexpected error in preview-invoice route:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
