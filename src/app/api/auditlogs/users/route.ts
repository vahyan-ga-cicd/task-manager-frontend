import { axiosClient, getAuthHeaders } from "@/config/axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try {
        const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
        const res = await axiosClient.get(
      "/audit/user",
      getAuthHeaders(token as string)
    );
    return NextResponse.json(res.data);
    } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Failed to fetch admin audit logs");
    }
    throw new Error("Failed to fetch admin audit logs");
  }
}