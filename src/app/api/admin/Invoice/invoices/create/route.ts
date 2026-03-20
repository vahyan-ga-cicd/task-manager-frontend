import { axiosClient, getAuthHeaders, InvoiceaxiosClient } from "@/config/axios";
import { isAxiosError } from "axios";
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
      "/invoices/create",
      data,
      getAuthHeaders(token)
    );
    
    return NextResponse.json(res.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
        console.error("Create invoice error:", error.response?.data || error.message);
        return NextResponse.json(
          { message: error.response?.data?.detail || "Assistant: Something went wrong while creating invoice" },
          { status: error.response?.status || 500 }
        );
    }
    console.error("Unexpected error in create-invoice route:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
