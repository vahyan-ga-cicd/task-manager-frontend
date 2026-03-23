import { axiosClient, getAuthHeaders } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const res = await axiosClient.get("/admin/my-tasks", getAuthHeaders(token || ""));

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: error.response?.data?.detail || "Something went wrong" },
      { status: error.response?.status || 500 }
    );
  }
}
