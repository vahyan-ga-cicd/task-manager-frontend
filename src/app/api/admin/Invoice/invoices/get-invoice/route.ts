import { axiosClient, getAuthHeaders, InvoiceaxiosClient } from "@/config/axios";
import { isAxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token || token === "null" || token === "undefined") {
      return NextResponse.json({ message: "No valid token provided" }, { status: 401 });
    }

    const res = await InvoiceaxiosClient.get(
      "/invoices/get-invoice",
      getAuthHeaders(token)
    );
    
    return NextResponse.json(res.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
        console.error("Get invoices error:", error.response?.data || error.message);
        return NextResponse.json(
          { message: error.response?.data?.detail || "Assistant: Something went wrong while fetching invoices" },
          { status: error.response?.status || 500 }
        );
    }
    console.error("Unexpected error in get-invoice route:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
